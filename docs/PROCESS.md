# WordZApp - Development Process

**Purpose:** Define how we work, track progress, and verify implementations.

---

## How We Work

### Before Starting Any Task
1. Check [PROGRESS.md](./PROGRESS.md) for the current milestone
2. Find the next unchecked task
3. Read the specification in [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)

### During Implementation
1. Mark task as `[~]` (in progress) in PROGRESS.md
2. Follow the specification exactly
3. Test as you go

### After Completing
1. Mark task as `[x]` (completed)
2. Run verification checklist
3. Add entry to changelog in PROGRESS.md
4. Commit with descriptive message

---

## Status Markers

| Marker | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[!]` | Blocked / Issue |
| `[?]` | Needs review |

---

## Verification Process

Every feature must pass both visual and functional verification.

### Visual Verification Checklist
```markdown
- [ ] Matches design specification
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1280px)
- [ ] Looks correct in dark theme
```

### Functional Verification Checklist
```markdown
- [ ] Primary use case works
- [ ] Edge cases handled
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] No console errors
- [ ] No TypeScript errors
```

### Integration Verification
```markdown
- [ ] Existing features still work
- [ ] Performance acceptable (60fps)
- [ ] No regressions introduced
```

---

## Acceptance Criteria Format

Use Given/When/Then format for all features:

```
Feature: [Feature Name]

Scenario: [Scenario Name]
  Given [initial state]
  When [action taken]
  Then [expected result]
  And [additional expectations]
```

**Example:**
```
Feature: Timer Warning

Scenario: Timer enters danger zone
  Given the game is in progress
  When the timer drops below 5 seconds
  Then the timer ring turns red
  And the timer shakes
  And a warning sound plays (if sound enabled)
```

---

## Commit Message Format

```
type(scope): short description

- Detail 1
- Detail 2

Closes #issue (if applicable)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `style` - Visual/CSS changes
- `refactor` - Code restructuring
- `docs` - Documentation
- `chore` - Maintenance

**Example:**
```
feat(timer): add neon glow and danger state

- Added CSS variables for timer colors
- Implemented shake animation under 5s
- Added color transition from cyan to red
```

---

## File Organization

### Where Things Live

| Purpose | Location |
|---------|----------|
| Global styles | `src/index.css` |
| Type definitions | `src/types/game.ts` |
| Game state | `src/context/GameContext.tsx` |
| Sound system | `src/context/SoundContext.tsx` |
| Reusable UI | `src/components/ui/` |
| Game components | `src/components/game/` |
| Pages | `src/pages/` |
| Services | `src/services/` |
| Hooks | `src/hooks/` |
| Static assets | `public/` |
| Sound files | `public/sounds/` |
| Word data | `public/data/` |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GlassCard.tsx` |
| Hooks | camelCase with "use" | `useLocalStorage.ts` |
| Services | camelCase | `audioService.ts` |
| CSS classes | kebab-case | `glass-card` |
| Constants | SCREAMING_SNAKE | `MAX_STREAK` |

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Git
git status           # Check changes
git add <files>      # Stage files
git commit -m "msg"  # Commit
git push             # Push to remote
```

---

## Issue Tracking

When you hit a blocker:

1. Mark the task as `[!]` in PROGRESS.md
2. Add an entry to the Issues table in PROGRESS.md
3. Document:
   - What you were trying to do
   - What went wrong
   - Any error messages
   - What you've tried

---

## Review Checklist

Before marking a milestone complete:

- [ ] All tasks checked off
- [ ] All verifications passed
- [ ] Changelog updated
- [ ] No `[!]` or `[?]` items remaining
- [ ] Code committed and pushed
- [ ] Brief milestone review written
