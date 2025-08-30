import { useEffect, useMemo, useState } from "react"

import { wallpaper } from "../data/wallpaper"
import { useChromeStorage } from "./useChromeStorage"

interface BackgroundAttribution {
  description: string
  author: string
  author_link?: string
}

export const useBackground = () => {
  const [currentBackground, setCurrentBackground] = useState<string>("")
  const [currentAttribution, setCurrentAttribution] =
    useState<BackgroundAttribution | null>(null)

  const { data: cachedWallpaper, setData: setCachedWallpaper } =
    useChromeStorage<{
      url: string
      attribution: BackgroundAttribution
      timestamp: number
    }>("backgroundWallpaper")

  // Initialize background immediately for faster loading
  useEffect(() => {
    const loadBackground = () => {
      // Check if we have a cached wallpaper that's less than 6 hours old
      if (cachedWallpaper?.url && cachedWallpaper?.timestamp) {
        const hoursSinceLastUpdate =
          (Date.now() - cachedWallpaper.timestamp) / (1000 * 60 * 60)
        if (hoursSinceLastUpdate < 6) {
          setCurrentBackground(cachedWallpaper.url)
          setCurrentAttribution(cachedWallpaper.attribution)
          return
        }
      }

      // Get a new random wallpaper
      const randomWallpaper =
        wallpaper[Math.floor(Math.random() * wallpaper.length)]
      const attribution: BackgroundAttribution = {
        description: randomWallpaper.description,
        author: randomWallpaper.author,
        author_link: (randomWallpaper as any).author_link
      }

      setCurrentBackground(randomWallpaper.url)
      setCurrentAttribution(attribution)

      // Cache the selection
      setCachedWallpaper({
        url: randomWallpaper.url,
        attribution,
        timestamp: Date.now()
      })
    }

    loadBackground()
  }, [cachedWallpaper, setCachedWallpaper])

  return {
    background: currentBackground,
    attribution: currentAttribution
  }
}
