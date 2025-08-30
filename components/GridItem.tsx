import React, { useState } from "react"

import LiquidGlass from "~node_modules/liquid-glass-react/dist"

import { type Site } from "../types"
import { useGridStore } from "../stores/gridStore"
import { Modal } from "./Modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import { cn } from "~lib/utils"

interface GridItemProps {
  site: Site
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragEnter: (e: React.DragEvent, index: number) => void
  onDragEnd: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
  isDragging: boolean
  isDark: boolean
}

export const GridItem: React.FC<GridItemProps> = ({
  site,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  isDragging,
  isDark
}) => {
  const faviconUrl =
    site.favicon ||
    (typeof window !== "undefined" && typeof chrome !== "undefined"
      ? `chrome-extension://${chrome.runtime.id
      }/_favicon/?pageUrl=${encodeURIComponent(site.url)}&size=128`
      : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        site.url
      )}&sz=128`)
  const [isEditing, setIsEditing] = useState(false)
  const { updateSite, removeSite } = useGridStore()
  const [title, setTitle] = useState(site.title)
  const [url, setUrl] = useState(site.url)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSite(site.id, { title, url })
    setIsEditing(false)
  }

  const handleRemoveSite = (id: string) => {
    removeSite(id)
  }

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger>
        <a
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={(e) => onDragEnd(e)}
          onDrop={(e) => onDrop(e, index)}
          href={site.url}
          className="flex relative w-[72px] group mx-auto xs:mx-0 flex-col items-center justify-center text-center  cursor-pointer gap-y-2">
          <div
            className={`flex items-center h-14 w-14 justify-center bg-[#ffffff03] shadow-[inset_1px_1px_1px_0px_#ffffff3b] hover:bg-[#ffffff59] backdrop-blur-md rounded-2xl transition-all duration-300 focus-within:border-4 focus-within:border-accent-purple/50 ${isDragging ? "border-4 border-accent-purple/50" : ""
              }`}
            style={{ backdropFilter: 'blur(12px)' }}>
            <img
              src={faviconUrl}
              loading="lazy"
              alt={site.title}
              className="object-contain w-8 h-8 rounded-lg pointer-events-none select-none"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = "default-favicon.svg"
              }}
            />
          </div>
          <nav
            className={`absolute transition-opacity z-50 duration-150 opacity-0 -top-1 right-0.5 w-5 h-5 group-hover:opacity-100 rounded-2xl ${isDragging && "opacity-0!"
              }`}>
            <button
              aria-label="Edit site"
              className="p-1 bg-white rounded-full select-none text-primary/60"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsEditing(true)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                className="w-3.5 h-3.5" fill="currentColor">
                <g clipPath="url(#clip0_4482_4868)">
                  <path d="M20.6899 3.32C19.8399 2.47 18.7199 2 17.5199 2C16.3199 2 15.1899 2.47 14.3499 3.32L3.48989 14.18C2.99989 14.67 2.6699 15.32 2.5699 16.01L2.02989 19.83C1.92989 20.46 2.11989 21.06 2.52989 21.48C2.87989 21.82 3.34989 22 3.86989 22C3.96989 22 4.06989 22 4.17989 21.98L7.9999 21.44C8.6899 21.34 9.33988 21.01 9.82988 20.52L20.6899 9.66C21.5399 8.81 21.9999 7.69 21.9999 6.49C21.9999 5.29 21.5399 4.17 20.6899 3.32ZM17.7799 7.5L16.2099 9.07C16.0399 9.24 15.8099 9.33 15.5699 9.33C15.3399 9.33 15.1099 9.24 14.9399 9.07C14.5899 8.72 14.5899 8.15 14.9399 7.8L16.5099 6.23C16.8599 5.88 17.4299 5.88 17.7799 6.23C18.1299 6.58 18.1299 7.15 17.7799 7.5Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_4482_4868">
                    <rect width="24" height="24" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </nav>
          <div className="max-w-full text-xs font-semibold text-white truncate">
            {site.title}
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent isDark={!isDark}>
        {site.title}
      </TooltipContent>
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Site">
        <div className="flex flex-col gap-y-4 w">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 w-full text-sm bg-transparent rounded-lg border transition-all duration-200 bg-primary/30 border-white/10 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none"
              placeholder="Enter site title"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="p-3 w-full text-sm bg-transparent rounded-lg border transition-all duration-200 bg-primary/30 border-white/10 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none"
              placeholder="Enter site URL"
            />
          </div>
          <div className="flex pt-6 space-x-3 w-full">
            <button
              onClick={() => handleRemoveSite(site.id)}
              className="px-4 py-2 text-sm rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:bg-white/5">
              Remove
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:bg-white/5">
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm text-white rounded-lg transition-colors hover:bg-white/5"
              onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </Tooltip>
  )
}
