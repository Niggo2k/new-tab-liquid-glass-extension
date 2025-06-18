import * as Popover from "@radix-ui/react-popover"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LiquidGlass from "liquid-glass-react"
import { common, createLowlight } from "lowlight"
import React, { useCallback, useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"

const lowlight = createLowlight(common)

interface NotionBlock {
  type: string
  [key: string]: any
}

interface NotionRichTextProps {
  blocks: NotionBlock[]
  className?: string
  onUpdate?: (json: string) => void
  editable?: boolean
  isDark?: boolean
}

const FormatButton = ({
  onClick,
  isActive,
  children
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-white/10 ${
      isActive ? "bg-white/10 text-text-primary" : "text-text-secondary"
    }`}>
    {children}
  </button>
)

const ColorPicker = ({
  color,
  editor,
  onChange,
  onClear
}: {
  color: string
  editor: Editor
  onChange: (color: string) => void
  onClear: () => void
}) => {
  return (
    <div className="relative p-1 bg-white rounded-lg border shadow-sm border-neutral-200">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <HexColorPicker
            color={color}
            className="w-full rounded-lg"
            onChange={(e) => onChange(e)}
          />
        </div>
      </div>
      <input
        className="p-2 w-full text-black bg-white rounded border border-neutral-200 focus:outline-1 focus:ring-0 focus:outline-neutral-300"
        type="text"
        placeholder="color"
        value={color}
      />
      <div className="flex flex-wrap gap-1 items-center max-w-60">
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
          onClick={() => onChange("#fb7185")}>
          <div
            className="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
            style={{ backgroundColor: "#fb7185", color: "#fb7185" }}
          />
        </button>
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
          onClick={() => onChange("#fdba74")}>
          <div
            className="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
            style={{ backgroundColor: "#fdba74", color: "#fdba74" }}
          />
        </button>
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
          onClick={() => onChange("#d9f99d")}>
          <div
            className="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
            style={{ backgroundColor: "#d9f99d", color: "#d9f99d" }}
          />
        </button>
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
          onClick={() => onChange("#a7f3d0")}>
          <div
            className="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
            style={{ backgroundColor: "#a7f3d0", color: "#a7f3d0" }}
          />
        </button>
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
          onClick={() => onChange("#a5f3fc")}>
          <div
            className="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
            style={{ backgroundColor: "#a5f3fc", color: "#a5f3fc" }}
          />
        </button>
        <button
          className="flex items-center justify-center px-1.5 py-1.5 rounded group bg-neutral-100"
          onClick={() => onChange("#a5b4fc")}>
          <div
            className="w-4 h-4 rounded ring-1 ring-current ring-offset-2 shadow-sm bg-slate-100"
            style={{ backgroundColor: "#a5b4fc", color: "#a5b4fc" }}
          />
        </button>
        <span>
          <button
            className="flex gap-1 justify-center items-center px-2 w-auto h-8 text-sm font-semibold whitespace-nowrap bg-transparent rounded-md border border-transparent group disabled:opacity-50 text-neutral-500 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 min-w-8"
            onClick={() => {
              // @ts-ignore
              editor.chain().focus().unsetColor().run()
              color = "#4b5563"
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-4 h-4">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </button>
        </span>
      </div>
    </div>
  )
}

const BubbleMenuContent = ({
  editor,
  isDark
}: {
  editor: Editor
  isDark?: boolean
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className="relative [&>*:first-child]:hidden [&>*:nth-child(2)]:hidden [&>*:nth-last-child(1)]:hidden [&>*:nth-last-child(2)]:hidden">
      <LiquidGlass
        displacementScale={100}
        blurAmount={0.1}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0}
        cornerRadius={16}
        mode="shader"
        padding="0px"
        className="!transform !translate-x-0 !translate-y-0 !scale-100  [&>*:nth-last-child(1)]:w-full w-auto">
        <div
          className={`z-50! flex items-center gap-1 p-1 border rounded-lg shadow-lg bg-card border-white/10 ${
            isDark ? "bg-card border-white/10" : "bg-card border-black/10"
          }`}>
          <FormatButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4">
              <line x1="19" y1="4" x2="10" y2="4"></line>
              <line x1="14" y1="20" x2="5" y2="20"></line>
              <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 6 7 8C7 10 9 11 12 12C15 13 17 14 17 16C17 18 14.5 20 12 20C9.5 20 8 18 8 18"></path>
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </FormatButton>

          <FormatButton
            // @ts-ignore
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M6 4v6a6 6 0 0 0 12 0V4" />
              <line x1="4" x2="20" y1="20" y2="20" />
            </svg>
          </FormatButton>

          <div className="mx-1 w-px h-4 bg-white/10" />

          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="m17 12 3-2v8" />
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
              <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
            </svg>
          </FormatButton>

          {/* <div className="mx-1 w-px h-4 bg-white/10" />

			<Popover.Root modal>
				<Popover.Trigger asChild>
					<FormatButton
						isActive={editor.isActive("highlight")}
						onClick={() => console.log(editor.getAttributes("highlight"))}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4"
						>
							<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
							<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
							<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
							<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
							<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
						</svg>
					</FormatButton>
				</Popover.Trigger>
				<Popover.Content side="bottom" sideOffset={8} asChild>
					<div className="relative p-1">
						<ColorPicker
							editor={editor}
							color={editor.getAttributes("highlight")?.color}
							onChange={(color) =>
								editor
									.chain()
									.focus()
									// @ts-ignore
									.setHighlight({
										color,
									})
									.run()
							}
							// @ts-ignore
							onClear={() => editor.chain().focus().unsetHighlight().run()}
						/>
					</div>
				</Popover.Content>
			</Popover.Root> */}

          {/* <Popover.Root>
				<Popover.Trigger asChild>
					<FormatButton
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						isActive={editor.isActive("heading", { level: 3 })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="m9 11-6 6v3h9l3-3" />
							<path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
						</svg>
					</FormatButton>
				</Popover.Trigger>
				<Popover.Content side="top" sideOffset={8} asChild>
				<div class="p-1 bg-white rounded-lg border shadow-sm border-neutral-200">
                <div class="flex flex-col gap-2">
                    <div class="w-full">
                        <HexColorPicker
                            color={editor.chain().currentColor}
                            onChange={(e) => changeHighlightColor(e.detail.value)}
                        />
                    </div>
                    <input
                        class="p-2 w-full text-black bg-white rounded border border-neutral-200 focus:outline-1 focus:ring-0 focus:outline-neutral-300"
                        type="text" placeholder="highlight" value={editor.chain().currentColor}>
                    <div class="flex flex-wrap gap-1 items-center max-w-60">
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
                            onClick={() => changeHighlightColor('#fb7185')}>
                            <div class="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
                                style="background-color: #fb7185; color: #fb7185;" />
                        </button>
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
                            onClick={() => changeHighlightColor('#fdba74')}>
                            <div class="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
                                style="background-color: #fdba74; color: #fdba74;" />
                        </button>
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
                            onClick={() => changeHighlightColor('#d9f99d')}>
                            <div class="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
                                style="background-color: #d9f99d; color: #d9f99d;" />
                        </button>
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
                            onClick={() => changeHighlightColor('#a7f3d0')}>
                            <div class="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
                                style="background-color: #a7f3d0; color: #a7f3d0;" />
                        </button>
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group hover:bg-neutral-100"
                            onClick={() => changeHighlightColor('#a5f3fc')}>
                            <div class="w-4 h-4 rounded ring-current ring-offset-2 shadow-sm bg-slate-100 hover:ring-1"
                                style="background-color: #a5f3fc; color: #a5f3fc;" />
                        </button>
                        <button class="flex items-center justify-center px-1.5 py-1.5 rounded group bg-neutral-100"
                            onClick={() => changeHighlightColor('#a5b4fc')}>
                            <div class="w-4 h-4 rounded ring-1 ring-current ring-offset-2 shadow-sm bg-slate-100"
                                style="background-color: #a5b4fc; color: #a5b4fc;" />
                        </button>
                        <span>
                            <button
                                class="flex gap-1 justify-center items-center px-2 w-auto h-8 text-sm font-semibold whitespace-nowrap bg-transparent rounded-md border border-transparent group disabled:opacity-50 text-neutral-500 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 min-w-8"
                                onClick={() => { editor.chain().focus().unsetHighlight().run(); highlight = '#ffffff'; }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                                    class="w-4 h-4">
                                    <path d="M3 7v6h6"></path>
                                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                                </svg>
                            </button>
                        </span>
                    </div>
                </div>
            </div>

				</Popover.Content>
			</Popover.Root> */}

          <div className="mx-1 w-px h-4 bg-white/10" />

          <FormatButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M3 12h.01" />
              <path d="M3 18h.01" />
              <path d="M3 6h.01" />
              <path d="M8 12h13" />
              <path d="M8 18h13" />
              <path d="M8 6h13" />
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M10 12h11" />
              <path d="M10 18h11" />
              <path d="M10 6h11" />
              <path d="M4 10h2" />
              <path d="M4 6h1v4" />
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </FormatButton>

          <FormatButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
              <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
            </svg>
          </FormatButton>
        </div>
      </LiquidGlass>
    </div>
  )
}

const convertNotionBlocksToHTML = (blocks: NotionBlock[]): string => {
  return blocks
    .map((block) => {
      const richText = block[block.type]?.rich_text || []
      const text = richText
        .map((item: any) => {
          let content = item.text.content
          if (item.annotations.bold) content = `<strong>${content}</strong>`
          if (item.annotations.italic) content = `<em>${content}</em>`
          if (item.annotations.strikethrough) content = `<s>${content}</s>`
          if (item.annotations.underline) content = `<u>${content}</u>`
          if (item.annotations.code) content = `<code>${content}</code>`
          if (item.href) content = `<a href="${item.href}">${content}</a>`
          return content
        })
        .join("")

      switch (block.type) {
        case "paragraph":
          return `<p>${text}</p>`
        case "heading_1":
          return `<h1>${text}</h1>`
        case "heading_2":
          return `<h2>${text}</h2>`
        case "heading_3":
          return `<h3>${text}</h3>`
        case "bulleted_list_item":
          return `<ul><li>${text}</li></ul>`
        case "numbered_list_item":
          return `<ol><li>${text}</li></ol>`
        case "to_do":
          return `<div data-type="taskItem" data-checked="${block.to_do.checked}">${text}</div>`
        case "quote":
          return `<blockquote>${text}</blockquote>`
        case "code":
          return `<pre><code>${text}</code></pre>`
        case "divider":
          return "<hr/>"
        default:
          return ""
      }
    })
    .join("")
}

type OnStopTypingCallback = (jsonString: string) => void

let debounceTimer

export function createDebouncedOnUpdate(
  onStopTyping: OnStopTypingCallback,
  delayMs = 500
) {
  return ({ editor }: { editor: Editor }) => {
    // Reset the timer
    clearTimeout(debounceTimer)
    // Schedule a new callback after `delayMs` ms
    debounceTimer = setTimeout(() => {
      const json = editor.getJSON()
      onStopTyping(JSON.stringify(json))
      debounceTimer = null
    }, delayMs)
  }
}

export const NotionRichText: React.FC<NotionRichTextProps> = ({
  blocks,
  className = "",
  isDark = false,
  onUpdate,
  editable = false
}) => {
  const handleStopTyping = (jsonString: string) => {
    // ... do whatever you want with the JSON (e.g., send to API, etc.)
    onUpdate?.(jsonString)
  }
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      CodeBlockLowlight.configure({
        lowlight
      })
    ],
    editable: editable,
    content: "",
    onUpdate: createDebouncedOnUpdate(handleStopTyping, 1500)
  })

  useEffect(() => {
    if (editor && blocks.length > 0) {
      const html = convertNotionBlocksToHTML(blocks)
      editor.commands.setContent(html)
    }
  }, [editor, blocks])

  return (
    <div
      className={`notion-content ${className} prose max-w-none prose-p:mt-1 prose-p:mb-1 prose-p:text-sm prose-p:leading-normal prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-bold prose-h2:my-2 prose-h3:my-2 ${
        editable ? "" : "pointer-events-none"
      } ${isDark ? "prose-invert" : ""}`}>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bubble-menu">
          <BubbleMenuContent editor={editor} isDark={isDark} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} disabled={!editable} />
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 100%;
        }
        .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding: 0 1rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
        }
        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          border-radius: 0.25em;
          padding: 0.25em;
          box-decoration-break: clone;
        }
        .ProseMirror pre {
          background: #0d1117;
          color: #c9d1d9;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
        .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
        }
        .ProseMirror [data-type="taskItem"] {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ProseMirror [data-type="taskItem"][data-checked="true"] {
          text-decoration: line-through;
          color: #6b7280;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .bubble-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  )
}
