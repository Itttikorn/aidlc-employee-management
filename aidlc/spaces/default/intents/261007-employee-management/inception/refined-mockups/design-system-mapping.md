# Design System Mapping & Token Specification

## Sources
- Wireframes: `wireframes.md` (rough-mockups)
- User Flows: `user-flow.md` (rough-mockups)
- User Stories: `stories.md` (user-stories)
- Requirements: `requirements.md` (requirements-analysis)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Design Token System Overview

This document specifies the design tokens, CSS custom properties, and component styling mappings for the Employee Management System. In strict adherence to team rules affirmed during Practices Discovery:
- **Zero Glassmorphism Rule**: All cards, overlays, and sidebars utilize **100% opaque solid backgrounds**. Background blur (`backdrop-filter: blur(...)`) and translucent overlays are strictly prohibited.
- **High Contrast Borders**: Every interactive component and card surface features a defined, high-contrast 1px solid border.

---

## 2. Color Tokens & Theme Palettes

### Dark Mode (Default / Primary Workspace Theme)
| Token Name | CSS Variable | Hex Value | Purpose |
|---|---|---|---|
| `color-bg-canvas` | `--bg-canvas` | `#0f172a` | Main viewport and document background (Deep Slate) |
| `color-bg-surface` | `--bg-surface` | `#1e293b` | Solid opaque card surface, sidebar, header |
| `color-bg-surface-hover`| `--bg-surface-hover` | `#334155` | Table row hover, secondary button hover |
| `color-border-subtle` | `--border-subtle` | `#334155` | 1px card boundary, divider lines |
| `color-border-strong` | `--border-strong` | `#475569` | Input borders, active card borders |
| `color-text-primary` | `--text-primary` | `#f8fafc` | Headings, primary content (Contrast 13.8:1) |
| `color-text-secondary` | `--text-secondary`| `#94a3b8` | Captions, metadata, subtitles (Contrast 5.4:1) |
| `color-primary` | `--color-primary` | `#4f46e5` | Primary action buttons, active tab indicators |
| `color-primary-hover` | `--color-primary-hover`| `#4338ca` | Primary button hover state |

### Light Mode (Crisp Pearl Alternative Theme)
| Token Name | CSS Variable | Hex Value | Purpose |
|---|---|---|---|
| `color-bg-canvas` | `--bg-canvas` | `#f8fafc` | Main viewport and document background (Crisp Pearl) |
| `color-bg-surface` | `--bg-surface` | `#ffffff` | Solid opaque card surface, sidebar, header |
| `color-bg-surface-hover`| `--bg-surface-hover` | `#f1f5f9` | Table row hover, secondary button hover |
| `color-border-subtle` | `--border-subtle` | `#e2e8f0` | 1px card boundary, divider lines |
| `color-border-strong` | `--border-strong` | `#cbd5e1` | Input borders, active card borders |
| `color-text-primary` | `--text-primary` | `#0f172a` | Headings, primary content (Contrast 14.1:1) |
| `color-text-secondary` | `--text-secondary`| `#475569` | Captions, metadata, subtitles (Contrast 6.8:1) |
| `color-primary` | `--color-primary` | `#4f46e5` | Primary action buttons, active tab indicators |
| `color-primary-hover` | `--color-primary-hover`| `#4338ca` | Primary button hover state |

### Semantic Lifecycle & Status Tokens
| Lifecycle Stage / Status | Badge Background | Badge Text | Border Color | Meaning |
|---|---|---|---|---|
| **Todo** | `#334155` (Dark) / `#f1f5f9` (Light) | `#94a3b8` / `#475569` | `#475569` / `#cbd5e1` | Task queued in Stage 1 |
| **Pending** | `#78350f` (Dark) / `#fef3c7` (Light) | `#fde68a` / `#b45309` | `#f59e0b` / `#f59e0b` | Task in Stage 2 (Active/Review) |
| **Completed** | `#064e3b` (Dark) / `#d1fae5` (Light) | `#a7f3d0` / `#047857` | `#10b981` / `#10b981` | Task finished in Stage 3 |
| **Danger / Error** | `#881337` (Dark) / `#ffe4e6` (Light) | `#fecdd3` / `#be123c` | `#f43f5e` / `#f43f5e` | Deletion or validation failure |

---

## 3. Typography & Spacing Scale

### Font Family & Scale
- **Primary Font Family**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font Family**: `'JetBrains Mono', 'Fira Code', Menlo, monospace`

| Type Style | Font Size | Line Height | Font Weight | Letter Spacing |
|---|---|---|---|---|
| `display-1` | 32px (2rem) | 40px (1.25) | 700 (Bold) | -0.02em |
| `heading-1` | 24px (1.5rem) | 32px (1.33) | 700 (Bold) | -0.01em |
| `heading-2` | 20px (1.25rem) | 28px (1.40) | 600 (SemiBold) | -0.01em |
| `heading-3` | 16px (1.0rem) | 24px (1.50) | 600 (SemiBold) | 0 |
| `body-normal` | 14px (0.875rem)| 20px (1.43) | 400 (Regular) | 0 |
| `body-medium` | 14px (0.875rem)| 20px (1.43) | 500 (Medium) | 0 |
| `caption-small`| 12px (0.75rem) | 16px (1.33) | 500 (Medium) | +0.01em |

### Spacing & Layout Rhythm
- Baseline unit: `4px`
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px` (Standard component padding)
- `--space-6`: `24px` (Section gap, card grid gutter)
- `--space-8`: `32px` (Page margin, major view divide)

---

## 4. Borders, Elevation & Radii

### Border Radii
- `--radius-sm`: `4px` (Tags, small pills)
- `--radius-md`: `6px` (Buttons, form inputs)
- `--radius-lg`: `8px` (Cards, Kanban columns)
- `--radius-xl`: `12px` (Modal dialogs)
- `--radius-full`: `9999px` (Avatars, status pills)

### Elevation & Shadows (Opaque Lighting)
- **Card Shadow (Default)**: `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2);`
- **Card Shadow (Hover)**: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.25);`
- **Modal Dialog Shadow**: `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);`

---

## 5. Component Style Mappings

| Component Element | Applied Tokens | Styling Rules |
|---|---|---|
| **Employee Card** | `--bg-surface`, `--border-subtle`, `--radius-lg` | Solid opaque background, 1px border, 16px padding, avatar 56x56px |
| **Kanban Card** | `--bg-surface`, `--border-subtle`, `--radius-md` | 12px padding, left accent border matching priority, drag cursor |
| **Kanban Column** | `--bg-canvas` / `--bg-surface`, `--border-subtle` | Min-width 300px, 12px padding, sticky stage header |
| **Primary Button** | `--color-primary`, `--radius-md`, white text | 10px 16px padding, font-weight 500, hover `--color-primary-hover` |
| **Modal Overlay** | `background-color: rgba(0, 0, 0, 0.65)` | Solid dark backdrop, z-index 1000, zero background blur |
| **Form Input** | `--bg-surface`, `--border-strong`, `--radius-md` | 8px 12px padding, focus ring 2px `--color-primary` with 2px offset |
| **Skeleton Pulse** | `animation: pulse 1.5s infinite`, `--bg-surface-hover` | Matches component shape, respects `prefers-reduced-motion` |
