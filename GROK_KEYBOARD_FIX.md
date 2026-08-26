# Objective

Fix **only the keyboard-accessibility failures identified by the independent QA test** in the existing Course Planner.

The existing visual design, layout, responsive behavior, application state, course interactions, timetable, copy, and all currently passing functionality are APPROVED.

This is a **small corrective task**, not a redesign or refactor.

---

# Working Directory

Work only inside:

```text
C:\Users\hp\webmcp-course-planner
```

Before changing anything:

1. Read `AGENTS.md`.
2. Read `GROK_UI_BUILD.md`.
3. Read `DESIGN.md`.
4. Inspect the actual implementation related to:

   * skip link
   * Review schedule dialog
   * buttons/toggles
   * keyboard/focus handling
5. Inspect `package.json`.

Do not assume the cause before inspecting the implementation.

---

# Independent QA Evidence

The following tests PASSED and must remain working:

* page loading/layout
* maximum-credit +/- controls with mouse
* No 8 AM toggle with mouse
* Friday-free toggle with mouse
* Tuesday 11 AM Available/Blocked interaction with mouse
* adding courses
* removing courses
* credit updates
* course-count updates
* timetable updates
* plan-status updates
* Review schedule modal opening
* modal Close button with mouse
* responsive desktop/tablet/mobile layouts
* build
* lint
* runtime console

Do not modify these behaviors except where strictly required to restore standard keyboard accessibility.

The failures were:

```text
FAIL 10
Close button worked, but Escape did not close the Review schedule dialog.

FAIL 11
Skip link was correctly hidden normally and appeared when focused.
Its Enter action successfully navigated to #main.
However, pressing Tab from a fresh page did not focus the skip link.

FAIL 12
Major interactive controls showed visible focus when explicitly focused,
but normal Tab navigation did not advance focus as expected and
Enter/Space did not activate the tested buttons, switches, or
availability controls.
```

---

# Important Diagnostic Rule

Do **not** blindly implement keyboard event handlers everywhere.

First determine whether Tests 11 and 12 are caused by the application itself.

Native elements such as:

```html
<button>
<a href="...">
<input>
```

already provide standard keyboard semantics.

If existing controls are properly implemented as native semantic elements and no application code prevents normal keyboard behavior, do **not** replace correct browser behavior with custom JavaScript merely to satisfy an automation harness.

Specifically investigate:

* inappropriate `tabIndex={-1}`
* positive/custom tab indexes
* `preventDefault()` on keyboard events
* global `keydown` listeners
* event propagation that captures Tab, Enter, Space, or Escape
* custom `div`/`span` controls pretending to be buttons
* disabled/inert ancestors
* focus-management code
* modal behavior interfering with document focus
* CSS that only visually simulates focus
* skip-link DOM position
* incorrect focus restoration

Identify the actual root cause before modifying code.

---

# Fix 1 — Review Schedule Escape Behavior

When the Review schedule dialog is open:

```text
Escape
→ closes the dialog
```

Requirements:

* Escape closes the dialog.
* Close button continues working.
* Clicking existing supported dismissal controls continues working.
* Opening the dialog places keyboard focus appropriately inside it.
* Closing the dialog returns focus to the control that opened it when practical.
* Do not cause Escape to trigger unrelated application actions.

Prefer native accessible dialog behavior where appropriate rather than unnecessary custom keyboard logic.

Do not redesign the dialog.

---

# Fix 2 — Skip Link

The existing skip link must remain.

Expected behavior from a fresh page load:

```text
normal page
→ skip link visually hidden/offscreen

press Tab
→ skip link receives focus
→ skip link becomes visibly displayed

press Enter
→ navigation/focus moves to the main content
```

Requirements:

* skip link remains one of the first focusable elements in DOM order;
* no `tabIndex={-1}`;
* do not use positive `tabindex`;
* do not use `display:none`;
* do not use `visibility:hidden`;
* do not use `aria-hidden`;
* keep the approved focus-visible styling;
* `href` and main target must remain valid;
* main content should receive or correctly establish navigation focus after activation where required.

Do not remove the skip link.

---

# Fix 3 — Normal Keyboard Navigation

Verify that a keyboard-only user can navigate through the page using normal browser semantics.

Expected behavior:

```text
Tab
→ moves to the next interactive control

Shift + Tab
→ moves to the previous interactive control
```

Important interactive controls must be reachable, including:

* maximum-credit decrease
* maximum-credit increase
* No 8 AM toggle
* Keep Friday free toggle
* Tuesday 11 AM Available/Blocked control
* course Add buttons
* course Remove buttons
* Review schedule button
* dialog Close button

Use native semantic controls whenever possible.

Do NOT create a custom global Tab-navigation system.

Do NOT manually assign positive tabindex values.

DOM order should provide the logical navigation sequence.

---

# Fix 4 — Keyboard Activation

When an interactive control is focused:

For button-like actions:

```text
Enter → activate
Space → activate
```

For links:

```text
Enter → activate
```

Prefer real:

```html
<button type="button">
```

for button actions.

If any existing element uses:

```html
<div role="button">
<span role="button">
```

replace it with native semantic markup where doing so is safe and does not change the visual design.

Only use custom key handlers when native HTML cannot implement the required interaction.

Do not duplicate native button activation behavior with unnecessary JavaScript.

---

# Preserve Existing Visual Design

The visual implementation is APPROVED.

Do not change:

* hero layout
* black/white palette
* timetable styling
* typography
* spacing system
* catalog layout
* remaining-requirements section
* final review section
* responsive composition
* glass treatment
* button visual styling
* copy unless required for accessibility

Any visual change must be the minimum required for keyboard accessibility.

---

# Hard Non-Goals

Do NOT:

* redesign anything;
* refactor unrelated components;
* implement WebMCP;
* implement backend;
* add dependencies unless absolutely unavoidable;
* change course data;
* alter application business behavior;
* change responsive layout;
* change Git/GitHub configuration;
* deploy;
* add AI;
* create a new accessibility framework;
* add global keyboard-navigation hacks;
* modify passing functionality simply for cleanup.

---

# Verification

After making the smallest necessary changes, run:

```text
npm run build
npm run lint
```

Both must pass.

Then perform **real browser keyboard verification**, not only static code inspection.

Start from a fresh page load and test:

## A. Skip Link

```text
reload page
press Tab
```

PASS only if the skip link receives focus and becomes visible.

Then:

```text
press Enter
```

PASS only if navigation/focus moves to main content correctly.

## B. Page Navigation

Using only:

```text
Tab
Shift + Tab
```

verify focus moves logically through all major interactive controls.

## C. Control Activation

For representative native button/toggle controls test both:

```text
Enter
Space
```

Confirm the actual state changes.

At minimum verify:

* max-credit button
* No 8 AM toggle
* Tuesday 11 AM control
* Add/Remove course
* Review schedule

## D. Dialog

Open Review schedule with keyboard.

Verify:

```text
Escape
→ closes dialog
```

Also verify the Close button remains keyboard operable.

After closing, verify focus returns to the Review schedule trigger or another logically correct element.

## E. Regression

Confirm with mouse that previously passing functionality still works.

Check browser console for application errors.

---

# Important Test-Harness Rule

If actual Chrome manual keyboard testing demonstrates that native Tab/Enter/Space behavior works correctly but an automated browser harness still reports failure:

**do not introduce nonstandard application code solely to accommodate the harness.**

Instead report:

```text
Application behavior verified manually in Chrome.
Automation-specific keyboard limitation remains.
```

Provide evidence about the relevant native elements and event handling.

We want standards-correct application behavior, not automation-specific hacks.

---

# Completion Criteria

This task passes only when:

```text
✓ Escape closes Review schedule
✓ Skip link receives first-page keyboard focus appropriately
✓ Tab advances through important controls
✓ Shift+Tab moves backward
✓ Enter operates applicable controls
✓ Space operates applicable button controls
✓ Dialog keyboard behavior works
✓ focus remains visibly indicated
✓ mouse behavior has not regressed
✓ responsive design has not changed
✓ npm run build passes
✓ npm run lint passes
✓ no new runtime errors
```

---

# Final Response

Return only:

```text
Root cause:
- ...

Files changed:
- ...

Fixed:
- Escape dialog: PASS/FAIL
- Skip link Tab focus: PASS/FAIL
- Tab navigation: PASS/FAIL
- Enter activation: PASS/FAIL
- Space activation: PASS/FAIL

Regression verification:
- Existing mouse interactions: PASS/FAIL
- Responsive layout: PASS/FAIL
- Console: PASS/FAIL
- npm run build: PASS/FAIL
- npm run lint: PASS/FAIL

Remaining issue:
- None
```

If any test still fails, report the exact evidence.

Do not declare success unless the keyboard behavior was actually exercised in the browser.
