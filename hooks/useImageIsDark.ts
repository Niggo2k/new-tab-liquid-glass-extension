import { useEffect, useState } from "react"

/**
 * useImageIsDark
 * Determines whether an image is predominantly dark or light.
 *
 * @param {string} imageUrl - The URL of the image to analyze.
 * @returns {boolean|null} - `true` if the image is dark, `false` if light, and `null` if not yet determined or no image.
 */
export function useImageIsDark(imageUrl) {
  const [isDark, setIsDark] = useState(null)

  useEffect(() => {
    // Only run if we have an image URL and are in the browser
    if (!imageUrl || typeof window === "undefined") {
      setIsDark(null)
      return
    }

    let isCancelled = false
    const img = new Image()

    // Helps avoid cross-origin issues if the server supports it
    img.crossOrigin = "Anonymous"
    img.src = imageUrl

    img.onload = () => {
      if (isCancelled) return

      // Create an offscreen canvas
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data } = imageData

      let totalBrightness = 0
      let pixelCount = 0

      // For performance reasons, consider sampling a subset of pixels
      // For example, stepping by 4*10 (skip every 10 pixels)
      // so you're not scanning every single pixel in a large image
      const step = 4 * 100
      for (let i = 0; i < data.length; i += step) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        // Simple average brightness
        const brightness = (r + g + b) / 3
        totalBrightness += brightness
        pixelCount++
      }

      const averageBrightness = totalBrightness / pixelCount
      // A simple threshold to decide dark vs light
      // You might adjust this threshold to fit your needs
      const threshold = 128

      setIsDark(averageBrightness < threshold)
    }

    // Clean-up if the component unmounts
    return () => {
      isCancelled = true
    }
  }, [imageUrl])

  return isDark
}
