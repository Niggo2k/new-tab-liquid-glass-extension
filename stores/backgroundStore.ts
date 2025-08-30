import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type ShaderType = "circular" | "line" | "sinus"

interface BackgroundStore {
  useShader: boolean
  currentShader: ShaderType | null
  toggleBackgroundMode: () => void
  setCurrentShader: (shader: ShaderType | null) => void
  randomizeShader: () => void
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

export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set) => ({
      useShader: false,
      currentShader: null,
      
      toggleBackgroundMode: () => 
        set((state) => {
          const newUseShader = !state.useShader
          if (newUseShader) {
            // When enabling shader mode, select a random shader
            const shaders: ShaderType[] = ["circular", "line", "sinus"]
            const randomShader = shaders[Math.floor(Math.random() * shaders.length)]
            return { 
              useShader: newUseShader, 
              currentShader: randomShader 
            }
          }
          return { 
            useShader: newUseShader, 
            currentShader: null 
          }
        }),
      
      setCurrentShader: (shader) => 
        set({ currentShader: shader }),
      
      randomizeShader: () => 
        set(() => {
          const shaders: ShaderType[] = ["circular", "line", "sinus"]
          const randomShader = shaders[Math.floor(Math.random() * shaders.length)]
          return { currentShader: randomShader }
        })
    }),
    {
      name: "background-preferences",
      storage: createJSONStorage(() => chromeStorage)
    }
  )
)