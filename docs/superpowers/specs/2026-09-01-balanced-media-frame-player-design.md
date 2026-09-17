# Balanced Media and Frame Player Design

## Goal

Refine the existing four-slide cinematic Project 0 site so that all text and media are visibly larger without allowing content to leave its viewport. Every supplied photograph must keep its original aspect ratio and remain fully visible. Replace the Dolly Zoom GIF with an interactive, preloaded 12-frame player.

## Scope

The four-slide structure, one-wheel-gesture navigation, slide progress rail, entrance animations, keyboard controls, and last-slide boundary behavior remain unchanged. This refinement changes responsive sizing, image presentation, the cover composition, and the Dolly Zoom media component only.

The site must use the latest files in the workspace `result` directory. The Dolly Zoom sequence contains exactly `3-1.jpeg` through `3-12.jpeg`; no references to frames 13 or 14 may remain.

## Balanced Enlargement

Use the selected balanced approach across desktop and mobile layouts:

- Increase major chapter headings by approximately 12 percent from the current design.
- Increase explanatory copy by approximately 22 percent from the current design.
- Increase the usable media region by approximately 15 percent by reducing outer padding, unnecessary gaps, and decorative media below the main image.
- Keep labels and utility text subordinate, but increase any text that is currently difficult to read.
- Continue using viewport-aware `clamp()` rules and compact-height breakpoints so every slide remains exactly one viewport tall.

These percentages define the intended visual hierarchy rather than exact computed-size assertions. The acceptance criterion is that text and imagery are clearly larger than the current production version while all required content remains visible at the tested desktop and mobile viewports.

## Uncropped Media Rule

Every photograph and frame must preserve the source file's intrinsic aspect ratio and show the complete image:

- Remove forced photographic aspect ratios such as `3 / 4` and `4 / 5` when they alter a source image's natural ratio.
- Use contained image stages with `object-fit: contain` and centered alignment.
- Allow dark letterboxing where a stage and image have different proportions.
- Do not use `object-fit: cover`, overflow-based cropping, or enlarged transforms on photographic media.
- The Portrait images may have slightly different visible heights because their source ratios differ. Their stages align as a group while each image remains complete.

Because a full-bleed portrait GIF cannot remain uncropped on a landscape viewport, the cover changes to a cinematic split composition: enlarged title and introduction on the left, with one complete static Pingu frame in a contained stage on the right. No GIF is used anywhere on the site.

## Dolly Zoom Frame Player

Replace the current GIF, representative filmstrip, and frame counter with one larger interactive player using the 12 updated Pingu images.

### Media Preparation

- Generate web-sized JPEG derivatives for all 12 frames without cropping or changing aspect ratio.
- Keep the optimized frames in numeric order and expose a deterministic array from frame 1 through frame 12.
- Preload and decode all 12 frames before automatic playback starts so browser decoding cannot visually skip frames.
- Display the first frame while loading and expose a compact loading or ready state in the player controls.

### Controls

- Use the project's built-in UI component system for the Slider and replay button.
- The Slider has integer values from 1 through 12 and a step of 1.
- Moving the Slider immediately stops active playback and displays the selected frame.
- Show the current frame as a zero-padded value such as `05 / 12`.
- Provide a Replay control that starts a complete pass from frame 1.
- Do not display the old four-image filmstrip; its space is reassigned to the larger main image and controls.

### Automatic Playback

- The first time the Dolly Zoom slide becomes active, play frames 1 through 12 exactly once.
- Use the selected A timing of 250 milliseconds per frame, for an approximately three-second pass.
- Every frame must be assigned in sequence without skipping: `1, 2, 3, ... 12`.
- Stop on frame 12 and leave the Slider at 12.
- Returning to the slide does not trigger automatic playback again.
- Replay remains available and also ends on frame 12.
- If the user drags the Slider during playback, cancel playback and give the Slider immediate control.
- If the slide becomes active before preloading finishes, begin the one-time automatic pass only after all frames are decoded and only if the slide is still active. Otherwise, defer the pass until the next time the slide becomes active.

## Component Boundaries

- `components/cinematic-deck.tsx` continues to own deck navigation and active-slide state.
- A focused client-side frame-player component owns preload state, current frame, first-entry autoplay, replay, scrubbing, and timer cleanup.
- The frame-player receives the Dolly slide's active state rather than observing the page independently.
- `components/project-ui.tsx` updates the Dolly Zoom explanation from fourteen frames to twelve.
- `app/globals.css` owns the balanced sizing adjustments, contained media stages, and responsive player layout.
- Optimized frame assets live under `public/media` and are derived from the latest workspace result files.

## Lifecycle and Failure Behavior

- Clear active timers when the user scrubs, starts replay, leaves the component, or unmounts the page.
- Starting Replay while playback is active restarts from frame 1 with a single timer.
- If a frame fails to preload, keep the player usable at the last successfully displayed frame, surface a compact load failure state, and do not start automatic playback.
- `prefers-reduced-motion: reduce` disables automatic playback. The Slider and Replay control remain available, and Replay may advance the sequence without transition effects.

## Responsive Behavior

- Desktop slides retain a text-and-media split, with more width allocated to media than the current version.
- Tablet and mobile slides stack compact text above media while keeping both in the same viewport.
- Mobile explanatory text must remain readable; it may not be reduced back to the previous 10-pixel size.
- The player image scales down with `contain` but never crops.
- Controls remain large enough to operate by touch, and the Slider spans the available width.

## Validation

- Production build succeeds and both `/` and `/cinematic` render the updated deck.
- The deck still contains exactly four `100svh` slides.
- Desktop and mobile layout checks confirm required headings, copy, media, and controls remain within each slide.
- Computed styles and intrinsic-dimension checks confirm that every photographic asset is contained and uncropped.
- The player loads exactly 12 distinct frame URLs and never requests frame 13, frame 14, or the old GIF.
- An instrumented playback test records the sequence `01` through `12` in order and confirms the final frame and Slider value are both 12.
- Autoplay runs once on first activation, waits for preload completion, and does not run again after leaving and returning.
- Scrubbing cancels playback and changes exactly one frame per Slider step.
- Browser console and network checks show no runtime or asset-loading errors.
