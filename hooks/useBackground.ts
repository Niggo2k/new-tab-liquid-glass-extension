import { useEffect, useState } from "react"

import { wallpaper } from "../data/wallpaper"
import { useChromeStorage } from "./useChromeStorage"

interface UnsplashResponse {
  urls: {
    regular: string
  }
  user: {
    name: string
    links: {
      html: string
    }
  }
  links: {
    download_location: string
  }
}

export const useBackground = () => {
  const [background, setBackground] = useState<string>("")
  const [attribution, setAttribution] = useState<{
    name: string
    link: string
  } | null>(null)
  const { data: cachedImage, setData: setCachedImage } =
    useChromeStorage("backgroundImage")

  const fetchRandomPhoto = async () => {
    const randomWallpaper =
      wallpaper[Math.floor(Math.random() * wallpaper.length)]
    return randomWallpaper
  }

  useEffect(() => {
    const loadBackground = async () => {
      // Try to use cached image
      const image = cachedImage as
        | { url: string; timestamp: number }
        | undefined
      if (image?.url && image?.timestamp) {
        const hoursSinceLastUpdate =
          (Date.now() - image.timestamp) / (1000 * 60 * 60)
        if (hoursSinceLastUpdate < 6) {
          setBackground(image.url)
          return
        }
      }

      // Fetch new image
      const photo = await fetchRandomPhoto()
      if (photo) {
        setBackground(photo.url)
        setAttribution({
          name: photo.author,
          link: photo.author_link
        })
        setCachedImage({
          url: photo.url,
          timestamp: Date.now()
        })
      }
    }

    loadBackground()
  }, [cachedImage, setCachedImage])

  return { background, attribution }
}
