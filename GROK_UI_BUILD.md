# Identity

You are the **UI/UX architect and senior React frontend engineer** for this task.

Your responsibility is to turn the existing Vite + React + TypeScript starter into a polished, functional, responsive **fictional university course-registration planner**.

This is a tightly scoped frontend build.

Do not redesign the product concept.
Do not expand the scope.

---

# Skills

Before editing:

1. Inspect the currently available Grok Build project/user skills.
2. If relevant existing skills are available for:

   * UI/UX design
   * frontend engineering
   * React
   * responsive design
   * accessibility
   * interaction design
   * design systems

   use them where helpful.
3. Do **not** create, install, or configure new skills, plugins, MCP servers, or tooling for this task.
4. Treat the project-root `DESIGN.md` as the primary design-system reference.

Use these capabilities throughout the implementation:

* **UI/UX architecture**
* **visual hierarchy and information design**
* **design-system interpretation**
* **React + TypeScript frontend engineering**
* **responsive layout**
* **interaction and microinteraction design**
* **accessibility**
* **product UX**
* **frontend verification**

---

# Working Directory

Work only inside the existing project:

```text
C:\Users\hp\webmcp-course-planner
```

The project has already been created as a **Vite + React + TypeScript** application.

Inspect the actual repository before modifying anything.

Do not assume files or dependencies that you have not inspected.

---

# Required Context

## 1. Read `DESIGN.md`

Read the entire root-level:

```text
DESIGN.md
```

before implementing the UI.

Use it for:

* typography hierarchy
* spacing discipline
* restrained interface chrome
* layout rhythm
* surface hierarchy
* interaction quality
* button behavior
* visual density
* overall Apple-inspired design discipline

However, the product has intentional overrides described below.

## 2. Visual Reference

Use the **attached reference image** as inspiration for:

* large areas of whitespace
* editorial composition
* asymmetric split layouts
* strong black/white contrast
* clean section rhythm
* restrained typography
* premium presentation
* minimal visible UI chrome

Do **not** copy the coffee website literally.

Translate its visual principles into an interactive course-planning application.

---

# Product

Build a single-page application for a **fictional university Biology student planning one semester**.

The product should communicate:

> A student and an AI agent will eventually work on the same live semester schedule.

For this task, however, build **only the human-facing UI and local interactive state**.

WebMCP will be implemented separately later.

---

# Core User Scenario

The future WebMCP demo will begin with:

> “Build me a maximum 15-credit Biology schedule. No 8 AM classes and keep Friday free.”

The human will later change something directly in the website:

> **Block Tuesday at 11 AM.**

The AI will eventually need to observe that changed website state.

Therefore the UI you build now must make preferences and schedule state **clear, inspectable, and directly editable by the human**.

---

# Visual Direction

## Overall character

Create a design that feels:

* premium
* quiet
* precise
* editorial
* minimal
* modern
* highly legible
* deliberately designed

Think:

> **editorial minimalism + Apple-inspired restraint + selective glass surfaces**

Not:

> generic SaaS dashboard.

---

# Color System

Use an intentionally monochrome palette.

Primary palette:

```text
#000000 — primary black
#1D1D1F — soft black
#FFFFFF — white
#F5F5F7 — off-white surface
#E8E8ED — separators
#86868B — muted text
```

You may derive subtle intermediate neutral tones where required.

### Important override to `DESIGN.md`

Do **not** use Apple's blue accent as the primary interaction color.

This product should remain essentially **black and white**.

Use contrast, weight, border treatment, fill changes, and subtle opacity rather than bright color for interaction states.

---

# Glass / Translucency

Use glass effects **sparingly and functionally**.

Good places:

* sticky navigation
* floating preference controls
* compact summary/status surfaces
* review/registration control
* overlays if required

Avoid glass on every card.

Approximate light treatment:

```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px) saturate(140%);
border: 1px solid rgba(0, 0, 0, 0.08);
```

Approximate dark treatment when genuinely appropriate:

```css
background: rgba(20, 20, 20, 0.72);
backdrop-filter: blur(20px) saturate(130%);
border: 1px solid rgba(255, 255, 255, 0.10);
```

Adapt these values if better visual judgment requires it.

The timetable and important academic information should remain crisp and easy to read.

---

# Typography

Use system fonts only unless the existing project already provides something suitable.

Preferred stack:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  system-ui,
  sans-serif;
```

Use:

* large confident editorial headings
* tight heading letter spacing
* comfortable body copy
* small subdued labels
* restrained font-weight variation

Do not imitate Apple's branding or use proprietary assets.

---

# Page Architecture

Build one cohesive long-form page with approximately this hierarchy.

## 1. Navigation

Minimal sticky/floating glass navigation.

Left:

```text
Course Planner
```

or another restrained fictional product label.

Right side may show compact context such as:

```text
Biology
Fall 2026
```

Keep the navigation extremely minimal.

No complex navigation system.

---

## 2. Hero / Planning Workspace

Use a bold asymmetric split similar in spirit to the supplied reference image.

### Left side

Editorial introduction:

```text
Build a semester
that fits your life.
```

Supporting copy should explain very briefly that the planner balances academic requirements with schedule preferences.

Below it, show student context:

```text
Biology
Fall 2026
```

Then place editable **Preferences**.

Required controls:

```text
Maximum credits     15
No 8 AM classes     On
Keep Friday free    On
```

Also provide a clear way for the student to block a time.

The critical demo state must include:

```text
Tuesday • 11:00 AM
Available / Blocked
```

The human must be able to toggle this state directly.

---

## 3. Current Plan / Timetable

The other side of the hero should strongly feature the current semester plan.

Display:

```text
Current plan
14 / 15 credits
```

Create a visually excellent weekly timetable for:

```text
Monday
Tuesday
Wednesday
Thursday
Friday
```

Use realistic mock Biology-related classes.

Example subject families may include:

* Genetics
* Ecology
* Statistics
* Cell Biology
* Chemistry

The data is fictional.

Do not claim affiliation with a real institution.

The timetable must remain readable and visually clean.

---

# Important Interaction

When the user changes:

```text
Tuesday 11:00 AM
Available → Blocked
```

the UI must visibly reflect that new state.

This does **not** need WebMCP.

Use normal React state.

The purpose is to establish the same application state that WebMCP will later read.

---

# 4. Remaining Requirements

Create a spacious editorial section titled approximately:

```text
Remaining requirements.
```

Show a small number of academic requirements.

Examples:

```text
Genetics
Statistics
Ecology
```

Do not build a full degree audit.

Keep this visually closer to an editorial/product section than a generic dashboard grid.

---

# 5. Available Sections

Create a second section showing a small realistic set of available course sections.

Each item should clearly communicate useful information such as:

```text
STAT 210
Applied Statistics
Tue / Thu • 11:00 AM
3 credits
12 seats
```

Provide simple human interactions such as:

```text
Add
Remove
```

These should modify local React state where practical.

Do not implement a real registrar engine yet.

---

# 6. Plan Status

Provide a small, elegant area that communicates whether the current proposed schedule is ready for review.

Example concepts:

```text
Schedule status
Ready to review
```

or

```text
14 credits
4 courses
No time conflicts
```

This is visual/local demo state only.

Do not create complex validation architecture.

---

# 7. Final Review Area

Near the bottom of the page, create a strong minimal final section.

Something conceptually like:

```text
Your semester,
ready for review.
```

Provide a clear:

```text
Review schedule
```

or

```text
Prepare registration
```

action.

Do **not** pretend to perform a real university registration.

If clicked, it may open a simple review state/modal/panel confirming that this is a fictional demo.

Do not implement final registration infrastructure.

---

# Product State

Use simple local React state for the UI.

At minimum, state should represent:

* maximum credits
* no-8-AM preference
* Friday-free preference
* Tuesday 11 AM availability/block
* selected courses
* current credit total

Keep this state architecture simple and legible because WebMCP will later need to interact with it.

Avoid burying important state inside unnecessary abstractions.

---

# Sample Data

Create a small amount of realistic fictional data directly in the frontend.

Enough to make the page feel intentional and believable.

Do not create a huge catalog.

Approximately:

```text
5–8 courses / sections
3 remaining degree requirements
3–4 courses in the current timetable
```

is enough.

Use fictional university/course data.

Do not use real university logos, trademarks, branding, or student data.

---

# Interaction Design

Interactions should feel polished but restrained.

Use:

* subtle hover states
* short transitions
* small scale/opacity responses
* clean toggle feedback
* smooth local state changes
* visible keyboard focus
* strong selected/unselected states

Avoid:

* bouncing animations
* excessive motion
* parallax
* glowing effects
* animated gradients
* unnecessary loading sequences

Motion should clarify state, not decorate the page.

---

# Responsive Design

The UI must work well on:

* desktop
* laptop
* tablet
* mobile

Desktop should get the strongest editorial split composition.

On smaller screens:

* stack sections naturally
* maintain strong hierarchy
* keep timetable usable
* prevent horizontal page overflow
* keep controls easy to tap
* preserve readability

Do not simply shrink the desktop layout.

---

# Accessibility

Implement basic production-quality accessibility.

Ensure:

* semantic HTML
* labels for controls
* keyboard-operable interactions
* visible focus states
* sufficient contrast
* buttons are real buttons
* headings follow logical order
* interactive elements are not conveyed by color alone
* reduced-motion preference is respected where animations exist

---

# Implementation Constraints

Stay within the existing stack.

Prefer:

```text
React
TypeScript
CSS
```

Inspect the project before deciding exact file organization.

Do not add dependencies unless they produce a clear material benefit.

Prefer CSS and small React components over installing a UI framework.

Do not add:

* Tailwind solely for this task
* component libraries solely for this task
* animation frameworks
* backend frameworks
* databases
* authentication
* AI SDKs

unless they are already present and genuinely necessary.

---

# Hard Non-Goals

Do NOT implement:

* WebMCP
* MCP
* AI/chatbot
* OpenAI/xAI/Gemini API
* backend
* database
* authentication
* real university integration
* real registration
* multiple students
* multiple universities
* multiple majors
* full degree audit
* payments
* notifications
* analytics
* admin dashboard
* GitHub configuration
* Vercel configuration
* deployment
* unrelated documentation overhaul

Do not initialize a new Git repository.

Do not publish anything.

---

# File / Repository Discipline

Before editing:

1. Inspect the repository.
2. Read `DESIGN.md`.
3. Read existing `package.json`.
4. Inspect the current `src/` structure.
5. Preserve working Vite configuration unless a change is actually required.

Then implement the smallest clean component structure that supports the UI.

Do not perform unrelated refactors.

Do not rewrite configuration files unnecessarily.

---

# Design Quality Bar

The result should **not look AI-generated by default**.

Avoid common generated-dashboard patterns:

* endless rounded cards
* purple/blue gradients
* oversized pills everywhere
* glass on every surface
* generic three-column feature grids
* random icons
* excessive borders
* arbitrary badges
* fake metrics
* excessive copy

Use whitespace and typography as primary design tools.

The supplied visual reference should be recognizable in the **composition and restraint**, without copying its coffee-specific content.

---

# Success Criteria

The task is complete only if:

* the default Vite starter UI is completely replaced
* the site clearly looks like a premium course planner
* visual direction follows `DESIGN.md` with the monochrome override
* the attached reference image materially influences composition
* the page feels editorial rather than dashboard-template-like
* preferences are directly editable
* Tuesday 11 AM can be manually blocked/unblocked
* course add/remove interactions work locally
* current credits update where applicable
* timetable reflects current local state where practical
* layout is responsive
* keyboard/focus behavior is usable
* there are no obvious console/runtime errors
* no WebMCP/backend/auth/deployment work was added
* existing build remains functional

---

# Verification

After implementation:

1. Inspect the final diff.
2. Run the project's existing build command.
3. Run the existing lint/check command if one is defined in `package.json`.
4. Fix issues caused by your changes.
5. Verify the page manually in the browser.
6. Check at least:

   * desktop width
   * tablet width
   * mobile width
7. Test:

   * preference toggles
   * Tuesday 11 AM block/unblock
   * adding/removing a course
   * credit total updates
   * final review interaction
8. Confirm there are no obvious console errors.

Do not claim success based only on generated code.

---

# Final Response

Do the implementation directly.

Do not return a tutorial or a proposed design instead of editing the project.

When finished, respond concisely with:

```text
Implemented:
- ...

Key files changed:
- ...

Verified:
- ...

Not implemented by design:
- WebMCP
- backend
- deployment
```

If a requirement is genuinely blocked by the existing project state, report the exact evidence instead of inventing a workaround.

Do not expand scope to solve unrelated problems.
