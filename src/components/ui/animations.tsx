'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate, useMotionValue, useTransform, useSpring, useMotionTemplate, type Variants } from 'framer-motion'
import {
  Clock, CheckCircle2, XCircle, DollarSign,
  Building2, Home, Users, ShieldCheck, User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Icon registry — only plain strings cross the server/client boundary
const ICON_MAP: Record<string, React.ElementType> = {
  Clock, CheckCircle2, XCircle, DollarSign,
  Building2, Home, Users, ShieldCheck, User,
}

// ─── Shared variants ────────────────────────────────────────────────────────

export const fadeInUpVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeInVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const scaleInVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInRightVariants: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerContainerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export const staggerFastVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.0 } },
}

// ─── FadeInUp ──────────────────────────────────────────────────────────────

interface FadeInUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function FadeInUp({ children, className, delay = 0, once = true }: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInUpVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeIn ────────────────────────────────────────────────────────────────

export function FadeIn({ children, className, delay = 0, once = true }: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerContainer ──────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  fast?: boolean
  once?: boolean
  delay?: number
}

export function StaggerContainer({ children, className, fast = false, once = true, delay = 0 }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })
  const variants = fast ? staggerFastVariants : staggerContainerVariants

  const adjustedVariants: Variants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...(variants.visible as { transition?: object }).transition,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={adjustedVariants}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerItem ───────────────────────────────────────────────────────────

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeInUpVariants}>
      {children}
    </motion.div>
  )
}

// ─── ScaleIn ───────────────────────────────────────────────────────────────

export function ScaleIn({ children, className, delay = 0, once = true }: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={scaleInVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── HoverLift ─────────────────────────────────────────────────────────────

interface HoverLiftProps {
  children: React.ReactNode
  className?: string
  scale?: number
  lift?: number
}

export function HoverLift({ children, className, scale = 1.02, lift = 4 }: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift, scale, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// ─── AnimatedPage ──────────────────────────────────────────────────────────

export function AnimatedPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── CountUp ───────────────────────────────────────────────────────────────

interface CountUpProps {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export function CountUp({ to, duration = 1.4, prefix = '', suffix = '', className, decimals = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate(v) { setDisplayed(v) },
    })
    return () => controls.stop()
  }, [inView, to, duration])

  const formatted = decimals > 0
    ? displayed.toFixed(decimals)
    : Math.round(displayed).toLocaleString()

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

// ─── AnimatedStatCard ──────────────────────────────────────────────────────
// Accepts `iconName` (a plain string) so it can be safely passed from
// Server Components — the actual Lucide component is resolved here in
// the client boundary via ICON_MAP.

export interface AnimatedStatCardProps {
  iconName: string
  label: string
  value: number
  color: string
  bg: string
  index?: number
  isNumber?: boolean
  prefix?: string
  suffix?: string
}

export function AnimatedStatCard({
  iconName,
  label,
  value,
  color,
  bg,
  index = 0,
  isNumber = false,
  prefix = '',
  suffix = '',
}: AnimatedStatCardProps) {
  const Icon = ICON_MAP[iconName] ?? Home
  return (
    <motion.div
      className={cn('rounded-xl border px-4 py-3 flex items-center gap-3', bg)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <div className={cn('h-9 w-9 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={cn('text-lg font-bold leading-none', color)}>
          {isNumber ? (
            <CountUp to={value} prefix={prefix} suffix={suffix} />
          ) : (
            <>{prefix}{value}{suffix}</>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

// ─── Tilt3DCard ────────────────────────────────────────────────────────────────
// GPU-accelerated spring-physics 3D tilt with moving glass shimmer.
// Pass innerClassName with a border-radius (e.g. "rounded-2xl") so the
// shimmer is clipped to match the card shape via overflow-hidden.

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  intensity?: number
  shimmer?: boolean
}

export function Tilt3DCard({
  children,
  className,
  innerClassName,
  intensity = 10,
  shimmer = true,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 })
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%'])
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%'])
  const shineBg = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.15) 0%, transparent 60%)`

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className={className} style={{ perspective: '900px' }}>
      <motion.div
        ref={ref}
        className={cn('relative h-full overflow-hidden', innerClassName)}
        style={{ rotateX, rotateY }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {shimmer && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ background: shineBg }}
          />
        )}
        {children}
      </motion.div>
    </div>
  )
}

// ─── SlideInRight ──────────────────────────────────────────────────────────

export function SlideInRight({ children, className, delay = 0, once = true }: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={slideInRightVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
