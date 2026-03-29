# 📌 Vision Board

A beautiful, cozy personal vision board / mind map / brainstorming app built with React, TypeScript, and Tailwind CSS.

## Features

- **Multiple Boards** – Create, rename, and delete as many boards as you need
- **Infinite Canvas** – Pan (middle-click or Space+drag) and zoom (scroll wheel) with no boundaries
- **5 Card Types**
  - 📝 **Note** – Free-form text with handwritten font
  - ✅ **To-Do** – Checklist with progress tracking
  - 🖼️ **Image** – Display images from URLs
  - 💬 **Quote** – Stylized blockquote cards
  - 🔗 **Link** – Clickable URL cards
- **Draggable Cards** – Freely position cards anywhere on the canvas
- **Pushpin Decoration** – 7 pin colors to pin cards to the board
- **Card Customization** – 21 color swatches, rotation control
- **Background Themes** – 8 backgrounds (Cork, Cream, Navy, Sage, Lavender, Charcoal, White, Rose)
- **Persistent Storage** – All boards and cards saved to `localStorage`

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) – Fast build tool
- [Tailwind CSS v4](https://tailwindcss.com/) – Utility-first styling
- [Zustand](https://zustand-demo.pmnd.rs/) – Lightweight state management
- [react-draggable](https://github.com/react-grid-layout/react-draggable) – Card dragging
- [uuid](https://github.com/uuidjs/uuid) – Unique IDs

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```
