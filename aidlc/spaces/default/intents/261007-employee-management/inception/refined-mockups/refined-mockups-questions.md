# Refined Mockups & UX Design — Clarifying Questions

These questions define the component interaction patterns, screen state handling, responsive behavior, and design system tokens for high-fidelity UI specifications.

---

### Question 1: Employee Directory Interaction Pattern
When an administrator creates or edits an employee, or views detailed profile info, what primary interaction pattern should be used? (Context: Balancing rapid data entry with multi-team assignment tags and avatar photo upload).
- A. Centered modal dialog with structured sections (Personal Info, Avatar Upload, Multi-Team Assignment dropdown)
- B. Slide-over drawer / sheet from the right viewport allowing background directory context to remain visible
- C. Inline expandable card accordion directly within the employee directory grid
- D. Dedicated full-page route (`/employees/:id/edit`) for edits, modal for creation
- E. Other (please specify)
[Answer]: A

---

### Question 2: Kanban Board Task Movement & Interaction
On the 3-column Task Board (`Todo` -> `Pending` -> `Completed`), how should users move and manage task cards? (Context: Supporting both fast visual manipulation and full keyboard accessibility for task transitions).
- A. Drag-and-drop interaction with accessible button fallbacks (`[Move > Pending]`, `[Move > Done]`) and a quick-action context menu
- B. Action buttons and dropdown status selectors on cards only (no drag-and-drop)
- C. Click card to open full-detail modal, with stage transition buttons inside the modal
- D. Other (please specify)
[Answer]: A

---

### Question 3: Screen State Handling (Loading, Empty & Error States)
How should loading, empty, and partial states be rendered across the views (Directory, Tasks, Dashboard)? (Context: Ensuring polished user feedback and seamless onboarding for empty database tables).
- A. Animated pulsing skeleton cards during loading, with solid informative empty-state illustration cards + call-to-action buttons (`+ Add Employee`, `+ Create Task`) when lists are empty
- B. Minimal inline spinner overlays and simple text banners ("No items found")
- C. Shimmer placeholders for loading, full-page empty state graphics with guided onboarding walkthroughs
- D. Other (please specify)
[Answer]: A

---

### Question 4: Responsive Layout & Mobile Adaptation
What responsive layout behavior should apply on mobile (<768px) and tablet (768–1024px) screens? (Context: Adapting the two-column sidebar layout and 3-column Kanban board across varied device viewports).
- A. Standard 3-breakpoint strategy: Desktop (>1024px) full sidebar + multi-column grid; Tablet (768-1024px) collapsible icon sidebar + 2-column grid; Mobile (<768px) bottom navigation bar + stacked single-column cards + horizontal swipe/scroll for Kanban columns
- B. Desktop & Tablet keep side nav; Mobile collapses sidebar into a slide-out hamburger menu with tabs for Kanban stages instead of horizontal scrolling
- C. Desktop-optimized primarily, with responsive shrinking containers on tablet/mobile
- D. Other (please specify)
[Answer]: A

---

### Question 5: Design System Color Tokens & Contrast Theme
For our solid opaque card styling (strict team rule prohibiting glassmorphism/blur), what color scheme and accent tokens should anchor the light and dark themes? (Context: Meeting WCAG 2.1 AA 4.5:1 text contrast and crisp border definition).
- A. Deep Slate dark mode (`#0f172a` bg, `#1e293b` cards, crisp `#334155` borders) / Crisp Pearl light mode (`#f8fafc` bg, `#ffffff` cards, `#e2e8f0` borders) with Royal Indigo primary accents (`#4f46e5`) and semantic status badges (Emerald `#10b981` Completed, Amber `#f59e0b` Pending, Slate `#64748b` Todo)
- B. Neutral Charcoal dark mode / Stark White light mode with High-Contrast Sapphire Blue primary accents
- C. Corporate Navy palette with Teal accents and warm status indicators
- D. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct

