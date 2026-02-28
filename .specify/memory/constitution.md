<!--
<sync_impact_report>
- Version change: 0.1.0 → 1.0.0
- List of modified principles:
  - Principle 1: Monotone & WCAG AA (New)
  - Principle 2: PeerJS P2P (New)
  - Principle 3: Color Vision Accessibility (New)
  - Principle 4: Maintainability & Responsive (New)
  - Principle 5: Vercel Native (New)
  - Principle 6: Incremental Implementation (New)
- Added sections: Technical Stack, Development Workflow, Compliance Review.
- Removed sections: None.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md: Updated "Constitution Check" guidance.
  - ✅ .specify/templates/spec-template.md: Added accessibility and P2P requirements sections.
  - ✅ .specify/templates/tasks-template.md: Added accessibility and P2P testing categories.
- Follow-up TODOs: None.
</sync_impact_report>
-->

# みちびき (Michibiki) Constitution

## Core Principles

### I. Monotone-Based WCAG AA Compliance
All UI/UX design must strictly adhere to a monotone-based aesthetic while maintaining a minimum contrast ratio of 4.5:1 (WCAG AA) for all text and functional elements. This ensures maximum readability and a clean, professional appearance.

### II. Serverless P2P Combat
Multiplayer functionality must be implemented using PeerJS for direct peer-to-peer connectivity. The system should operate without a traditional backend server for matchmaking or game state management, relying on client-side logic and P2P data exchange.

### III. Universal Design for Color Vision
To support players with color vision deficiencies, identification of players (Host vs. Guest) and their respective game elements must not rely solely on color (e.g., Blue vs. Red). All player-specific elements must also use distinct line styles (e.g., Solid vs. Double lines) to ensure clarity for all users.

### IV. Maintainability & Responsive UX
The codebase must prioritize long-term maintainability through clean abstractions and consistent patterns. The user interface must be fully responsive, providing a high-quality experience on both mobile and desktop devices without sacrificing functionality or ease of use.

### V. Vercel-Native Deployment
The application is designed to run as a standalone web application on Vercel. All features, including P2P connectivity and game logic, must be compatible with Vercel's deployment environment (Next.js App Router) without external server dependencies.

### VI. Incremental Implementation
Development must follow an "Outline-First, Detail-Later" approach. Initial phases should focus on the broad architectural framework and core loop before proceeding to detailed feature implementation and polishing.

## Technical Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (Monotone-first)
- **P2P Connectivity**: PeerJS
- **Interactions**: @dnd-kit (Drag and Drop)
- **Utilities**: qrcode.react (Room sharing)

## Development Workflow
1. **Constitution Alignment**: All new features must be verified against these principles.
2. **Accessibility-First**: WCAG compliance and color vision accessibility must be considered during the design phase.
3. **P2P Testing**: Peer-to-peer connectivity and synchronization must be tested across different network environments.

## Governance
- This constitution supersedes all other development practices within the "Michibiki" project.
- Amendments to these principles require a version bump (Semantic Versioning) and a Sync Impact Report.
- All Pull Requests and design documents must include a "Constitution Check" to ensure compliance.

**Version**: 1.0.0 | **Ratified**: 2026-02-28 | **Last Amended**: 2026-02-28
