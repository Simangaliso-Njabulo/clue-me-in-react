# WordZApp: The Guessing Game

## Project Overview
Neon Arcade themed party word game. Transform from amateur to professional quality.

## Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Development Workflow
1. Check current task in `docs/PROGRESS.md`
2. Read specification in `docs/DEVELOPMENT_PLAN.md`
3. Implement following the spec exactly
4. Update PROGRESS.md when task complete

## Code Style
- Components: PascalCase (`GlassCard.tsx`)
- Hooks: camelCase with "use" (`useLocalStorage.ts`)
- Services: camelCase (`audioService.ts`)
- CSS classes: kebab-case (`glass-card`)
- Constants: SCREAMING_SNAKE (`MAX_STREAK`)

## File Locations
| Purpose | Path |
|---------|------|
| Global styles | `src/index.css` |
| Types | `src/types/game.ts` |
| Game state | `src/context/GameContext.tsx` |
| Sound system | `src/context/SoundContext.tsx` |
| Reusable UI | `src/components/ui/` |
| Game components | `src/components/game/` |
| Pages | `src/pages/` |

## Design System (Neon Arcade)
**Colors:**
- Background: `#0a0a0f` (deep black), `#12121a` (cards)
- Pink: `#ff2d95` (primary accent)
- Cyan: `#00f5ff` (secondary accent)
- Purple: `#b026ff` (tertiary)
- Yellow: `#ffff00` (highlights)
- Green: `#39ff14` (success)

**Fonts:**
- Orbitron: Headings, logo, timer (700, 900)
- Rajdhani: Body text, buttons (500, 600, 700)
- Share Tech Mono: Numbers, countdown (400)

## Important Constraints
- NO background music - sound effects only
- Keep bundle size small - avoid unnecessary libraries
- Test at 375px, 768px, 1280px breakpoints
- Maintain 60fps for animations

## Before Starting a Task
Ask for clarification if any of these are unclear:
- Which specific file(s) to modify
- What the expected visual result should look like
- How to verify the task is complete
- Whether this affects existing functionality

For large features, ask: "Should I interview you about requirements first?"

## Verification Checklist
After implementing, verify:
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Renders correctly on mobile (375px)
- [ ] Existing features still work
