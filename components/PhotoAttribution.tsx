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
      className="fixed right-6 bottom-6 z-50 px-4">
      <div className={`flex gap-1 h-11 items-center p-1 rounded-full border backdrop-blur-md bg-white/5 border-white/10 ${isDark ? "text-white" : "text-text-primary"
        }`}>
        <div className="p-2 bg-transparent">
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
      </div>
    </div>
  )
}
