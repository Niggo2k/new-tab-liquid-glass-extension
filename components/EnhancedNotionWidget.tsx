import LiquidGlass from "liquid-glass-react"
import React, { useEffect, useState } from "react"

import { useBackground } from "../hooks/useBackground"
import { useChromeStorage } from "../hooks/useChromeStorage"
import { useImageIsDark } from "../hooks/useImageIsDark"
import { NotionRichText } from "./NotionRichText"

interface NotionConfig {
  apiKey: string
  pageId: string
}

interface NotionBlock {
  type: string
  id: string
  [key: string]: any
}

export const EnhancedNotionWidget: React.FC<{ isDark: boolean }> = ({
  isDark
}) => {
  const [blocks, setBlocks] = useState<NotionBlock[]>([])
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [config, setConfig] = useState<NotionConfig>({
    apiKey: "",
    pageId: ""
  })
  const { data: storedConfig, setData: setStoredConfig } =
    useChromeStorage<NotionConfig>("notionConfig")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { background } = useBackground()

  useEffect(() => {
    if (storedConfig) {
      setConfig(storedConfig)
      fetchNotionContent(storedConfig)
    }
  }, [storedConfig])

  const fetchNotionContent = async (config: NotionConfig) => {
    if (!config.apiKey || !config.pageId) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.notion.com/v1/blocks/${config.pageId}/children?page_size=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Access-Control-Allow-Origin": "*",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          cache: "force-cache",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch blocks")
      }

      const data = await response.json()
      setBlocks(data.results)
      setError(null)
    } catch (err) {
      setError(
        "Failed to fetch Notion content. Please check your configuration."
      )
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentUpdate = async (json: string) => {
    if (!config.apiKey || !config.pageId) return

    try {
      const tiptapJson = JSON.parse(json)
      const notionBlocks = convertTiptapToNotionBlocks(tiptapJson)

      if (notionBlocks.length === 0) {
        // If no blocks, create at least an empty paragraph
        notionBlocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: []
          }
        })
      }

      setIsSaving(true)

      // First, delete all existing blocks
      const existingBlocks = await fetch(
        `https://api.notion.com/v1/blocks/${config.pageId}/children?page_size=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          }
        }
      )

      if (!existingBlocks.ok) {
        throw new Error("Failed to fetch existing blocks")
      }

      const existingBlocksData = await existingBlocks.json()

      // Delete each block
      for (const block of existingBlocksData.results) {
        await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Notion-Version": "2022-06-28"
          }
        })
      }

      // Then insert new blocks
      const response = await fetch(
        `https://api.notion.com/v1/blocks/${config.pageId}/children`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            children: notionBlocks
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Notion API Error:", errorData)
        throw new Error(`Failed to update content: ${errorData.message}`)
      }

      // Refresh blocks after successful update
      await fetchNotionContent(config)
      setError(null)
    } catch (err) {
      setError("Failed to save changes. Please try again.")
      console.error("Error updating content:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const convertTiptapToNotionBlocks = (tiptapJson: any) => {
    const notionBlocks: any[] = []

    // Helper function to convert text content to Notion's rich_text format
    const convertTextContent = (textContent: any) => {
      if (!Array.isArray(textContent)) return []

      return textContent.map((item: any) => ({
        type: "text",
        text: {
          content: item.text || "",
          link: null
        },
        annotations: {
          bold: item.marks?.some((m: any) => m.type === "bold") || false,
          italic: item.marks?.some((m: any) => m.type === "italic") || false,
          strikethrough:
            item.marks?.some((m: any) => m.type === "strike") || false,
          underline:
            item.marks?.some((m: any) => m.type === "underline") || false,
          code: item.marks?.some((m: any) => m.type === "code") || false,
          color: "default"
        },
        plain_text: item.text || ""
      }))
    }

    // Process each node in the Tiptap document
    const processNode = (node: any) => {
      if (!node) return

      switch (node.type) {
        case "paragraph":
          notionBlocks.push({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: convertTextContent(node.content || []),
              color: "default"
            }
          })
          break

        case "heading":
          const level = node.attrs?.level || 1
          notionBlocks.push({
            object: "block",
            type: `heading_${level}`,
            [`heading_${level}`]: {
              rich_text: convertTextContent(node.content || []),
              color: "default",
              is_toggleable: false
            }
          })
          break

        case "bulletList":
          // Handle each list item separately
          node.content?.forEach((listItem: any) => {
            if (listItem.type === "listItem" && listItem.content?.[0]) {
              notionBlocks.push({
                object: "block",
                type: "bulleted_list_item",
                bulleted_list_item: {
                  rich_text: convertTextContent(
                    listItem.content[0].content || []
                  ),
                  color: "default"
                }
              })
              // Process any nested content
              listItem.content.slice(1).forEach((nestedNode: any) => {
                processNode(nestedNode)
              })
            }
          })
          break

        case "orderedList":
          node.content?.forEach((listItem: any) => {
            if (listItem.type === "listItem" && listItem.content?.[0]) {
              notionBlocks.push({
                object: "block",
                type: "numbered_list_item",
                numbered_list_item: {
                  rich_text: convertTextContent(
                    listItem.content[0].content || []
                  ),
                  color: "default"
                }
              })
              // Process any nested content
              listItem.content.slice(1).forEach((nestedNode: any) => {
                processNode(nestedNode)
              })
            }
          })
          break

        case "taskList":
          node.content?.forEach((listItem: any) => {
            if (listItem.type === "taskItem" && listItem.content?.[0]) {
              notionBlocks.push({
                object: "block",
                type: "to_do",
                to_do: {
                  rich_text: convertTextContent(
                    listItem.content[0].content || []
                  ),
                  checked: listItem.attrs?.checked || false,
                  color: "default"
                }
              })
              // Process any nested content
              listItem.content.slice(1).forEach((nestedNode: any) => {
                processNode(nestedNode)
              })
            }
          })
          break

        case "codeBlock":
          notionBlocks.push({
            object: "block",
            type: "code",
            code: {
              rich_text: convertTextContent(node.content || []),
              language: node.attrs?.language || "plain text",
              caption: []
            }
          })
          break

        case "blockquote":
          notionBlocks.push({
            object: "block",
            type: "quote",
            quote: {
              rich_text: convertTextContent(node.content || []),
              color: "default"
            }
          })
          break

        case "horizontalRule":
          notionBlocks.push({
            object: "block",
            type: "divider",
            divider: {}
          })
          break

        // Handle nested content
        case "listItem":
        case "taskItem":
          if (node.content?.[0]) {
            node.content.forEach((childNode: any) => {
              processNode(childNode)
            })
          }
          break

        default:
          // For any other node types, try to process their content
          if (node.content) {
            node.content.forEach((childNode: any) => {
              processNode(childNode)
            })
          }
          break
      }
    }

    // Start processing from the root document
    if (tiptapJson.type === "doc" && tiptapJson.content) {
      tiptapJson.content.forEach((node: any) => processNode(node))
    }

    return notionBlocks
  }

  const handleSaveConfig = () => {
    setStoredConfig(config)
    setIsConfiguring(false)
    fetchNotionContent(config)
  }

  if (isConfiguring) {
    return (
      <div className="relative">
        <div className="rounded-2xl p-7 bg-[#ffffff03] shadow-[inset_1px_1px_1px_0px_#ffffff3b] backdrop-blur-md transition-all duration-300 hover:border-white/10 h-[450px] w-full flex flex-col">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-lg font-medium tracking-wide ${isDark ? "text-text-primary" : "text-text-tertiary"
                  }`}>
                Notion Configuration
              </h3>
              <button
                onClick={() => setIsConfiguring(false)}
                className={`flex justify-center items-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-white/10 text-text-secondary hover:text-text-primary focus:ring-2 focus:ring-accent-purple/20 ${isDark
                  ? "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  : "text-text-tertiary hover:text-text-primary hover:bg-black/5"
                  } ${isConfiguring ? "rotate-0" : "rotate-45"}`}>
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${isDark ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) =>
                      setConfig({ ...config, apiKey: e.target.value })
                    }
                    className={`w-full p-3 text-sm transition-all duration-200 bg-transparent border rounded-lg bg-primary/30 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none ${isDark
                      ? "text-text-primary border-white/10"
                      : "text-text-tertiary border-black/10"
                      }`}
                    placeholder="Enter your Notion API key"
                  />
                </div>
                <p
                  className={`text-xs ${isDark ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                  Get your API key from Notion Integrations page
                </p>
              </div>
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${isDark ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                  Page ID
                </label>
                <input
                  type="text"
                  value={config.pageId}
                  onChange={(e) =>
                    setConfig({ ...config, pageId: e.target.value })
                  }
                  className={`w-full p-3 text-sm transition-all duration-200 bg-transparent border rounded-lg bg-primary/30 text-text-primary placeholder-text-secondary/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 focus:outline-none ${isDark
                    ? "text-text-primary border-white/10"
                    : "text-text-tertiary border-black/10"
                    }`}
                  placeholder="Enter your Notion page ID"
                />
                <p
                  className={`text-xs ${isDark ? "text-text-primary" : "text-text-tertiary"
                    }`}>
                  The ID from your Notion page URL
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-6 space-x-3">
              <button
                onClick={() => setIsConfiguring(false)}
                className={`px-4 py-2 text-sm transition-colors rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 ${isDark
                  ? "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  : "text-text-tertiary hover:text-text-primary hover:bg-black/5"
                  }`}>
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className={`px-4 py-2 text-sm transition-colors rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 ${isDark
                  ? "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  : "text-text-tertiary hover:text-text-primary hover:bg-black/5"
                  }`}>
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="rounded-2xl p-7 bg-[#ffffff03] shadow-[inset_1px_1px_1px_0px_#ffffff3b] backdrop-blur-md transition-all duration-300 hover:border-white/10 h-[450px] flex w-full flex-col">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3
                className={`text-lg font-medium tracking-wide ${isDark ? "text-text-primary" : "text-text-tertiary"
                  }`}>
                Notion Notes
              </h3>
              {(isLoading || isSaving) && (
                <span
                  className={`text-xs ${isDark ? "text-text-primary" : "text-text-tertiary"
                    } animate-pulse`}>
                  {isLoading ? "Loading..." : "Saving..."}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {error && (
                <span className="text-xs text-red-400">Connection error</span>
              )}
              <button
                onClick={() => setIsConfiguring(true)}
                className="flex justify-center items-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-white/10 text-text-secondary hover:text-text-primary focus:ring-2 focus:ring-accent-purple/20"
                title="Configure Notion">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-5 ${isDark
                    ? "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    : "text-text-tertiary hover:text-text-primary hover:bg-black/5"
                    }`}>
                  <g clipPath="url(#clip0_4482_8207)">
                    <path d="M20.42 9.38997L19.96 9.11997C19.03 8.57997 18.45 7.58997 18.45 6.50997V5.97997C18.45 4.89997 17.88 3.90997 16.94 3.36997C16.01 2.82997 14.86 2.82997 13.93 3.36997L13.47 3.63997C12.54 4.17997 11.39 4.17997 10.46 3.63997L10 3.36997C9.07 2.82997 7.92 2.82997 6.99 3.36997C6.06 3.90997 5.48 4.89997 5.48 5.97997V6.50997C5.48 7.58997 4.91 8.57997 3.97 9.11997L3.51 9.38997C2.58 9.92997 2 10.92 2 12C2 13.08 2.57 14.07 3.51 14.61L3.97 14.88C4.9 15.42 5.48 16.41 5.48 17.49V18.02C5.48 19.1 6.05 20.09 6.99 20.63C7.92 21.17 9.07 21.17 10 20.63L10.46 20.36C11.39 19.82 12.54 19.82 13.47 20.36L13.93 20.63C14.86 21.17 16.01 21.17 16.94 20.63C17.87 20.09 18.45 19.1 18.45 18.02V17.49C18.45 16.41 19.02 15.42 19.96 14.88L20.42 14.61C21.35 14.07 21.93 13.08 21.93 12C21.93 10.92 21.36 9.92997 20.42 9.38997ZM11.85 15.01C10.19 15.01 8.84 13.66 8.84 12C8.84 10.34 10.19 8.98997 11.85 8.98997C13.51 8.98997 14.86 10.34 14.86 12C14.86 13.66 13.51 15.01 11.85 15.01Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_4482_8207">
                      <rect width="24" height="24" fill="currentColor" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`flex-1 px-2 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full rounded-lg bg-primary/20 ${isDark
              ? "bg-primary/20 [&::-webkit-scrollbar-thumb]:bg-white/10"
              : "bg-primary/20 [&::-webkit-scrollbar-thumb]:bg-black/10"
              }`}>
            {blocks.length > 0 ? (
              <NotionRichText
                blocks={blocks}
                isDark={isDark}
                editable={isSaving ? false : true}
                onUpdate={handleContentUpdate}
              />
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`size-5 flex justify-center items-center animate-spin ease-in-out ${isDark
                    ? "text-text-secondary hover:text-text-primary"
                    : "text-text-tertiary hover:text-text-primary"
                    }`}>
                  <g clipPath="url(#clip0_4418_3127)">
                    <path
                      d="M5.25 6.04C3.85 7.63 3 9.72 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C11.29 3 10.6 3.08 9.94 3.24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_3127">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-sm text-center text-text-secondary max-w-64">
                  Configure Notion integration to start writing...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}
