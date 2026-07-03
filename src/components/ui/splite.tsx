'use client'

import { Component, Suspense, lazy, type ReactNode, type ErrorInfo } from 'react'
import { Home } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SceneFallback({ reason }: { reason: 'loading' | 'error' }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {reason === 'loading' ? (
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-amber-500/10 to-blue-600/15" />
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-primary/15 blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-amber-500/15 blur-[50px]" />
          <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Home className="h-7 w-7 text-primary" />
            </div>
            <p className="text-white/70 text-sm font-medium">Premium Vacation Homes</p>
            <p className="text-white/40 text-xs">Luxury • Comfort • Adventure</p>
          </div>
          <div className="absolute top-8 right-12 h-24 w-24 rounded-full border border-primary/20 opacity-60" />
          <div className="absolute bottom-16 left-8 h-16 w-16 rounded-full border border-amber-400/20 opacity-60" />
          <div className="absolute top-1/2 right-8 h-10 w-10 rounded-full bg-primary/20 blur-sm" />
        </div>
      )}
    </div>
  )
}

// Class-based boundary required — hooks cannot catch render-time thrown errors
class SplineErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Error silently swallowed — Spline fetch failure is non-fatal
  }

  render() {
    if (this.state.hasError) return <SceneFallback reason="error" />
    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary>
      <Suspense fallback={<SceneFallback reason="loading" />}>
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  )
}
