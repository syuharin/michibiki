# Quickstart: Display Game Result & Rematch

## Overview
This feature adds the "Game Over" trigger and the result UI for the Michibiki game.

## Prerequisites
- A local environment running the game on two browser tabs.
- PeerJS connectivity established between the two tabs.

## Testing Steps

### 1. Triggering Game Over
1. Open two tabs: `http://localhost:3000/room/test-room`
2. Connect them as Host and Guest.
3. Play until both players have 0 cards in hand and the deck is exhausted.
4. Verify the `GameResultModal` appears automatically.
5. Check if the winner and scores are displayed correctly.

### 2. Testing Rematch
1. From the Result screen, click "Rematch" on both tabs.
2. Verify that the UI updates to "Waiting for opponent...".
3. Once both are ready, the game should reset the board and return to the "Turn Order Selection" phase.

### 3. Return to Lobby
1. From the Result screen, click "Return to Lobby".
2. Verify the browser returns to the initial lobby/matchmaking screen.
3. Verify the P2P connection is closed.
