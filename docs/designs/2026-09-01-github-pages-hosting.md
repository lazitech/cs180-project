# GitHub Pages Hosting Design

Date: 2026-09-01
Owner: Anzhe Lyu

## Goal

Publish the existing CS180 Project 0 presentation from the public
`lazitech/cs180-project` repository, while adding a small course landing page that can
grow to include later assignments.

The public URLs will be:

- Course index: `https://lazitech.github.io/cs180-project/`
- Project 0: `https://lazitech.github.io/cs180-project/0/`
- Project 1: `https://lazitech.github.io/cs180-project/1/`

## Scope

The deployment work must preserve the current Project 0 design and behavior:

- four full-screen sections with one-section-per-wheel-step navigation;
- responsive layouts on desktop and mobile;
- uncropped images that retain their original aspect ratios;
- the interactive 12-frame Pingu dolly-zoom player;
- automatic first playback, manual replay, and frame-by-frame scrubbing.

The work does not redesign Project 0 or change its copy, timing, or images.

## Information Architecture

The current presentation will move from the application root to route `/0/`.
The root route will become a lightweight CS180 index containing:

- the course name;
- the student name, Anzhe Lyu;
- a Project 0 entry that links to `/0/`;
- a structure that can accept later project entries without changing the
  deployment architecture.

The existing `/cinematic/` compatibility route is not part of the public
navigation. It may be retained only if it does not duplicate generated output
or complicate static export; otherwise it will be removed.

## Build and Deployment Architecture

The existing React/Next-compatible source remains the source of truth on
`main`. Vinext remains the local preview and Sites build tool, while the
official Next.js static exporter will generate the GitHub Pages artifact. This
avoids a Vinext beta limitation in which static export and `basePath` do not
currently prerender the application routes together. The Pages build will use
`/cs180-project` as its production base path so that HTML, JavaScript, CSS, links, the
favicon, and all media resolve correctly from a project site rather than from
the `github.io` domain root.

A GitHub Actions workflow will:

1. run on pushes to `main` and on manual dispatch;
2. check out the repository;
3. install the locked dependencies;
4. build the static site with the GitHub Pages base path;
5. upload the generated static directory as a Pages artifact;
6. deploy the artifact to the `github-pages` environment.

The generated site will include a `.nojekyll` marker so GitHub Pages serves all
framework assets directly. The exported static `public/1/index.html` report
will be available at `/1/` alongside the React-rendered Project 0 route.

## Asset and Route Handling

Absolute paths such as `/media/dolly-frame-01.jpg` currently point to the
domain root and would fail on a project site. Shared route-aware asset handling
will prefix local public assets with the configured base path in production.

All 12 dolly-zoom frame URLs will be constructed from the same helper or base
constant as the still-image URLs. This keeps preloading, displayed frames, and
the frame slider synchronized and avoids one-off path fixes.

Internal navigation will use route-aware links so the course index points to
`/cs180-project/0/` in production while remaining usable in local development.

## Repository and Remote Strategy

The existing private Sites remote will be preserved under the remote name
`sites`. The public GitHub repository
`https://github.com/lazitech/cs180-project.git` will become `origin`.

Only project source, public assignment media, configuration, documentation, and
the deployment workflow will be pushed. Local runtime artifacts and secrets
must remain excluded by `.gitignore`.

## Failure Handling

- A failed install or build stops deployment before the current live site is
  replaced.
- Missing media must fail local verification rather than silently shipping
  broken frames.
- The player retains its existing loading and frame-load error states.
- Deployment diagnostics remain available in the repository's Actions history.
- A simple static 404 page may route visitors back to the course index if the
  export tool does not already emit a suitable fallback.

## Verification

Before pushing:

- run lint and the production static build;
- inspect the export to confirm both `/index.html` and `/0/index.html` exist;
- confirm every generated asset URL includes the `/cs180-project` base path where
  required;
- serve the export beneath a simulated `/cs180-project/` path;
- verify course-index navigation to Project 0;
- verify all four presentation sections on desktop and mobile;
- verify all 12 Pingu frames load in order, autoplay once, stop on frame 12,
  replay, and respond to slider input;
- confirm no image is cropped or stretched.

After pushing:

- confirm the GitHub Actions deployment succeeds;
- open all three public URLs directly, including a refresh on `/cs180-project/0/` and `/cs180-project/1/`;
- repeat the key desktop/mobile and 12-frame checks against the public site;
- confirm the repository remains public for course submission.

## Chosen Approach and Alternatives

The selected approach is GitHub Actions plus an official Next.js static
export. It keeps the current interactive implementation maintainable, leaves
Vinext available for the existing development workflow, and avoids committing
generated files.

Rejected alternatives:

- A dedicated `gh-pages` branch would mix deployment artifacts into the Git
  history and add a second publication workflow to maintain.
- Rewriting the experience as hand-authored HTML, CSS, and JavaScript would
  duplicate already working React behavior and make later changes riskier.
