# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files must open directly in a browser.

## Project Structure
The repository is nearly empty for now. Planned layout (create as needed):
- `index.html` — entry page, at the top level
- `css/` — stylesheets
- `js/` — scripts
- `tools/` — one page per tool
- `assets/` — images and other static files

Update this section as files are added.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Feature Plan
A portal where students try small web tools about solar power systems.

### Portal structure
- **Homepage (`index.html`)**: title, a one-line intro, the theme toggle, and a grid of tool cards (one card per tool).
- **Opening a tool**: the visitor clicks a tool's card and lands on that tool's own page in `tools/`.
- **Getting back**: every tool page has a "Back to all tools" link and a clickable site title, both leading to the homepage.
- **Adding a new tool later**: create `tools/<tool-name>.html` and `js/<tool-name>.js`, then add one card to the homepage grid. Nothing else changes.

### Phases
1. **Phase 1: the portal plus its first tool.** Homepage, theme toggle, shared styles, and one tool: the **system sizing calculator** (daily electricity use and sun hours in; number of panels, array size and battery size out).
2. **Phase 2: more tools.** Add further solar tools one at a time (ideas: panel output estimator, payback and savings, battery runtime).
3. **Phase 3: polish.** Improvements based on use, such as tool search and short "how it works" notes. To be decided later.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
