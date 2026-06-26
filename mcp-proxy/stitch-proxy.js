#!/usr/bin/env node
'use strict';

const https = require('https');
const readline = require('readline');

const API_KEY = process.env.STITCH_API_KEY;

function stitchPost(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: 'stitch.googleapis.com',
        path: '/mcp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'X-Goog-Api-Key': API_KEY,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          } catch (e) {
            reject(new Error(`Failed to parse Stitch response: ${e.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Recursively resolve $ref: "#/$defs/<name>" against a flat defs map.
// `visiting` tracks refs currently being expanded to break cycles.
function resolveRefs(node, defs, visiting = new Set()) {
  if (node === null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((item) => resolveRefs(item, defs, visiting));

  if (typeof node.$ref === 'string') {
    const match = node.$ref.match(/^#\/\$defs\/(.+)$/);
    if (match) {
      const name = match[1];
      if (visiting.has(name)) return { type: 'object', description: `(circular: ${name})` };
      const def = defs[name];
      if (def) return resolveRefs({ ...def }, defs, new Set([...visiting, name]));
    }
    return node; // unknown $ref — leave untouched
  }

  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '$defs') continue; // strip $defs after resolving
    out[k] = resolveRefs(v, defs, visiting);
  }
  return out;
}

// Build a merged $defs map across all tool schemas so cross-schema refs resolve.
// Some tools reference definitions that only exist in another tool's schema.
function buildGlobalDefs(tools) {
  const global = {};
  for (const tool of tools) {
    for (const schema of [tool.inputSchema, tool.outputSchema]) {
      if (schema?.$defs) Object.assign(global, schema.$defs);
    }
  }
  return global;
}

function derefSchema(schema, globalDefs) {
  if (!schema || typeof schema !== 'object') return schema;
  // Local $defs take precedence over global ones.
  const defs = { ...globalDefs, ...(schema.$defs || {}) };
  return resolveRefs(schema, defs);
}

function derefTools(tools) {
  const globalDefs = buildGlobalDefs(tools);
  return tools.map((tool) => ({
    ...tool,
    inputSchema: derefSchema(tool.inputSchema, globalDefs),
    outputSchema: derefSchema(tool.outputSchema, globalDefs),
  }));
}

// ── stdio MCP server ──────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, terminal: false });

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function sendError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

rl.on('line', async (line) => {
  line = line.trim();
  if (!line) return;

  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return; // unparseable — ignore
  }

  // Notifications (no id) need no response
  if (msg.id === undefined) return;

  const { id, method, params } = msg;

  try {
    if (method === 'initialize') {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'stitch-proxy', version: '1.0.0' },
        },
      });
      return;
    }

    if (method === 'ping') {
      send({ jsonrpc: '2.0', id, result: {} });
      return;
    }

    if (method === 'tools/list') {
      const upstream = await stitchPost({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: params ?? {} });
      if (upstream.error) {
        sendError(id, upstream.error.code ?? -32603, upstream.error.message ?? 'Stitch error');
        return;
      }
      const tools = derefTools(upstream.result?.tools ?? []);
      send({ jsonrpc: '2.0', id, result: { tools } });
      return;
    }

    // Forward everything else (tools/call, resources/*, etc.) verbatim
    const upstream = await stitchPost({ jsonrpc: '2.0', id: 1, method, params });
    const reply = { jsonrpc: '2.0', id };
    if (upstream.error) reply.error = upstream.error;
    else reply.result = upstream.result;
    send(reply);
  } catch (err) {
    sendError(id, -32603, err.message);
  }
});

// Let the event loop drain naturally — don't force exit when stdin closes,
// since async tool calls may still be in flight (relevant in test harnesses).
// Claude Code will kill the process when it's done.
