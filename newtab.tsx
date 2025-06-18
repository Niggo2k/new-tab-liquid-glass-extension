import { format } from "date-fns"
import LiquidGlass from "liquid-glass-react"
import React, { useEffect, useRef, useState } from "react"

import { EnhancedNotionWidget } from "./components/EnhancedNotionWidget"
import { GridItemsContainer } from "./components/GridItemsContainer"
import { PhotoAttribution } from "./components/PhotoAttribution"
import { defaultGridSites } from "./data/defaultGridSites"
import { useBackground } from "./hooks/useBackground"
import { useChromeStorage } from "./hooks/useChromeStorage"
import { useImageIsDark } from "./hooks/useImageIsDark"
import { type Site } from "./types"

import "./styles/globals.css"

export default function Home() {
  const [time, setTime] = React.useState(new Date())
  const [draggedSite, setDraggedSite] = useState<Site | null>(null)
  const { background, attribution } = useBackground()
  const {
    data: gridSites = defaultGridSites.gridSites,
    setData: setGridSites
  } = useChromeStorage<Site[]>("gridSites")
  const isDark = useImageIsDark(background)

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="min-h-screen tracking-wide text-text-primary bg-primary">
        {/* Background */}
        <img
          src={background}
          alt="Background"
          loading="lazy"
          className="!fixed inset-0 top-0 object-cover h-full w-full"
        />
        <div
          className="!fixed inset-0 top-0 content-[''] bg-center bg-cover"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.6) 100%)`
          }}
        />

        {/* Main Container */}
        <div className="relative z-10 p-10 mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="mb-2 text-8xl font-extralight tracking-tighter text-white">
              {format(time, "HH:mm")}
            </div>
            <div className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden">
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
                <span className="text-sm font-normal">
                  {format(time, "EEEE, MMMM d")}
                </span>
              </LiquidGlass>
            </div>
            {/* </div> */}
          </header>

          {/* Dashboard Layout */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 mb-10">
            {/* Grid */}
            <div className="relative mb-10">
              <GridItemsContainer />
            </div>

            {/* Side Widgets */}
            <div className="space-y-6">
              <EnhancedNotionWidget isDark={isDark ? true : false} />
            </div>
          </div>
        </div>

        {/* Photo Attribution */}
        {attribution && <PhotoAttribution {...attribution} isDark={isDark} />}
      </div>
    </>
  )
}
