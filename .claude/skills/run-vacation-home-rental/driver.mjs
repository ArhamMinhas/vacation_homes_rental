/**
 * Playwright driver for vacation-home-rental (Coastal Horizon)
 * Usage: node driver.mjs [command] [args]
 *   ss [path]           - screenshot current page (default: /tmp/ss.png)
 *   goto <url>          - navigate to url
 *   click <selector>    - click element
 *   fill <sel> <text>   - fill input
 *   wait <ms>           - wait milliseconds
 *   eval <js>           - evaluate JS in page context
 *   flow <name>         - run a named smoke flow
 *     home              - screenshot homepage
 *     properties        - screenshot properties listing
 *     property-detail   - screenshot first property detail page
 *     login             - screenshot login form
 *     register          - screenshot register form
 *
 * Or run interactively: pipe commands line by line to stdin (REPL mode)
 */

import { chromium } from 'playwright'
import { createInterface } from 'readline'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SS_DIR = process.env.SS_DIR || 'C:/Users/arham/AppData/Local/Temp/claude'

let browser, page

async function init() {
  browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  page = await ctx.newPage()
}

async function ss(p = `${SS_DIR}/ss.png`) {
  const abs = resolve(p)
  await page.screenshot({ path: abs, fullPage: false })
  console.log(`screenshot → ${abs}`)
  return abs
}

async function runFlow(name) {
  switch (name) {
    case 'home':
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      return ss(`${SS_DIR}/home.png`)
    case 'properties':
      await page.goto(`${BASE_URL}/properties`, { waitUntil: 'networkidle' })
      return ss(`${SS_DIR}/properties.png`)
    case 'property-detail': {
      await page.goto(`${BASE_URL}/properties`, { waitUntil: 'networkidle' })
      const firstCard = page.locator('a[href^="/properties/"]').first()
      const href = await firstCard.getAttribute('href')
      await page.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle' })
      return ss(`${SS_DIR}/property-detail.png`)
    }
    case 'login':
      await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' })
      return ss(`${SS_DIR}/login.png`)
    case 'register':
      await page.goto(`${BASE_URL}/auth/register`, { waitUntil: 'networkidle' })
      return ss(`${SS_DIR}/register.png`)
    default:
      throw new Error(`Unknown flow: ${name}`)
  }
}

async function runCmd(line) {
  const [cmd, ...rest] = line.trim().split(' ')
  switch (cmd) {
    case 'ss':       return ss(rest[0])
    case 'goto':     await page.goto(rest[0], { waitUntil: 'networkidle' }); console.log(`navigated to ${rest[0]}`); break
    case 'click':    await page.click(rest.join(' ')); console.log('clicked'); break
    case 'fill':     await page.fill(rest[0], rest.slice(1).join(' ')); console.log('filled'); break
    case 'wait':     await page.waitForTimeout(parseInt(rest[0])); break
    case 'eval':     console.log(await page.evaluate(rest.join(' '))); break
    case 'flow':     return runFlow(rest[0])
    case 'quit':
    case 'exit':     process.exit(0)
    default:         console.error(`Unknown command: ${cmd}`)
  }
}

async function main() {
  await init()
  const args = process.argv.slice(2)

  if (args.length > 0) {
    await runCmd(args.join(' '))
    await browser.close()
    return
  }

  // REPL mode
  const rl = createInterface({ input: process.stdin })
  console.log('driver ready — enter commands (ss, goto, click, fill, flow, quit)')
  for await (const line of rl) {
    if (!line.trim()) continue
    await runCmd(line).catch(e => console.error(e.message))
  }
  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
