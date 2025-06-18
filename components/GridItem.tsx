import React, { useState } from "react"

import LiquidGlass from "~node_modules/liquid-glass-react/dist"

import { type Site } from "../../next-app/types"
import { defaultGridSites } from "../data/defaultGridSites"
import { useChromeStorage } from "../hooks/useChromeStorage"
import { Modal } from "./Modal"

interface GridItemProps {
  site: Site
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragEnter: (e: React.DragEvent, index: number) => void
  onDragEnd: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
  isDragging: boolean
}

export const GridItem: React.FC<GridItemProps> = ({
  site,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  isDragging
}) => {
  const faviconUrl =
    site.favicon ||
    (typeof window !== "undefined" && typeof chrome !== "undefined"
      ? `chrome-extension://${
          chrome.runtime.id
        }/_favicon/?pageUrl=${encodeURIComponent(site.url)}&size=128`
      : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
          site.url
        )}&sz=128`)
  const [isEditing, setIsEditing] = useState(false)
  const {
    data: gridSites = defaultGridSites.gridSites,
    setData: setGridSites
  } = useChromeStorage<Site[]>("gridSites")
  const [title, setTitle] = useState(site.title)
  const [url, setUrl] = useState(site.url)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSite = {
      id: site.id,
      favicon: site.favicon,
      title,
      url
    }
    const newSites = gridSites.map((s) => (s.id === site.id ? newSite : s))
    setGridSites(newSites)
    setIsEditing(false)
  }

  const removeSite = (id: string) => {
    const newSites = gridSites.filter((s) => s.id !== id)
    setGridSites(newSites)
  }

  return (
    <>
      <a
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnter={(e) => onDragEnter(e, index)}
        onDragEnd={(e) => onDragEnd(e)}
        onDrop={(e) => onDrop(e, index)}
        href={site.url}
        className="flex relative w-[72px] group mx-auto xs:mx-0 flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer gap-y-2">
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
            className="!transform !translate-x-0 !translate-y-0 !scale-100 mx-auto !w-fit [&>*:nth-last-child(1)]:w-full [&>div]:!overflow-visible rounded-2xl [&>*:nth-last-child(1)>div]:w-full [&>svg]:overflow-hidden [&>svg]:rounded-2xl [&>*:nth-last-child(1)>div]:rounded-2xl [&>div>span]:rounded-2xl [&>div>span]:overflow-clip">
            <div
              // className={`flex items-center h-14 w-14 justify-center bg-[#ffffff40] hover:bg-[#ffffff59] backdrop-blur-md rounded-2xl focus-within:border-4 focus-within:border-accent-purple/50 ${
              // 	isDragging ? "border-4 border-accent-purple/50" : ""
              // }`}
              className={`flex items-center h-14 w-14 justify-center hover:bg-[#ffffff59] rounded-2xl transition-all duration-300 focus-within:border-4 focus-within:border-accent-purple/50 ${
                isDragging ? "border-4 border-accent-purple/50" : ""
              }`}>
              <img
                src={faviconUrl}
                alt={site.title}
                className="object-contain w-8 h-8 rounded-lg pointer-events-none select-none"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.src = "default-favicon.svg"
                }}
              />
            </div>
            <nav
              className={`absolute transition-opacity z-50 duration-150 opacity-0 -top-1 right-0.5 w-5 h-5 group-hover:opacity-100 rounded-2xl ${
                isDragging && "opacity-0!"
              }`}>
              <button
                className="p-1 bg-white rounded-full"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEditing(true)
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5">
                  <path
                    fill="#62757E"
                    fillRule="evenodd"
                    d="M20.651 8.98a2.8 2.8 0 0 0 0-3.96l-1.414-1.414a2.8 2.8 0 0 0-3.96 0L4.182 14.7a2.8 2.8 0 0 0-.81 1.734l-.242 2.74a1.8 1.8 0 0 0 1.952 1.952l2.74-.242a2.8 2.8 0 0 0 1.734-.81L20.65 8.98Zm-1.13-2.829a1.2 1.2 0 0 1 0 1.698l-.915.914-3.112-3.111.915-.915a1.2 1.2 0 0 1 1.697 0l1.414 1.414Zm-5.158.632 3.111 3.111-9.05 9.05a1.2 1.2 0 0 1-.742.347l-2.74.242a.2.2 0 0 1-.218-.217l.242-2.74a1.2 1.2 0 0 1 .347-.743l9.05-9.05Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </LiquidGlass>
        </div>
        <div className="max-w-full text-xs font-semibold text-white truncate">
          {site.title}
        </div>
      </a>
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
              onClick={() => removeSite(site.id)}
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
    </>
  )
}
