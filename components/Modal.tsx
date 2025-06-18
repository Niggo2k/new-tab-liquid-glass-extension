import LiquidGlass from "liquid-glass-react"
import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  //   if (!isOpen) return null

  return (
    <div
      className={`flex fixed inset-0 z-50 justify-center items-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur bg-black/50 transition-all duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden w-full max-w-xl">
        <LiquidGlass
          displacementScale={100}
          blurAmount={0.1}
          saturation={130}
          aberrationIntensity={2}
          elasticity={0}
          cornerRadius={16}
          mode="shader"
          padding="0px"
          className="!transform !translate-x-0 !translate-y-0 !scale-100 w-full [&>*:nth-last-child(1)]:w-full [&>*:nth-last-child(1)>div]:w-full">
          {/* Modal */}
          <div className="relative z-50 p-6 w-full max-w-3xl rounded-lg shadow-xl bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="transition-colors text-text-secondary hover:text-text-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </LiquidGlass>
      </div>
    </div>
  )
}
