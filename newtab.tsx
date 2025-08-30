import { format } from "date-fns"
import LiquidGlass from "liquid-glass-react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { EnhancedNotionWidget } from "./components/EnhancedNotionWidget"
import { GridItemsContainer } from "./components/GridItemsContainer"
import { PhotoAttribution } from "./components/PhotoAttribution"
import { defaultGridSites } from "./data/defaultGridSites"
import { useBackground } from "./hooks/useBackground"
import { useChromeStorage } from "./hooks/useChromeStorage"
import { useImageIsDark } from "./hooks/useImageIsDark"
import { type Site } from "./types"

import "./styles/globals.css"

// Error boundary for LiquidGlass components
class LiquidGlassErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // Log the error but don't throw it
    console.warn("LiquidGlass component error:", error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Memoized time component to prevent unnecessary re-renders
const TimeDisplay = React.memo(({ time }: { time: Date }) => {
  const timeString = useMemo(() => format(time, "HH:mm"), [time])
  const dateString = useMemo(() => format(time, "EEEE, MMMM d"), [time])
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure component is visible and has dimensions before rendering LiquidGlass
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          setIsVisible(true)
        }
      }
    }, 100) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="mb-2 text-8xl font-extralight tracking-tighter text-white">
        {timeString}
      </div>
      <div
        ref={containerRef}
        className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden">
        {isVisible ? (
          <LiquidGlassErrorBoundary
            fallback={
              <div className="px-4 py-2 text-sm font-normal text-white rounded-full backdrop-blur-sm bg-black/20">
                {dateString}
              </div>
            }>
            <LiquidGlass
              displacementScale={100}
              blurAmount={0.1}
              saturation={130}
              aberrationIntensity={2}
              elasticity={0}
              cornerRadius={100}
              mode="shader"
              padding="8px 16px"
              className="!transform !translate-x-0 !translate-y-0 !scale-100 mx-auto !w-fit">
              <span className="text-sm font-normal">{dateString}</span>
            </LiquidGlass>
          </LiquidGlassErrorBoundary>
        ) : (
          <div className="px-4 py-2 text-sm font-normal text-white rounded-full backdrop-blur-sm bg-black/20">
            {dateString}
          </div>
        )}
      </div>
    </>
  )
})

// Memoized background component
const BackgroundLayer = React.memo(({ background }: { background: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  useEffect(() => {
    // Preload the background image
    const img = new Image()
    img.onload = handleImageLoad
    img.src = background
  }, [background, handleImageLoad])

  return (
    <>
      <img
        src={background}
        alt="Background"
        loading="eager"
        decoding="async"
        className={`!fixed inset-0 top-0 object-cover h-full w-full transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleImageLoad}
      />
      <div
        className="!fixed inset-0 top-0 content-[''] bg-center bg-cover"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.6) 100%)`
        }}
      />
    </>
  )
})

// Memoized attribution component
const MemoizedPhotoAttribution = React.memo(PhotoAttribution)

// Memoized notion widget
const MemoizedNotionWidget = React.memo(EnhancedNotionWidget)

// Memoized grid container
const MemoizedGridContainer = React.memo(GridItemsContainer)

export default function Home() {
  const [time, setTime] = useState(() => new Date())
  const { background, attribution } = useBackground()
  const {
    data: gridSites = defaultGridSites.gridSites,
    setData: setGridSites
  } = useChromeStorage<Site[]>("gridSites")

  // Memoize isDark calculation to prevent recalculation on every render
  const isDark = useImageIsDark(background)

  // Optimize time updates - only update when minute changes for better performance
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now)
    }

    // Update immediately
    updateTime()

    // Then update every second, but we could optimize this further
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(
    () => (
      <div className="relative z-10 p-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <TimeDisplay time={time} />
        </header>

        {/* Dashboard Layout */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mb-10">
          {/* Grid */}
          <div className="relative mb-10">
            <MemoizedGridContainer />
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            <MemoizedNotionWidget isDark={isDark} />
          </div>
        </div>
      </div>
    ),
    [time, isDark]
  )

  return (
    <div className="min-h-screen tracking-wide text-text-primary bg-primary">
      {/* Background */}
      <BackgroundLayer background={background} />

      {/* Main Container */}
      {mainContent}

      {/* Photo Attribution */}
      {attribution && (
        <MemoizedPhotoAttribution
          name={attribution.author}
          link={attribution.author_link || "#"}
          isDark={isDark}
        />
      )}
    </div>
  )
}
