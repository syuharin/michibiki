# Data Model: Rulebook Display

## Entities

### RulebookContent
Represents the structured content loaded from an external source.

| Field | Type | Description |
| :--- | :--- | :--- |
| `content` | `string` | The raw Markdown string fetched from `/rules.md`. |
| `isLoading` | `boolean` | State indicating if the content is currently being fetched. |
| `error` | `string | null` | Error message if fetching fails. |

## State Transitions

### UI State: Rulebook Modal

| State | Transition | New State | Trigger |
| :--- | :--- | :--- | :--- |
| `CLOSED` | `OPEN_RULEBOOK` | `OPENING` | Click Rulebook button |
| `OPENING` | `LOAD_COMPLETE` | `OPEN` | Content fetch finishes |
| `OPEN` | `CLOSE_RULEBOOK` | `CLOSED` | Click close button / Backdrop |

## Validation Rules

- **Markdown Structure**: The content MUST contain headers for "Game Flow", "Card Types", and "Winning Conditions".
- **Language**: The content MUST be in Japanese.
- **Accessibility**: Text MUST be rendered with a minimum contrast ratio of 4.5:1.
