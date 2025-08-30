import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import LiquidGlass from "~node_modules/liquid-glass-react/dist"

import { type Site } from "../../next-app/types"
import { defaultGridSites } from "../data/defaultGridSites"
import { useChromeStorage } from "../hooks/useChromeStorage"
import { AddSiteModal } from "./AddSiteModal"
import { GridItem } from "./GridItem"

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
    console.warn("LiquidGlass component error:", error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Memoized add button component with dimension checking
const AddButton = React.memo(({ onClick }: { onClick: () => void }) => {
  const [isReady, setIsReady] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait for component to be properly mounted and sized
    const checkDimensions = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true)
        }
      }
    }

    const timer = setTimeout(checkDimensions, 150)

    // Add ResizeObserver for better reliability
    let resizeObserver: ResizeObserver | undefined
    if (buttonRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(checkDimensions)
      resizeObserver.observe(buttonRef.current)
    }

    return () => {
      clearTimeout(timer)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div
      ref={buttonRef}
      className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden">
      {isReady ? (
        <LiquidGlassErrorBoundary
          fallback={
            <button
              onClick={onClick}
              className="flex justify-center items-center mx-auto w-14 h-14 xs:mx-0 bg-[#ffffff03] shadow-[inset_1px_1px_1px_0px_#ffffff3b] hover:bg-[#ffffff59] backdrop-blur-md rounded-2xl transition-all duration-300 cursor-pointer">
              <svg
                className="w-4 h-4 text-white transition-colors group-hover:text-accent-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          }>
          <LiquidGlass
            displacementScale={100}
            blurAmount={0.1}
            saturation={130}
            aberrationIntensity={2}
            elasticity={0}
            cornerRadius={16}
            mode="shader"
            padding="0px"
            className="!transform !translate-x-0 !translate-y-0 !scale-100 mx-auto !w-fit">
            <button
              onClick={onClick}
              className="flex justify-center items-center mx-auto w-14 h-14 xs:mx-0 hover:bg-[#ffffff59] transition-all duration-300 cursor-pointer">
              <svg
                className="w-4 h-4 text-white transition-colors group-hover:text-accent-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </LiquidGlass>
        </LiquidGlassErrorBoundary>
      ) : (
        <button
          onClick={onClick}
          className="flex justify-center items-center mx-auto w-14 h-14 xs:mx-0 bg-[#ffffff03] shadow-[inset_1px_1px_1px_0px_#ffffff3b] hover:bg-[#ffffff59] backdrop-blur-md rounded-2xl transition-all duration-300 cursor-pointer">
          <svg
            className="w-4 h-4 text-white transition-colors group-hover:text-accent-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  )
})

export const GridItemsContainer: React.FC = () => {
  const { data: gridSites, setData: setGridSites } =
    useChromeStorage<Site[]>("gridSites")

  // Memoize sites array to prevent unnecessary re-renders
  const sites: Site[] = useMemo(
    () => gridSites || (defaultGridSites.gridSites as Site[]),
    [gridSites]
  )

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Memoize drag handlers to prevent re-creation on every render
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragEnter = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return

      const newSites = [...sites]
      const [draggedSite] = newSites.splice(draggedIndex, 1)
      newSites.splice(index, 0, draggedSite)
      setGridSites(newSites)
      setDraggedIndex(index)
    },
    [draggedIndex, sites, setGridSites]
  )

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedIndex(null)
    e.dataTransfer.dropEffect = "none"
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(null)
    e.dataTransfer.dropEffect = "none"
  }, [])

  const handleOpenModal = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsAddModalOpen(false)
  }, [])

  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(
    () =>
      sites.map((site: Site, index: number) => (
        <GridItem
          key={site.id || `${site.url}-${index}`} // Use site.id if available for better key stability
          site={site}
          index={index}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
        />
      )),
    [
      sites,
      draggedIndex,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
      handleDrop
    ]
  )

  return (
    <div className="grid grid-cols-4 gap-5 mx-auto max-w-lg lg:mx-0 sm:grid-cols-5 md:grid-cols-6">
      {gridItems}

      {/* Add Button */}
      <AddButton onClick={handleOpenModal} />

      {/* Add Site Modal */}
      <AddSiteModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
