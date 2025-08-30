import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type Site } from "../types"
import { defaultGridSites } from "../data/defaultGridSites"

interface GridStore {
  gridSites: Site[]
  setGridSites: (sites: Site[]) => void
  updateSite: (id: string, updates: Partial<Site>) => void
  addSite: (site: Site) => void
  removeSite: (id: string) => void
  resetToDefaults: () => void
}

// Custom storage adapter for Chrome extension storage
const chromeStorage = {
  getItem: async (name: string) => {
    try {
      const result = await chrome.storage.local.get(name)
      return result[name] || null
    } catch {
      return null
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await chrome.storage.local.set({ [name]: value })
    } catch {
      // Fallback to localStorage if chrome storage is not available
      localStorage.setItem(name, value)
    }
  },
  removeItem: async (name: string) => {
    try {
      await chrome.storage.local.remove(name)
    } catch {
      localStorage.removeItem(name)
    }
  }
}

export const useGridStore = create<GridStore>()(
  persist(
    (set) => ({
      gridSites: defaultGridSites.gridSites,
      
      setGridSites: (sites) => 
        set({ gridSites: sites }),
      
      updateSite: (id, updates) =>
        set((state) => ({
          gridSites: state.gridSites.map(site =>
            site.id === id ? { ...site, ...updates } : site
          )
        })),
      
      addSite: (site) =>
        set((state) => ({
          gridSites: [...state.gridSites, site]
        })),
      
      removeSite: (id) =>
        set((state) => ({
          gridSites: state.gridSites.filter(site => site.id !== id)
        })),
      
      resetToDefaults: () =>
        set({ gridSites: defaultGridSites.gridSites })
    }),
    {
      name: "grid-sites",
      storage: createJSONStorage(() => chromeStorage)
    }
  )
)