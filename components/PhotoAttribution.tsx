import React from "react"

interface PhotoAttributionProps {
  name: string
  link: string
  isDark: boolean
}

export const PhotoAttribution: React.FC<PhotoAttributionProps> = ({
  name,
  link,
  isDark
}) => {
  return (
    <div
      className={`fixed right-6 bottom-6 z-20 px-4 py-2 text-sm rounded-2xl border opacity-70 backdrop-blur transition-opacity text-shadow bg-primary/80 border-white/5 hover:opacity-100 ${
        isDark ? "text-white" : "text-text-primary"
      }`}>
      Photo by{" "}
      <a
        href={`${link}?utm_source=dev_dashboard&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline transition-opacity text-text-primary hover:opacity-80">
        {name}
      </a>{" "}
      on{" "}
      <a
        href="https://unsplash.com/?utm_source=dev_dashboard&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline transition-opacity text-text-primary hover:opacity-80">
        Unsplash
      </a>
    </div>
  )
}
