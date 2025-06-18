import React, { useState } from "react"

import LiquidGlass from "~node_modules/liquid-glass-react/dist"

import { type Site } from "../../next-app/types"
import { defaultGridSites } from "../data/defaultGridSites"
import { useChromeStorage } from "../hooks/useChromeStorage"
import { AddSiteModal } from "./AddSiteModal"
import { GridItem } from "./GridItem"

export const GridItemsContainer: React.FC = () => {
  const { data: gridSites, setData: setGridSites } =
    useChromeStorage<Site[]>("gridSites")
  const sites: Site[] = gridSites || (defaultGridSites.gridSites as Site[])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newSites = [...sites]
    const [draggedSite] = newSites.splice(draggedIndex, 1)
    newSites.splice(index, 0, draggedSite)
    setGridSites(newSites)
    setDraggedIndex(index)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null)
    e.dataTransfer.dropEffect = "none"
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    setDraggedIndex(null)
    e.dataTransfer.dropEffect = "none"
  }

  return (
    <div className="grid grid-cols-4 gap-5 mx-auto max-w-lg lg:mx-0 sm:grid-cols-5 md:grid-cols-6">
      {sites.map((site: Site, index: number) => (
        <GridItem
          key={`${site.url}-${index}`}
          site={site}
          index={index}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
        />
      ))}
      {/* Add Button */}
      <div className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden">
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
            onClick={() => setIsAddModalOpen(true)}
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
      </div>
      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
