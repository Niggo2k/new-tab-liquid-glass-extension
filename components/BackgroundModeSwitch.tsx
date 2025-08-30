import React from "react"
import { useBackgroundStore } from "../stores/backgroundStore"

export const BackgroundModeSwitch: React.FC = () => {
  const { useShader, toggleBackgroundMode } = useBackgroundStore()

  // SVG Icons
  const WallpaperIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className={className} fill="currentColor">
      <g clip-path="url(#clip0_4418_8046)">
        <path d="M22.0199 16.8203L18.8899 9.50027C18.3199 8.16027 17.4699 7.40027 16.4999 7.35027C15.5399 7.30027 14.6099 7.97027 13.8999 9.25027L11.9999 12.6603C11.5999 13.3803 11.0299 13.8103 10.4099 13.8603C9.77989 13.9203 9.14989 13.5903 8.63989 12.9403L8.41989 12.6603C7.70989 11.7703 6.82989 11.3403 5.92989 11.4303C5.02989 11.5203 4.25989 12.1403 3.74989 13.1503L2.01989 16.6003C1.39989 17.8503 1.45989 19.3003 2.18989 20.4803C2.91989 21.6603 4.18989 22.3703 5.57989 22.3703H18.3399C19.6799 22.3703 20.9299 21.7003 21.6699 20.5803C22.4299 19.4603 22.5499 18.0503 22.0199 16.8203Z" fill="currentColor" />
        <path d="M6.97009 8.38012C8.83681 8.38012 10.3501 6.86684 10.3501 5.00012C10.3501 3.13339 8.83681 1.62012 6.97009 1.62012C5.10337 1.62012 3.59009 3.13339 3.59009 5.00012C3.59009 6.86684 5.10337 8.38012 6.97009 8.38012Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_4418_8046">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  )

  const ShaderIcon = ({ className }: { className?: string }) => (
    // <svg
    //   width="18"
    //   height="18"
    //   viewBox="0 0 24 24"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={className}
    // >
    //   <circle
    //     cx="12"
    //     cy="12"
    //     r="3"
    //     stroke="currentColor"
    //     strokeWidth="2"
    //     fill="none"
    //   />
    //   <path
    //     d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24M7.76 16.24l-4.24 4.24m12.73 0l-4.24-4.24M7.76 7.76L3.52 3.52"
    //     stroke="currentColor"
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    //   <circle
    //     cx="12"
    //     cy="12"
    //     r="1"
    //     fill="currentColor"
    //     className="animate-pulse"
    //   />
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 8.35999H4.03V8.26999L4 8.35999Z" fill="currentColor" />
      <path d="M18.69 13.63H20.19V17.13L19.78 17.34L17.95 18.26L17.28 18.6L16.6 17.26L17.27 16.92L18.69 16.21V13.63Z" fill="currentColor" />
      <path d="M14.28 9.25L14.96 10.59L14.29 10.93L12.86 11.65V14.21H11.36V11.63L9.94 10.92L9.27 10.58L9.95 9.23999L12.12 10.34L13.61 9.59L14.28 9.25Z" fill="currentColor" />
      <path d="M14.27 18.41L14.95 19.75L14.28 20.09L12.45 21.01L12.11 21.18L11.77 21.01L9.94 20.09L9.27 19.75L9.95 18.41L10.62 18.75L11.36 19.12V17.3H12.86V19.12L13.6 18.75L14.27 18.41Z" fill="currentColor" />
      <path d="M20.2 7.04999V10.55H18.7V8.72L17.94 9.09L17.27 9.41998L16.61 8.07999L17.28 7.75L17.77 7.51001L17.28 7.26001L16.61 6.91998L17.29 5.57999L17.96 5.91998L19.79 6.84L20.2 7.04999Z" fill="currentColor" />
      <path d="M14.29 4.09L14.96 4.42999L14.28 5.76999L13.61 5.42999L12.12 4.67999L10.63 5.42999L9.96001 5.76999L9.28 4.42999L9.95 4.09L11.78 3.16998L12.12 3L12.46 3.16998L14.29 4.09Z" fill="currentColor" />
      <path d="M7.62 17.26L6.94 18.6L6.27 18.26L4.44 17.34L4.03 17.13V13.63H5.53V16.21L6.95 16.92L7.62 17.26Z" fill="currentColor" />
      <path d="M6.85001 7.70999L7.56 7.94L7.10001 9.35999L6.39 9.13L5.53 8.85001V10.55H4.03V7.04999L4.44 6.84L6.27 5.91998L6.94 5.57999L7.62 6.91998L6.95 7.26001L6.36 7.54999L6.85001 7.70999Z" fill="currentColor" />
    </svg>
  )

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex gap-1 items-center p-1 rounded-full border backdrop-blur-md bg-white/5 border-white/10">
        {/* Wallpaper Button */}
        <button
          onClick={() => !useShader || toggleBackgroundMode()}
          className={`flex items-center gap-0 rounded-full transition-all duration-300 overflow-hidden group ${!useShader
            ? 'px-4 py-2 text-gray-800 bg-white shadow-sm'
            : 'p-2 bg-transparent text-white/70 hover:text-white hover:bg-white/5'
            }`}
          aria-label="Switch to wallpaper mode"
        >
          <WallpaperIcon className="flex-shrink-0 transition-colors duration-300" />
          <span
            className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${!useShader
              ? 'ml-2 opacity-100 max-w-[80px]'
              : 'overflow-hidden ml-0 max-w-0 opacity-0'
              }`}
          >
            Wallpaper
          </span>
        </button>

        {/* Shader Button */}
        <button
          onClick={() => useShader || toggleBackgroundMode()}
          className={`flex items-center gap-0 rounded-full transition-all duration-300 overflow-hidden group ${useShader
            ? 'px-4 py-2 text-gray-800 bg-white shadow-sm'
            : 'p-2 bg-transparent text-white/70 hover:text-white hover:bg-white/5'
            }`}
          aria-label="Switch to shader mode"
        >
          <ShaderIcon className="flex-shrink-0 transition-colors duration-300" />
          <span
            className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${useShader
              ? 'ml-2 opacity-100 max-w-[60px]'
              : 'overflow-hidden ml-0 max-w-0 opacity-0'
              }`}
          >
            Shader
          </span>
        </button>
      </div>
    </div>
  )
}