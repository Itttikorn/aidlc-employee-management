# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Guard Policy

<!-- Project-specific. Mode: strict, relaxed, or off. Strict here holds for every intent and cannot be changed from chat. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- NEVER push unverified feature changes directly to `main` without promoting through `staging` and `dev`. (affirmed 2026-10-07)

- NEVER use glassmorphism, background-blur filters, or low-contrast semi-transparent card overlays in UI design. (affirmed 2026-10-07)

- NEVER allow unhandled `any` types in TypeScript implementations. (affirmed 2026-10-07)

- NEVER bypass 3-stage task lifecycle validation (`Todo` -> `Pending` -> `Completed`). (affirmed 2026-10-07)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- ALWAYS develop features on `feature/(feature_name)` branches and promote sequentially through `staging` &rarr; `dev` &rarr; `main`. (affirmed 2026-10-07)

- ALWAYS use solid opaque UI cards with crisp borders and high-contrast styling across all light and dark mode themes. (affirmed 2026-10-07)

- ALWAYS enforce PostgreSQL referential integrity and transaction safety for employee-team relationships and task status updates. (affirmed 2026-10-07)

- ALWAYS adhere to Thailand PDPA standards for personal identifiable data handling and photo storage. (affirmed 2026-10-07)

- ALWAYS write and execute automated test suites verifying business logic and REST endpoints before completing construction units. (affirmed 2026-10-07)

--- (affirmed 2026-10-07)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
