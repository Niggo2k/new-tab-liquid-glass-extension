import React, { useState } from "react"

import { Site } from "../../next-app/types"
import { defaultGridSites } from "../data/defaultGridSites"
import { useChromeStorage } from "../hooks/useChromeStorage"
import { Modal } from "./Modal"

interface AddSiteModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const {
    data: gridSites = defaultGridSites.gridSites,
    setData: setGridSites
  } = useChromeStorage<Site[]>("gridSites")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSite = {
      id: Date.now().toString(),
      title,
      url: url.startsWith("http") ? url : `https://${url}`
    } as Site
    const newSites = [...gridSites, newSite]
    setGridSites(newSites)
    setTitle("")
    setUrl("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Site">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-text-secondary">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 text-sm transition-all duration-200 bg-transparent border rounded-lg bg-primary/30 border-white/10 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-text-secondary">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 text-sm transition-all duration-200 bg-transparent border rounded-lg bg-primary/30 border-white/10 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none"
            placeholder="example.com"
            required
          />
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm transition-colors rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white transition-colors rounded-lg hover:bg-white/5">
            Add Site
          </button>
        </div>
      </form>
    </Modal>
  )
}
