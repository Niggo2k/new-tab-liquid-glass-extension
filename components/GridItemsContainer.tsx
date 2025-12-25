import React, { useCallback, useMemo, useRef, useState, useEffect } from "react"

import { useGridStore } from "../stores/gridStore"
import { AddSiteModal } from "./AddSiteModal"
import { GridItem } from "./GridItem"
import type { Site } from "~types"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"

// Memoized add button component
const AddButton = React.memo(({ onClick }: { onClick: () => void }) => {
  return (
    <div className="relative">
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
    </div>
  )
})

export const GridItemsContainer: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  // Use Zustand store directly - this is the single source of truth
  const { gridSites: sites, setGridSites, isHydrated } = useGridStore()

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
          key={site.id || `${site.url}-${index}`}
          site={site}
          index={index}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
          isDark={isDark}
        />
      )),
    [
      sites,
      draggedIndex,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
      handleDrop,
      isDark
    ]
  )

  // Show skeleton while hydrating for smoother UX
  if (!isHydrated) {
    return (
      <div className="grid grid-cols-4 gap-5 mx-auto max-w-lg lg:mx-0 sm:grid-cols-5 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-2xl animate-pulse bg-white/5"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-5 mx-auto max-w-lg lg:mx-0 sm:grid-cols-5 md:grid-cols-6">
      {gridItems}

      {/* Add Button */}
      <Tooltip delayDuration={1000}>
        <TooltipTrigger className="flex mx-auto my-0 h-max">
          <AddButton onClick={handleOpenModal} />
        </TooltipTrigger>
        <TooltipContent side="top" isDark={isDark}>
          Add site
        </TooltipContent>
      </Tooltip>

      {/* Add Site Modal */}
      <AddSiteModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
