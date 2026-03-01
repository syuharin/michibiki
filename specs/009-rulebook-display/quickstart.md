# Quickstart: Rulebook Display

## Setup

1. **Install Dependencies**:
   ```bash
   npm install react-markdown
   ```

2. **Prepare Rule Content**:
   Create a file at `/public/rules.md` with the game rules in Japanese.

## Development

1. **Run the application**:
   ```bash
   npm run dev
   ```

2. **Test the Rulebook**:
   - Access the Lobby (`/`) and click the rulebook button.
   - Access a Game Room (`/room/[id]`) and click the rulebook button.
   - Verify the content renders correctly as Markdown.
   - Test on mobile viewport using browser developer tools.

## Verification

### Automated Tests
Run the test suite to ensure no regressions:
```bash
npm test
```

### Manual Checklist
- [ ] Rulebook modal opens from Lobby.
- [ ] Rulebook modal opens from Game Room.
- [ ] Closing the modal works via "Close" button.
- [ ] Closing the modal works via backdrop click.
- [ ] Content is loaded asynchronously.
- [ ] Loading indicator is shown if fetch takes time.
- [ ] Verify no PeerJS reconnection or page reload occurs when toggling rulebook (FR-004).
- [ ] Verify modal opens and closes in under 200ms (SC-003).
