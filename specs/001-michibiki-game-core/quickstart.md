# Quickstart: Michibiki Core Game Logic

## Local Setup
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd michibiki
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open the game**:
   Visit `http://localhost:3000`

## P2P Testing (Two Windows)
1. Open **Browser Window A**: Click "Create Room".
2. Copy the URL (e.g., `http://localhost:3000/room/ABC`).
3. Open **Browser Window B**: Paste the URL and hit Enter.
4. Verify Window A shows "Guest Connected" and the 6x6 grid appears on both.

## Running Tests
1. **Unit Tests (BFS/Scoring)**:
   ```bash
   npm test
   ```
2. **Integration Tests (PeerJS/Matchmaking)**:
   ```bash
   npx playwright test
   ```
