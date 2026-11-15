# buugetschedule — Master Development Prompt V1.3

**Document status:** Approved product and development requirements baseline  
**Last consolidated:** 15 November 2026  
**Repository:** `Benya-pha/buugetschedule`  
**Default branch:** `main`

> This document is the source of truth for the approved product requirements. Later explicit user decisions override earlier conflicting wording. Do not add unapproved features or silently simplify detailed behavior.

---

## 1. Project overview

Build an independent, responsive university timetable website for Burapha University students. The website retrieves timetable data from REG BUU and displays it in a clean, readable, customizable interface.

The product includes:
- REG BUU Login and timetable synchronization
- Grid and List timetable views
- Theme Studio
- PNG and PDF export
- About and Changelog pages

The product is independent and is not an official Burapha University service.

### 1.1 Non-negotiable development principles

- Inspect the repository, framework, components, data flow, storage, and current behavior before making changes.
- Reuse and preserve existing working functionality.
- Do not assume a framework, API endpoint, response schema, course identifier, or authentication mechanism.
- Do not use mock data as a replacement for the real REG BUU integration.
- Do not remove features unless this specification explicitly requires it.
- Do not invent missing course data or silently treat incomplete data as an empty timetable.
- Implement in phases and test each phase before proceeding.
- When requirements conflict, use the latest explicit confirmed decision recorded in this document.

---

## 2. Navigation and application shell

### 2.1 Desktop and iPad

Use a persistent left sidebar. The sidebar includes:
- A compact, expanded Theme Studio section presented in a Bento-style layout.
- REG BUU Sync.
- About.
- Logout.

Do not add a Timetable category to the sidebar. Use the heading `THEME`; do not use the phrase “Theme Studio · Always Open”.

### 2.2 Mobile bottom navigation

Use a fixed Bottom Navigation with:
- Schedule
- Theme
- About
- Logout

Behavior and appearance:
- Icon above label.
- Active item uses the current Accent Color.
- Inactive items use gray.
- No selected-item background and no underline.
- Subtle top divider, translucent blur, and device safe-area support.
- No shadow.
- Remains visible and fixed on every page, including Theme Studio, About, and Changelog.
- Must not auto-hide while scrolling.
- Temporarily hide only while the on-screen keyboard is open (for example, while editing a HEX field); restore when the keyboard closes.

Mobile Sync is a separate action near the top of the Timetable page, not a Bottom Navigation item.

### 2.3 Logout

Logout is immediate and does not ask for confirmation. Clear authentication/session/connection state and return to Login. Theme settings persist across Logout and Login on the same device/browser.

---

## 3. REG BUU authentication and synchronization

### 3.1 Fresh website opening

Every fresh website opening requires REG BUU Login. Never store the user's REG BUU username or password.

After successful Login, synchronize the timetable before displaying the application pages.

### 3.2 Initial connection/loading

- Show a minimal white loading screen.
- Use the user-provided WanderingEyes React animation.
- Display `Connecting to REG BUU...`.
- Display `Waiting for connection · 15s`.
- If waiting exceeds 30 seconds, show `↻ Try again`.
- Retry restarts the animation and timer.
- On success, show a checkmark for approximately one second, then open Grid at the earliest course time.

### 3.3 Login failure

Show an Error page with guidance and a Try again action. Block access to application pages until authentication and required synchronization succeed.

### 3.4 Sync behavior and data integrity

Synchronization must:
- Add newly found courses.
- Remove courses confirmed deleted by a complete, valid REG BUU response.
- Overwrite changed course information.
- Not deduplicate or merge duplicate course records; display all duplicates returned by the source.
- Preserve available fields when some non-critical fields are missing; show `—` for missing values.
- Skip only the individual course with an invalid time and show a temporary notice.
- Automatically expand the timetable time range for valid courses outside the current range.

Before applying a response:
- Validate the response and its completeness.
- Do not interpret an incomplete or failed response as an empty timetable.
- Do not delete existing courses based on an incomplete response.
- Do not overwrite the last valid timetable until the new response has been fully validated.
- Inspect the REG BUU unique identifier for courses. Never assume course name is unique.

Exact sync messages:
- `Already up to date`
- `Sync Complete`

### 3.5 Sync triggers and navigation

Sync occurs:
- After successful Login.
- When the user explicitly requests Sync.
- When entering Timetable through a separately defined sync flow.

**Confirmed exception — About Back:** Pressing Back from About to Timetable returns immediately without triggering a new REG BUU Sync. Preserve the previous timetable state, including:
- Grid/List selection.
- Grid Orientation.
- Scroll position.
- Mobile zoom and scroll position where applicable.
- Timetable content and other applicable view state.

Do not reset to the earliest course time. Do not show a loading or sync screen.

This exception applies on desktop, tablet, and mobile.

### 3.6 Manual sync

- A successful manual Sync resets Grid to the earliest course time.
- Disable navigation, including About and Changelog, while syncing.
- Prevent export of partially synchronized data.
- A successful sync with zero valid courses shows `No courses found.`; this is an empty-state outcome, not a connection error.
- Theme Studio and Export remain accessible in the zero-course state, but do not generate a misleading empty timetable export. Handle the empty state explicitly.

### 3.7 Connection loss and recovery

- On connection loss, attempt reconnection a maximum of 3 times.
- Show `Reconnecting...` and `Attempt 1 of 3` (increment for each attempt).
- After all attempts fail, show an Error page with Try again.
- Try again restarts the three-attempt process.
- When connection returns, synchronize before displaying the application.
- Do not display an old timetable as if it were current.
- If the connection exists but fetching/synchronization fails, show Error rather than silently showing stale timetable data.

### 3.8 Session expiration

If the REG BUU session expires:
- Return to Login.
- Require re-authentication.
- Synchronize before returning to the application.

### 3.9 REG BUU unavailable notice

On About and Changelog, when REG BUU is unavailable after a prior successful Login:
- Show an Info icon and exact text: `REG BUU is currently unavailable.`
- Place it below the page header.
- Do not put it in a box or colored background.
- It disappears only after successful Login and connection.
- A page refresh alone does not clear it.
- Do not add polling.

---

## 4. Timetable Grid

### 4.1 Default and day/time layout

- Grid is the default view; List is the alternate.
- Display only days that contain courses. Do not add a Show All Days option.
- Week starts Monday by default; user may select Sunday.
- Time axis begins at the earliest course.
- Use real-time, time-proportional positioning with fixed slot height.
- Empty periods retain proportional whitespace; never collapse gaps.
- Do not add horizontal divider lines between time slots.
- Use the time axis, course-card positions, and whitespace to communicate time placement.
- Adjacent day columns/course cards have a small, consistent gap and must never visually touch.
- Show a NOW indicator at the actual current time.
- Highlight the current day with Ice Blue and a short underline.

### 4.2 Course card sizing and behavior

- Cards grow to fit their content.
- No maximum card height and no internal card scrolling.
- Each card has independent height; do not equalize peer cards.
- A card may extend below its time slot, but must not expand unrelated rows or areas.
- If expanded content overlaps another course's actual time, preserve the true time overlap; do not reposition the course to hide it.
- Clicking a course card itself does nothing.

### 4.3 Time range

Valid courses outside the displayed time range automatically expand the grid to include them.

### 4.4 Sticky behavior

Grid uses Sticky axes; List does not.

For orientation A — Days Left · Time Top:
- Day headers stick to the left.
- Time axis sticks to the top.

For orientation B — Days Top · Time Left:
- Day headers stick to the top.
- Time axis sticks to the left.

Sticky backgrounds:
- Opaque.
- Match Timetable Background.
- Update live when the theme changes.
- No shadow.

### 4.5 Grid orientation

Provide two selectable cards with a preview and short explanation:
- A: Days Left · Time Top (default).
- B: Days Top · Time Left.

Persistence and switching:
- Orientation is session-only.
- A fresh website opening defaults to A.
- Switching Grid → List → Grid during the same session preserves the last selected orientation.
- Desktop/iPad orientation switching preserves the current timetable content and scroll position as closely as possible.
- Mobile orientation switching resets zoom and scroll to the top-left.
- Sticky axes update to match the selected orientation.

### 4.6 Grid/List switching and restoration

- Grid → List opens List at the top.
- List → Grid restores the previous Grid scroll position on desktop/tablet.
- List → Grid on mobile resets zoom and returns to the top-left.
- Switching views closes any open overlap dropdown and expanded List details.
- Timetable data remains unchanged.

### 4.7 Reset points

- Fresh successful Login opens Grid at earliest course time.
- Successful manual Sync resets Grid to earliest course time.
- Returning from About via Back does not reset position or trigger Sync.

---

## 5. Mobile Grid

### 5.1 Scrolling and dimensions

- Support both horizontal and vertical scrolling.
- Users can swipe/drag directly on the timetable.
- Do not create separate nested scroll areas for timetable axes/content.
- Do not compress the timetable to fit the screen.
- Day columns have fixed equal widths.
- Default horizontal layout is Balanced; allow horizontal scrolling when needed.
- Time slots remain fixed and time-proportional.
- No horizontal time-divider lines.

### 5.2 Pinch-to-zoom

- Support pinch-to-zoom.
- Support Touch Point Zoom: the content under the midpoint between two fingers should remain near that screen location while zooming.
- Do not expose arbitrary user-facing minimum/maximum zoom limits; technical safeguards are allowed.
- Course cards, grid, and day columns scale together.
- Sticky headers, time labels, and Bottom Navigation remain at their original size.

### 5.3 Reset Zoom

Provide both:
- Double-tap reset.
- A visible floating Reset Zoom button at the bottom-right inside the timetable.

Both reset to default zoom and top-left position. The floating button must not overlap the Bottom Navigation or course cards.

### 5.4 Device rotation

On device rotation:
- Recalculate layout.
- Reset zoom and scroll to top-left.
- Preserve selected Grid Orientation.
- Update sticky axes.
- Do not reload the website.

### 5.5 Mobile weekday labels

Use one-letter English weekdays in Grid: `M / T / W / T / F`.

### 5.6 Mobile card sizing

Cards grow to fit content. Do not truncate course information.

---

## 6. Overlapping courses

### 6.1 Main card and overlap indicator

Show the main course card with a `+1`, `+2`, etc. overlap indicator when other courses overlap.

### 6.2 Desktop/tablet overlap dropdown

- Dropdown appears below the course card; flip above when there is insufficient space.
- Reposition near viewport edges so it is never clipped.
- Do not push or reflow timetable layout.
- Show the same full details and settings as the main course card.
- Sort by start time ascending; for equal start times preserve REG BUU source order.
- Use a maximum height with internal scrolling.
- Only one dropdown can be open at a time.
- Clicking the same indicator toggles it closed.
- Close on outside click, Escape, start of scrolling, or view switch.

### 6.3 Mobile overlap Bottom Sheet

- Open a Bottom Sheet from the bottom.
- Show full course details.
- Provide an × close control.
- Close on backdrop tap or swipe down.
- Dim the backdrop.
- Lock background scrolling.
- Only the sheet itself scrolls.
- Restore background scrolling when closed.

---

## 7. Course card information and display modes

### 7.1 Card Information settings

Provide checkboxes for:
- Course Name
- Time
- Course Code
- Section
- Room
- Instructor

Unchecked fields are omitted in applicable display modes. All card text is left-aligned. Missing non-critical values display as `—`. Time format: `09:00–11:50`.

### 7.2 Full Detail mode

- Course name first.
- Instructor appears once under the course name.
- Each session is a separate group.
- Each group shows time and Section, then Room/ONLINE below.
- Pair the correct values for each session and preserve source order.
- Icons are used only in Full Detail (room/online/instructor).
- Missing Section shows `—`.
- Missing room/online shows `—` with the room icon.
- Missing instructor shows `—` with the instructor icon.
- For multiple instructors, show first names only (no titles or surnames), comma-separated, deduplicated while preserving first occurrence.
- Long names shrink slightly, then wrap; never use ellipsis.
- Use very light-gray dividers between sessions and compact spacing.

### 7.3 Medium mode

- Line 1: course name.
- Line 2: time plus Course Code/Section according to Card Information settings.
- Line 3: Room/ONLINE.
- No instructor and no icons.
- For multiple sessions, show each group as time+Section, then Room/ONLINE below; preserve correct pairing and source order.
- Do not show weekday.
- Missing Section or room shows `—`.
- No dividers; use slight vertical spacing.

### 7.4 Compact mode

- Show course name, time, and Room/ONLINE for each session.
- Do not show Course Code, Section, or Instructor.
- Show all sessions.
- For multiple days, show a three-letter English weekday on each line.
- If there are multiple sessions on the same day, repeat the weekday on each line.
- Missing day/room shows `—`.
- Use the tightest spacing.
- Preserve source order.

### 7.5 Long course names

Long names shrink slightly and then wrap/grow. Never truncate with ellipsis.

### 7.6 Display mode switching

Switch immediately, with no save action and no animation. Typography font size is shared across modes.

---

## 8. List view

- Use one continuous chronological list.
- Do not create separate day-group cards, containers, or day headings.
- Show day abbreviation beside time; mobile uses three-letter English day abbreviations.
- Show a dot beside the course name.
- Sort by day, then start time ascending; ties preserve source order.
- Desktop shows time on the same line as the title.
- Mobile may show start and end times separately.
- Show a current-day marker above rows in the format `TODAY · FRI`.
- No sticky elements.
- Expanded details appear inline below the row and contain only additional information.
- The row grows to fit expanded content.
- Only one row can be expanded at a time.
- Clicking the same row toggles it closed.
- No close button.
- Use a subtle, quick animation.
- Auto-scroll only enough to reveal expanded details.
- Do not auto-scroll to the current day.

---

## 9. Theme Studio

### 9.1 Scope and structure

Theme Studio customizes the timetable only, not the entire application shell.

- One scrollable page.
- Minimal Bento-style layout.
- No subpages.
- Sidebar remains persistent and expanded in a compact form.
- Exactly seven sections:
  1. Colors
  2. Card Information
  3. Typography
  4. Timetable Display
  5. Card Style
  6. Background
  7. Spacing & Layout

Do not add a Custom theme, theme collections, Save/Create Theme controls, theme gallery, or premium themes.

### 9.2 Colors

Provide Color Picker and HEX input for:
- Timetable Background
- Course Card Base
- Primary Text
- Secondary Text
- Accent Color
- Core background and text
- Major background and text
- Elective background and text
- General Education background and text

Changes apply live. Provide an individual reset for each category.

### 9.3 Typography

- Use Prompt throughout the website.
- Default font size: Balanced.
- Slider range: 10–24px.
- Applies only to course-card text, not day labels or time axis.
- One shared font size across all card modes.
- No separate typography reset.

### 9.4 Timetable Display

- Week start: Monday or Sunday.
- Grid Orientation: A/B cards with preview and explanation.
- Default orientation A.
- Orientation session-only as defined in Section 4.5.

### 9.5 Card Style

Only Corner Radius slider. Do not add Shadow or Border Width controls.

### 9.6 Background

Options:
- Solid Color
- Pattern
- Upload Image

### 9.7 Spacing & Layout

Only Card Padding slider. Do not add Card Gap.

### 9.8 Persistence

- Persist Theme settings in local browser storage across browser closure and Logout/Login on the same device/browser.
- Changes apply immediately.
- Do not persist Grid Orientation across fresh website openings.
- Scroll state and zoom follow the view-specific rules elsewhere in this document.

### 9.9 Reset Theme

Show a confirmation with Cancel and Reset. Reset all theme settings to defaults, clear any uploaded image, and save immediately.

### 9.10 Presets

Exactly four presets. Selecting a preset overwrites all theme settings and saves immediately.

#### Preset 1 — Classic Monochrome

| Token | HEX |
|---|---|
| Timetable Background | `#F4F4F5` |
| Course Card Base | `#FFFFFF` |
| Primary Text | `#202124` |
| Secondary Text | `#6B7280` |
| Accent Color | `#42464D` |
| Core | `#A9C4E2` |
| Major | `#A9CDB3` |
| Elective | `#E5C29D` |
| General Education | `#C5B3DD` |
| All category text | `#202124` |

#### Preset 2 — Pastel Matcha & Rose

| Token | HEX |
|---|---|
| Timetable Background | `#F7F6F2` |
| Course Card Base | `#FFFEFC` |
| Primary Text | `#3D403C` |
| Secondary Text | `#898C84` |
| Accent Color | `#87977A` |
| Core | `#AEBE9C` |
| Major | `#E8C2C8` |
| Elective | `#E4C49F` |
| General Education | `#BFD5E8` |
| All category text | `#343B35` |

#### Preset 3 — Chrome BUU Gold & Gray

| Token | HEX |
|---|---|
| Timetable Background | `#F2F2F0` |
| Course Card Base | `#F8F8F6` |
| Primary Text | `#42464B` |
| Secondary Text | `#777B80` |
| Accent Color | `#E5BD45` |
| Core | `#E5BD45` |
| Major | `#B4B7BA` |
| Elective | `#D9DADB` |
| General Education | `#E2E2DF` |
| Core text | `#303236` |
| Major/Elective/General Education text | `#42464B` |

#### Preset 4 — Mint & Cocoa

| Token | HEX |
|---|---|
| Timetable Background | `#F5F0E9` |
| Course Card Base | `#FFFEFA` |
| Primary Text | `#493D38` |
| Secondary Text | `#A3978D` |
| Accent Color | `#B8D5C5` |
| Core | `#8FCFC5` |
| Major | `#A98268` |
| Elective | `#E8AEBB` |
| General Education | `#F0D98C` |
| All category text | `#2B211C` |

---

## 10. Export

### 10.1 Formats and aspect ratios

Support PNG and PDF export.

Aspect ratios:
- 1:1
- 4:3
- 16:9
- 9:16

Adapt layout without distortion. The output must remain a timetable, not become a poster.

### 10.2 Export content

Use:
- Current theme.
- Current display mode.
- Current Card Information settings.
- Latest successfully synchronized timetable.

Never export partially synchronized data. Prevent clipping.

### 10.3 Academic year and semester

- Select academic year, then semester.
- Show academic year above semester.
- Only show years that contain data, newest first.
- Use exact semester labels returned by REG BUU.
- Defaults come from REG BUU but remain editable.

### 10.4 PNG quality

Offer Standard, High, and Ultra.

### 10.5 PDF

- One page.
- High quality.
- Thai text must render correctly.

### 10.6 Filename and completion

Filename pattern:
`buugetschedule-schedule-[term]-[year].png`
or
`buugetschedule-schedule-[term]-[year].pdf`

If a filename already exists, append `(2)`, `(3)`, etc.

On success, show a toast and Open File action. On failure, explain the cause and how to fix it. Do not remember export settings.

### 10.7 Empty timetable

Do not generate a misleading empty timetable file. Handle the empty state explicitly.

---

## 11. About page

### 11.1 Navigation and header

About replaces the main content area; desktop sidebar remains.

Header:
- `← Back`
- Title: `About`
- Subtitle: `About buugetschedule and its developer.`

Back behavior is defined in Section 3.5: immediate return to Timetable, no Sync, preserve the previous view and scroll/zoom state, and no loading screen.

### 11.2 Content groups

Two major groups:
1. About the project
2. Developer & Information

Project description:
`buugetschedule retrieves timetable data from REG BUU and displays it in a customizable format.`

Bold purpose statement:
`Designed to make your university schedule easier to view and personalize.`

### 11.3 Version and updates

- Display Version and Last Updated in two columns, including on mobile.
- Last Updated: `14 Nov 2026`.
- What's New: maximum 3 bullets.
- Use a plain `View changelog` link.

### 11.4 Developer links

Display Developer, Portfolio, and GitHub as separate rows:
- Outline icons.
- External-link indicator aligned at the far right.
- Portfolio and GitHub open in a new tab.
- Contact uses a mailto link.
- Do not invent URLs or email addresses.

### 11.5 Privacy and disclaimer

Privacy:
- REG BUU credentials are used only for authentication.
- Timetable data is fetched from REG BUU when Sync occurs.

Disclaimer:
- Independent project; not an official BUU service.
- Data comes from REG BUU.
- Users should verify important information through official channels.
- Include an Info icon.

### 11.6 Visual hierarchy and responsive behavior

- Group headings are larger than individual section headings.
- Section headings use Medium Semibold and Primary Text color.
- No divider between individual sections.
- Use a very light-gray divider only between major groups.
- Moderate spacing.
- Constrain long text; short text may use full width.
- Stack content on mobile.

---

## 12. Changelog

- Use a timeline layout.
- Dot aligns with version.
- Newest version first.
- Only one entry expanded at a time.
- Latest entry expanded by default.
- Added/Improved/Fixed are plain neutral text; no badges and no background.
- About → Changelog replaces the main area immediately, without animation.
- Back returns to About at the exact previous scroll position.
- Refresh while on Changelog stays on Changelog.
- Show the REG BUU unavailable notice below the header when applicable, as defined in Section 3.9.

---

## 13. Responsive behavior

### Desktop and iPad
- Persistent left sidebar.
- Grid/List/Export controls should fit on one row on iPad without crowding.
- Preserve desktop/tablet Grid scroll when switching views and orientation as specified.

### Mobile
- Fixed Bottom Navigation with keyboard behavior defined in Section 2.2.
- Grid weekday labels use one-letter English abbreviations.
- List uses three-letter English day abbreviations.
- Grid supports two-axis scrolling, pinch-to-zoom, and Touch Point Zoom.
- List start/end time may be split across lines.
- About content stacks.
- Device rotation resets Grid zoom/position but retains orientation.
- Bottom Navigation remains fixed except while keyboard is open.

### Supported browsers
- Chrome
- Edge
- Firefox
- Safari
- iPhone/iPad Safari and Chrome
- Android Chrome

---

## 14. Technical, data, and accessibility constraints

### 14.1 Inspect before implementing

Before coding, inspect:
- Repository structure and framework.
- Existing components and styling conventions.
- Authentication and REG BUU data flow.
- Current data model and source identifiers.
- Existing persistence mechanisms.
- Current navigation and state management.
- Build/test scripts.

Do not replace working functionality with a new implementation without a demonstrated need.

### 14.2 Persistence boundaries

Keep persistence concerns separate:
- REG BUU credentials: never persist.
- Timetable: retain latest valid synchronized data; never overwrite with incomplete response.
- Theme: persist in local browser storage across closure and Logout/Login on the same browser/device.
- Export settings: do not remember.
- Grid Orientation: session-only; reset to A on a fresh website opening.
- Scroll/zoom: preserve or reset only according to the explicit view/device rules above.

### 14.3 Accessibility

- Provide accessible labels.
- Support keyboard focus and keyboard navigation.
- Maintain readable color contrast.
- Use usable touch targets.
- Do not rely on hover-only actions.
- Respect mobile safe areas.

### 14.4 Error states

Handle these separately and clearly:
- Authentication Failed
- Connection Lost
- Reconnection Failed
- Fetch Failed
- Incomplete Response
- Invalid Course
- Export Failed
- Storage Failure

Do not collapse distinct failure states into a generic empty state.

---

## 15. Implementation phases

Implement in this order, validating each phase before proceeding:

1. Authentication and REG BUU connection.
2. Data model, validation, and synchronization.
3. Grid and List views.
4. Responsive behavior and mobile interactions.
5. Theme Studio.
6. PNG/PDF Export.
7. About and Changelog.
8. Full QA and regression testing.

The sequence is a planning baseline; inspect dependencies in the actual codebase and document any necessary adjustment before changing the order.

---

## 16. Acceptance and regression checklist

Use this checklist during implementation. A requirement is not complete merely because it looks correct in one screenshot; verify its interaction and relevant edge cases.

### Authentication and synchronization
- [ ] Fresh opening requires Login and does not expose app pages before successful sync.
- [ ] Credentials are never stored.
- [ ] Loading labels, timeout, retry, and success transition follow Section 3.2.
- [ ] Failed authentication blocks app access.
- [ ] Sync adds, updates, and removes only based on a complete validated response.
- [ ] Duplicate source records remain visible.
- [ ] Incomplete/failing responses never erase or replace the last valid timetable.
- [ ] Invalid-time course is skipped individually with notice.
- [ ] Valid out-of-range courses expand the time range.
- [ ] Manual Sync success resets Grid to earliest course time.
- [ ] Zero valid courses displays the explicit empty state.
- [ ] Reconnection is limited to three attempts and recovery syncs before app display.
- [ ] Session expiration requires re-authentication and sync.
- [ ] About Back never triggers Sync and restores previous timetable state.

### Navigation and views
- [ ] Desktop/iPad sidebar and mobile Bottom Navigation match the specification.
- [ ] Bottom Navigation remains fixed during scroll and hides only while keyboard is open.
- [ ] Grid is default; List is alternate.
- [ ] Grid/List switching preserves or resets scroll exactly as specified by device.
- [ ] Switching views closes overlap dropdown and expanded List details.
- [ ] Orientation defaults to A on fresh opening and persists only for the session.
- [ ] About and Changelog navigation/back behavior preserves the required state.

### Grid and mobile
- [ ] Time positions are proportional; empty time gaps remain visible.
- [ ] No horizontal time-slot divider lines.
- [ ] Adjacent cards/columns have consistent gaps.
- [ ] Cards grow without truncation or internal scrolling.
- [ ] Sticky axes match both orientations and update with theme.
- [ ] Overlap dropdown/sheet behavior works at viewport edges and on mobile.
- [ ] Mobile supports two-axis scrolling and pinch zoom.
- [ ] Touch Point Zoom keeps the pinch midpoint anchored.
- [ ] Reset Zoom controls return to default zoom and top-left.
- [ ] Rotation recalculates layout and resets zoom/position without reload.

### Course information and List
- [ ] Card Information checkboxes control applicable fields.
- [ ] Full Detail, Medium, and Compact modes follow their distinct field/icon/session rules.
- [ ] Multiple sessions remain paired correctly and preserve source order.
- [ ] Missing fields display the specified placeholder.
- [ ] Multiple instructors are formatted and deduplicated correctly.
- [ ] List is continuous, chronological, and has no day-group containers.
- [ ] List expansion is inline, single-open, and auto-scrolls only enough to reveal details.

### Theme Studio
- [ ] Exactly seven sections are present.
- [ ] Color controls and HEX inputs update live.
- [ ] All four presets match the exact values in Section 9.10.
- [ ] Preset selection overwrites and persists all theme settings.
- [ ] Reset Theme confirmation resets all settings and clears uploaded image.
- [ ] Theme persists across browser closure and Logout/Login.
- [ ] Typography, Card Style, Background, and Spacing controls expose only the specified options.
- [ ] No unapproved theme gallery/custom-theme features are present.

### Export
- [ ] PNG and PDF export support all four aspect ratios without distortion.
- [ ] Export uses current theme, display mode, Card Information, and latest valid timetable.
- [ ] Export cannot run against partial sync data.
- [ ] Academic year/semester options reflect REG BUU data and exact labels.
- [ ] PNG quality options work.
- [ ] PDF is one page and Thai text renders correctly.
- [ ] Filename pattern and collision suffix work.
- [ ] Success toast/Open File and actionable failure messages work.
- [ ] Empty timetable does not produce a misleading file.

### About, Changelog, and quality
- [ ] About content, exact copy, links, privacy, and disclaimer follow Section 11.
- [ ] No developer URL/email is fabricated.
- [ ] Changelog timeline, expansion, and Back/refresh behavior follow Section 12.
- [ ] REG BUU unavailable notice follows exact text and clearing rules.
- [ ] Supported browsers and responsive breakpoints are tested.
- [ ] Accessibility labels, focus, keyboard use, contrast, touch targets, and safe areas are checked.
- [ ] Error states are independently testable.
- [ ] Regression tests confirm existing working functionality remains intact.

---

## 17. Change control

- This document is the approved baseline for implementation.
- Do not silently reinterpret or omit confirmed behavior.
- If implementation discovers a technical limitation or conflict, explain the impact and propose a specific resolution before changing the product requirement.
- Keep this document updated when the user explicitly approves a requirement change.
- Distinguish product requirements from implementation choices; implementation choices must be based on repository inspection and actual REG BUU behavior.
