# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (using Bun package manager)
bun install

# Start development server (runs on localhost with hot reload)
bun run dev
# or
npm run dev

# Build production extension
bun run build
# or
npm run build

# Create distribution package
bun run package
# or
npm run package
```

## Architecture Overview

This is a Plasmo browser extension that creates a custom new tab page with the following key features:

### Core Technologies
- **Plasmo Framework**: Browser extension framework handling manifest generation and build pipeline
- **React 18**: UI components with performance optimizations (memoization, lazy loading)
- **TypeScript**: Type safety throughout the codebase
- **Tailwind CSS v4**: Utility-first styling with PostCSS configuration
- **Bun**: Primary package manager (fallback to npm/pnpm supported)

### Key Components Architecture

1. **Main Entry Point** (`newtab.tsx`): 
   - Custom new tab page with time display, background wallpaper, and widget grid
   - Implements React memoization patterns for performance
   - Uses error boundaries for graceful degradation

2. **Component Structure** (`components/`):
   - `GridItemsContainer`: Drag-and-drop site grid using @dnd-kit
   - `EnhancedNotionWidget`: Notion API integration for displaying content
   - `NotionRichText`: Rich text renderer for Notion blocks
   - Modal system for user interactions

3. **Data Management**:
   - Chrome Storage API integration via `useChromeStorage` hook
   - Background wallpaper system with attribution
   - Default grid sites configuration

4. **Styling System**:
   - Tailwind CSS v4 with custom configuration
   - Global styles in `styles/globals.css`
   - Component-specific styling using utility classes

### Extension Permissions
- `storage`: For saving user preferences
- `favicon`: For displaying site icons
- Host permission for `api.notion.com` for widget functionality

### Build Output
- Development builds: `build/chrome-mv3-dev/`
- Production builds: `build/chrome-mv3-prod/`

## Code Style

- **Prettier Configuration**: No semicolons, double quotes, no trailing commas
- **Import Ordering**: Enforced by prettier plugin (builtin → third-party → plasmo → local)
- **TypeScript**: Strict mode with path aliases (`~*` for root imports)