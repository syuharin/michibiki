# Tasks: Rulebook Display

**Input**: Design documents from `/specs/009-rulebook-display/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Basic Vitest component tests are included to ensure UI stability.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `react-markdown` dependency via npm
- [x] T002 Create initial rules content in `public/rules.md` in Japanese (Must include: Game Flow, Card Types, Winning Conditions)
- [x] T003 [P] Create `src/components/rulebook/` directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Define `RulebookContent` types in `src/types/game.ts`
- [x] T005 Create a basic fetch utility for the rulebook in `src/lib/game/rules.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Rules During Play (Priority: P1) 🎯 MVP

**Goal**: Allow players to open a modal from any screen to view rules without interrupting game state.

**Independent Test**: Can be fully tested by clicking the rulebook button during a match and verifying the rules are displayed correctly without disconnecting the player.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `RulebookModal.tsx` with basic modal structure in `src/components/rulebook/RulebookModal.tsx`
- [x] T007 [US1] Implement asynchronous Markdown loading in `src/components/rulebook/RulebookModal.tsx`
- [x] T008 [US1] Render Markdown content using `react-markdown` in `src/components/rulebook/RulebookModal.tsx`
- [x] T009 [P] [US1] Create `RulebookButton.tsx` with "?" icon in `src/components/rulebook/RulebookButton.tsx`
- [x] T010 [US1] Integrate `RulebookButton` and `RulebookModal` into `src/app/layout.tsx`
- [x] T011 [US1] Implement modal state management (open/close) in `src/app/layout.tsx`
- [x] T012 [US1] Ensure other modals are closed when Rulebook opens in `src/app/layout.tsx` (per clarification)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Mobile-Friendly Rule Viewing (Priority: P2)

**Goal**: Ensure the rules are readable and the modal is usable on mobile devices.

**Independent Test**: Open the rulebook on a mobile viewport and verify text is legible and the close button is reachable.

### Implementation for User Story 2

- [x] T013 [P] [US2] Apply responsive Tailwind classes to the modal container in `src/components/rulebook/RulebookModal.tsx`
- [x] T014 [US2] Implement scrollable content area for long rules in `src/components/rulebook/RulebookModal.tsx`
- [x] T015 [US2] Adjust close button sizing for touch targets on mobile in `src/components/rulebook/RulebookModal.tsx`

**Checkpoint**: At this point, the rulebook should be fully usable on both mobile and desktop.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Implement loading indicator for the Markdown fetch in `src/components/rulebook/RulebookModal.tsx`
- [x] T017 [P] Verify WCAG AA contrast ratio (4.5:1) for all Rulebook UI elements
- [x] T018 [P] Add unit tests for Rulebook components in `src/tests/rulebook.test.tsx`
- [x] T019 Run final validation from `quickstart.md` (Specifically verify SC-003: <200ms toggle and FR-004: No P2P reconnection)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Story 1 (Phase 3)**: Depends on Foundational.
- **User Story 2 (Phase 4)**: Depends on US1 (specifically the component existence).
- **Polish (Phase 5)**: Depends on all stories.

### Parallel Opportunities

- T003 (directory) can be done with T001/T002.
- T006 (Modal) and T009 (Button) can be implemented in parallel.
- T013 (Responsive styles) and T016 (Loading indicator) can be handled independently.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Setup Markdown content and `react-markdown`.
2. Implement the modal and button in the root layout.
3. **STOP and VALIDATE**: Verify rules show up on both Lobby and Game Room.

### Incremental Delivery

1. Foundation: Types and Fetch utility.
2. US1: Core UI and rendering logic (MVP).
3. US2: Mobile optimization.
4. Polish: Loading states and tests.
