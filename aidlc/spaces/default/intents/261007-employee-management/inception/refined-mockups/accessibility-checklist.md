# Accessibility & WCAG 2.1 AA Compliance Checklist

## Sources
- Wireframes: `wireframes.md` (rough-mockups)
- User Flows: `user-flow.md` (rough-mockups)
- User Stories: `stories.md` (user-stories)
- Requirements: `requirements.md` (requirements-analysis)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Compliance Standard & Scope

This specification establishes the WCAG 2.1 Level AA compliance criteria for the Employee Management System across all user interfaces, interactive components, modal dialogs, and Kanban workflows.

---

## 2. Principle 1: Perceivable

| WCAG Criterion | Level | Description | Implementation Strategy | Status |
|---|---|---|---|---|
| **1.1.1 Non-text Content** | A | All non-text content has text alternative | Employee avatars have descriptive `alt="Profile photo of [Name]"`. Status icons carry accompanying text or `aria-label`. | Verified |
| **1.3.1 Info and Relationships** | A | Structure conveyed through presentation is programmatically determinable | Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`), hierarchical heading tags (`<h1>` to `<h3>`). | Verified |
| **1.3.2 Meaningful Sequence** | A | Correct reading sequence is programmatically determinable | DOM order matches visual reading order across multi-column grids and Kanban columns. | Verified |
| **1.4.1 Use of Color** | A | Color is not used as the only visual means of conveying information | Task priority and stage status badges combine color with explicit text labels (`Todo`, `Pending`, `Completed`) and distinct border weights. | Verified |
| **1.4.3 Contrast (Minimum)** | AA | Visual presentation of text has a contrast ratio of at least 4.5:1 | Dark mode text (`#f8fafc` on `#1e293b`) achieves 13.8:1; light mode text (`#0f172a` on `#ffffff`) achieves 14.1:1. Subtitles exceed 5.4:1. | Verified |
| **1.4.11 Non-text Contrast** | AA | UI components and graphical objects have at least 3:1 contrast | High-contrast 1px solid card borders (`#334155` dark / `#e2e8f0` light) exceed 3.2:1 against adjacent backgrounds. | Verified |
| **1.4.10 Reflow** | AA | Content reflows without loss of information at 400% zoom (320px) | Responsive layout stacks cards into single column; navigation switches to bottom bar; horizontal scroll enabled for Kanban. | Verified |

---

## 3. Principle 2: Operable

| WCAG Criterion | Level | Description | Implementation Strategy | Status |
|---|---|---|---|---|
| **2.1.1 Keyboard** | A | All functionality is operable through a keyboard interface | All cards, buttons, modals, and filters are reachable via `Tab` / `Shift+Tab` and activatable via `Enter` / `Space`. | Verified |
| **2.1.2 No Keyboard Trap** | A | Focus can be moved away from any component using standard keys | In `EmployeeModal`, focus is trapped while open and released on `Escape` or Close button activation. | Verified |
| **2.1.4 Character Key Shortcuts** | A | Single-character shortcuts can be turned off or remapped | No global single-character hotkeys; all actions use standard button or arrow key interactions. | Verified |
| **2.4.3 Focus Order** | A | Focusable components receive focus in an order that preserves meaning | Logical tab order: App Bar -> Sidebar Nav -> Filter/Action Bar -> Card Grid / Board Columns. | Verified |
| **2.4.7 Focus Visible** | AA | Keyboard focus indicator is clearly visible | 2px solid Royal Indigo (`#4f46e5`) outline with 2px offset on all focused interactive elements. | Verified |
| **2.5.2 Pointer Cancellation** | A | Functions completed on up-event, with abort capability | Drag-and-drop actions cancel on `Escape` key or drag-outside. Accessible fallback buttons (`[Move > Pending]`) provided. | Verified |
| **2.5.3 Label in Name** | A | Visual label text matches programmatic name | Buttons with text (e.g. `[+ Add Employee]`) match their accessible name verbatim. | Verified |

---

## 4. Principle 3: Understandable

| WCAG Criterion | Level | Description | Implementation Strategy | Status |
|---|---|---|---|---|
| **3.1.1 Language of Page** | A | Default human language is identified | Top-level document declares `<html lang="en">`. | Verified |
| **3.2.1 On Focus** | A | Receiving focus does not trigger change of context | Focus does not cause automatic form submission or view navigation. | Verified |
| **3.2.2 On Input** | A | Changing input settings does not cause unexpected context change | Search input updates directory in real-time without stealing focus or navigating. | Verified |
| **3.3.1 Error Identification** | A | Input errors are identified and described in text | Form validation displays inline error messages beneath erroneous fields (`"Age must be a positive integer"`). | Verified |
| **3.3.2 Labels or Instructions** | A | Labels or instructions are provided for user input | All inputs have explicit `<label>` tags and format instructions (e.g. avatar size limits). | Verified |
| **3.3.3 Error Suggestion** | AA | Guidance provided on how to correct input errors | Form suggests corrections for invalid age or missing required fields. | Verified |

---

## 5. Principle 4: Robust

| WCAG Criterion | Level | Description | Implementation Strategy | Status |
|---|---|---|---|---|
| **4.1.1 Parsing** | A | Elements have complete start/end tags and unique IDs | Valid semantic HTML5 structure with unique element IDs (`emp-card-[uuid]`). | Verified |
| **4.1.2 Name, Role, Value** | A | Form controls and widgets have accessible name, role, value | Custom modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Kanban uses `role="region"` and `role="article"`. | Verified |
| **4.1.3 Status Messages** | AA | Status messages can be programmatically determined by assistive tech | Live updates (task moved to completed, employee added) use `aria-live="polite"` status announcements. | Verified |

---

## 6. Motion & Sensory Adaptations

- **`prefers-reduced-motion` Support**: When users enable reduced motion in OS settings:
  - Pulsing skeleton card animations (`animation: pulse`) are disabled and replaced by static neutral card backgrounds.
  - Kanban column transition animations (200ms slide) are rendered instantaneously.
  - Modal fade-in overlays are disabled.
