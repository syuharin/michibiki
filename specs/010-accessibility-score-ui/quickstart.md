# Quickstart: Accessibility and Score UI Improvement

## Development Setup
1. Ensure the Tailwind configuration in `tailwind.config.ts` is updated with the new `michibiki-gray` (#57657A).
2. All components must be audited for `text-michibiki-gray-light` on white backgrounds, which should be replaced by `text-michibiki-gray` or `text-michibiki-gray-dark`.

## Local Verification
- **Contrast Check**: Use a browser-based contrast checker (e.g., Axe or Chrome DevTools A11y panel) to verify all text elements.
- **Screen Reader Check**: Use NVDA/JAWS (Windows) or VoiceOver (macOS) to confirm that score updates are announced.
- **Responsive Layout**: Use device simulation in Chrome DevTools to verify layout stability down to 320px width.
