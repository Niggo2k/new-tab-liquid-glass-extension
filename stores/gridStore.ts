import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type Site } from "../types"
import { defaultGridSites } from "../data/defaultGridSites"

interface GridStore {
  gridSites: Site[]
  isHydrated: boolean
  setGridSites: (sites: Site[]) => void
  updateSite: (id: string, updates: Partial<Site>) => void
  addSite: (site: Site) => void
  removeSite: (id: string) => void
  resetToDefaults: () => void
  setHydrated: (hydrated: boolean) => void
}

// Custom storage adapter for Chrome extension storage
const chromeStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const result = await chrome.storage.local.get(name)
      return result[name] ?? null
    } catch {
      // Fallback to localStorage
      return localStorage.getItem(name)
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await chrome.storage.local.set({ [name]: value })
    } catch {
      localStorage.setItem(name, value)
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await chrome.storage.local.remove(name)
    } catch {
      localStorage.removeItem(name)
    }
  }
}

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      gridSites: defaultGridSites.gridSites,
      isHydrated: false,

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      
      setGridSites: (sites) => set({ gridSites: sites }),
      
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
      name: "gridSites", // Changed to match the key used by useChromeStorage
      storage: createJSONStorage(() => chromeStorage),
      onRehydrateStorage: () => (state) => {
        // Called when hydration is complete
        state?.setHydrated(true)
      },
      // Skip hydration warning and handle it gracefully
      skipHydration: false
    }
  )
)

// Pre-hydration: try to load from storage before React renders
// This helps with faster initial load
const preloadStore = async () => {
  try {
    const stored = await chromeStorage.getItem("gridSites")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.state?.gridSites) {
        useGridStore.setState({ 
          gridSites: parsed.state.gridSites,
          isHydrated: true 
        })
      }
    }
  } catch {
    // Ignore errors, will use defaults
  }
}

// Start preloading immediately
preloadStore()

// Also listen for chrome storage changes to sync across tabs/windows
if (typeof chrome !== "undefined" && chrome.storage?.local?.onChanged) {
  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.gridSites?.newValue) {
      try {
        const parsed = JSON.parse(changes.gridSites.newValue)
        if (parsed?.state?.gridSites) {
          useGridStore.setState({ gridSites: parsed.state.gridSites })
        }
      } catch {
        // Ignore parse errors
      }
    }
  })
}
