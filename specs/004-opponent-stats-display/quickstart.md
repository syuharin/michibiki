# Quickstart: Opponent Stats and Deck Display

## Running the Feature
1.  **Start development server**:
    ```bash
    npm run dev
    ```
2.  **Open two browser tabs**:
    -   Tab 1 (Host): `http://localhost:3000`
    -   Tab 2 (Guest): Use the Room ID from Tab 1 to join.
3.  **Verify Stats**:
    -   Ensure both players' scores are visible in their respective views.
    -   Check that the deck count (overlay on the deck icon) updates as tiles are drawn or placed.

## Development Checklist
- [ ] Is the opponent's score clearly attributed?
- [ ] Is the deck count overlay legible on all screen sizes?
- [ ] Are icons used to supplement numerical values?
- [ ] Do values sync correctly between Host and Guest?
