# Cinematic Full-Page Deck Design

## Goal

Convert the selected cinematic CS 180 Project 0 site into a four-slide vertical presentation. Every mouse-wheel gesture advances exactly one viewport. Text and media animate together when their slide becomes active, and all slide content remains visible within the viewport.

## Slide Structure

1. **Cover — Perspective in Motion**
   - Full-bleed Pingu dolly-zoom animation.
   - Project label, title, author, frame counter, and a down-scroll cue.
2. **Sequence 01 — Portrait**
   - Compact experiment title and explanation.
   - Three portrait frames labeled Close/Wide, Step Back, and Far/Zoom.
3. **Sequence 02 — Architecture**
   - Compact experiment title and explanation.
   - Two building frames labeled Farther/Telephoto and Closer/Wide.
4. **Sequence 03 — Dolly Zoom**
   - Compact title and director's note.
   - Main animated GIF, four representative frames, and project footer.

Each slide is exactly one viewport high (`100svh`) and clips overflow. Typography, image height, gaps, and padding use viewport-aware `clamp()` values so headings and images remain on the same slide at common desktop and mobile sizes.

## Navigation Behavior

- The page is a single vertically scrollable deck with mandatory CSS scroll snapping.
- A non-passive wheel handler maps positive delta to the next slide and negative delta to the previous slide.
- Input locks for roughly 850 ms after a transition so a wheel or trackpad gesture cannot skip slides.
- The first slide ignores upward navigation; the fourth slide ignores downward navigation and remains in place.
- Arrow Up/Down, Page Up/Down, Home, End, and Space provide keyboard equivalents.
- Touch devices retain native vertical swipe behavior with mandatory scroll snapping.
- A fixed four-dot progress rail shows the current slide. Its dots are labeled buttons and can jump directly to a slide.

## Animation Behavior

An `IntersectionObserver` and scroll position keep one active slide index. Active slides receive an `is-active` class.

- Chapter label fades and rises first.
- Heading follows after a short delay.
- Explanation text follows the heading.
- Media enters last with per-image staggered delays.
- Portrait frames rise and fade in sequentially.
- Architecture frames reveal inward from the left and right.
- Dolly-zoom media scales gently from 1.04 to 1 while the filmstrip rises in sequence.
- Leaving a slide resets its entrance state so the animation plays again when revisited.
- `prefers-reduced-motion: reduce` removes transforms and transition delays while preserving paging.

## Component Boundaries

- `app/cinematic/page.tsx` remains the route and metadata owner.
- `components/cinematic-deck.tsx` is a client component responsible for the four-slide markup, active slide state, wheel/keyboard navigation, progress controls, and observer lifecycle.
- `components/project-ui.tsx` continues to own the explanatory copy only.
- `app/globals.css` owns the cinematic theme, full-screen layout, slide-specific animation rules, responsive constraints, and reduced-motion behavior.

No server state, persistence, network request, or new dependency is needed.

## Edge Cases

- Repeated trackpad events during a transition are ignored.
- Wheel events at the first and last boundaries do not wrap.
- Resize recalculates the nearest slide using the live deck height.
- Interactive progress buttons are not intercepted by page-wheel navigation.
- If `IntersectionObserver` is unavailable, scroll position still determines the active index.
- The existing `/` and `/cinematic` routes render the same four-slide experience.

## Validation

- Production build succeeds.
- `/` and `/cinematic` return successful responses.
- `/editorial` and `/contemporary` remain removed.
- The deck contains exactly four `100svh` slides.
- Wheel, keyboard, progress-button, and touch navigation cannot move beyond slide four.
- All supplied photographs and the animated GIF load from local media assets.
- Reduced-motion mode presents every element without entrance transforms.
