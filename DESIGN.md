# DESIGN.md — CRT / EGA Design System

This portfolio is dressed up as an IBM PC running an MS-DOS-era text-mode application (think Norton Commander, `edit.com`, the DOS Shell). The system is built on Tailwind v4 + shadcn/ui, with effects layered on top via plain CSS keyframes — no extra JS animation libraries.

---

## 1. Aesthetic philosophy

| We are emulating                                   | We are **not** emulating                      |
| -------------------------------------------------- | --------------------------------------------- |
| IBM 5150 / Norton Commander 4 / Turbo Pascal IDE   | Modern minimalism, glassmorphism, neumorphism |
| Sharp 1-2 px chunky bevels (Win 3.1 / OS/2 chrome) | Soft rounded corners, drop shadows            |
| Phosphor glow + scanlines on a curved CRT face     | Flat material design                          |
| Box-drawing typography (`╔═╗ ║ ║ ╚═╝`)             | Decorative icons                              |
| Norwegian content rendered as terminal output      | Marketing-page voice                          |

The user picked **full immersion + deep terminal metaphor**: sections are introduced by `C:\NIKOLAI> command` prompts, lists render as `dir` listings, and dialogs render as modal DOS windows.

---

## 2. Color tokens

The palette is the 16-color **IBM PC EGA** set. Tokens are defined as CSS variables in [src/app/globals.css](src/app/globals.css).

| Semantic name                 | Hex       | Used for                                                                          |
| ----------------------------- | --------- | --------------------------------------------------------------------------------- |
| `--background` (blue)         | `#0000aa` | Default page background (the "desktop")                                           |
| `--foreground` (white)        | `#ffffff` | Default text on the desktop                                                       |
| `--accent-yellow`             | `#ffff55` | Headings, prompt paths, highlighted/selected items, primary buttons in title bars |
| `--accent-cyan`               | `#55ffff` | Links, secondary headings, success affirmations                                   |
| `--accent-magenta`            | `#ff55ff` | Special accents, rarely used (saved for "wow")                                    |
| `--accent-green`              | `#55ff55` | Success states, boot sequence text                                                |
| `--accent-red`                | `#ff5555` | Destructive actions, errors                                                       |
| `--dim` (bright blue)         | `#5555ff` | De-emphasized text on blue background                                             |
| `--window` (light grey)       | `#aaaaaa` | DOS dialog window body                                                            |
| `--window-foreground` (black) | `#000000` | Text inside grey windows                                                          |
| `--shadow` (black)            | `#000000` | Drop-shadows, deep recess in bevels                                               |

shadcn semantic tokens (`--primary`, `--secondary`, `--card`, etc.) are aliased to these so the installed `button`, `dialog`, `tabs`, etc. components inherit the palette automatically.

**Contrast rule:** Yellow/cyan/green/red text MUST sit on a black or blue background. Grey-window backgrounds use black text. Never put white text on grey — it disappears.

---

## 3. Typography

| Font              | Variable               | Used for                                                                                  |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| **VT323**         | `--font-vt323`         | Everything visible — body, headings, buttons, inputs. Coarse VT220-style monospace.       |
| **IBM Plex Mono** | `--font-ibm-plex-mono` | Available as `font-fine` for cases where VT323 is too chunky (e.g. very long paragraphs). |

- Base body size is **20px** (VT323 is small at default 16px).
- Headings are **UPPERCASE**, letter-spacing `0.04em`.
- No system sans-serif anywhere.
- Tabular figures (`tabular-nums`) on numeric output (file sizes, timestamps, clock).

---

## 4. Layout primitives

All under [src/app/components/crt/](src/app/components/crt/).

### `TerminalWindow`

DOS dialog chrome with a yellow title bar (`▓▒░ TITLE ░▒▓`), beveled grey body, optional status-bar footer, and decorative `[_] [■] [X]` buttons. Two `variant`s:

- `window` (default): grey body + black text — used for dialogs, info panels, the profile photo card.
- `screen`: blue body + white text — used when the window is acting like an embedded "console" (e.g. the admin control panel).

```tsx
<TerminalWindow title="PROFILE.BMP" buttons={["min", "max", "close"]}>
  ...
</TerminalWindow>
```

### `Prompt`

Renders `C:\PATH> command` with optional blinking cursor.

```tsx
<Prompt path="C:\NIKOLAI" command="dir TIMELINE\ /S" />
```

### `MenuBar`

Sticky top bar with `File / Edit / View / Goto / Help` dropdowns. The mode toggle (`CRT` ↔ `Accessible`) lives under `View`. External links live under `Goto`.

### `StatusBar`

Sticky bottom bar with fake `F1=Help F2=GitHub ...` shortcut hints and a live clock.

### `BootSequence`

Skippable fake POST + boot screen, shown only once per browser session (gated on `sessionStorage`). Press any key or click to skip.

### `CRTOverlay`

Mounted globally in [layout.tsx](src/app/layout.tsx). Five stacked fixed-position layers: scanlines, moving scan beam, vignette, bezel shadow, micro-flicker. Hidden entirely when `html.accessible`.

---

## 5. CRT effects

All effects are pure CSS, gated on the `crt` ↔ `accessible` class set by [ThemeProvider](src/app/components/ThemeProvider.tsx).

| Effect             | Where applied                                 | Disabled in `accessible` |
| ------------------ | --------------------------------------------- | ------------------------ |
| Scanlines          | Global overlay, multiply blend                | yes                      |
| Moving scan beam   | Global overlay, 7s loop                       | yes                      |
| Vignette           | Global overlay, radial mask                   | yes                      |
| Bezel inset shadow | Global overlay, rounded inner glow            | yes                      |
| Micro flicker      | Global overlay (0.18s opacity wobble)         | yes                      |
| Phosphor glow      | `.crt-glow` / `.crt-glow-strong` text-shadows | yes                      |
| Blinking cursor    | `.crt-cursor` span                            | no (purely informative)  |

**`accessible` mode** keeps the EGA palette, monospace font, and sharp bevels. It removes everything that animates or muddies the text. Auto-enabled when `prefers-reduced-motion: reduce` is set.

---

## 6. Voice & content

Site copy is reframed as terminal commands and their output.

- Section headers are `Prompt` components: `C:\NIKOLAI> ./projects.exe --list`.
- Body content goes into `<pre>` blocks or `TerminalWindow` bodies, preserving whitespace.
- Norwegian copy stays **Norwegian** — only the framing is English/DOS conventions.
- Mock filenames use 8.3 form: `ABOUT.TXT`, `PROFILE.BMP`, `LOGIN.EXE`.
- Don't be cute: keep prompts short and idiomatic to DOS (`dir`, `type`, `cd`, `./name.exe`).

---

## 7. Box-drawing reference

| Char      | Use                                                              |
| --------- | ---------------------------------------------------------------- |
| `▓ ▒ ░`   | Title-bar fill (`▓▒░ TITLE ░▒▓`)                                 |
| `├ └ │ ─` | Dir tree connectors in `Timeline`                                |
| `┌ ┐ ┘ └` | Available for ASCII window borders (rare — bevels are preferred) |
| `█`       | Heavy block — use sparingly, as a chunky cursor or marker        |

Prefer real Unicode box-drawing characters over images.

---

## 8. shadcn component conventions

The installed shadcn components have global overrides in [globals.css](src/app/globals.css) (under `@layer base` and the `[data-slot="..."]` selectors). They will look "DOS" out of the box; you do **not** need to pass custom classNames for the aesthetic.

Variants to remember:

- `<Button>` — `default` (chunky outset grey), `outline` (1px current-color border), `destructive` (red), `link` (cyan underline).
- `<Dialog>` — wrap in [src/app/admin/Dialog.tsx](src/app/admin/Dialog.tsx) which adds the yellow title bar.
- `<DropdownMenu>` — used inside `MenuBar`; inherits DOS look.
- `<Input>` / `<Textarea>` — auto-render as black background + yellow text + 1px white border. Looks like a DOS edit field.
- `<Badge>` — cyan-on-black pill (no radius). Used for `Project.technologies` and `TimelineItem.tags`.

When adding new shadcn components, run `npx shadcn@latest add <name>` and verify the result picks up the global overrides. If not, add a new selector block in [globals.css](src/app/globals.css).

---

## 9. Accessibility mode contract

When `html.accessible` is set:

1. All `.crt-overlay` layers are `display: none`.
2. `.crt-glow` and `.crt-glow-strong` lose their `text-shadow`.
3. The blinking cursor and flicker stop being visually active.
4. Everything else (palette, font, bevels, content framing) is unchanged.

This means screen readers and users with motion sensitivity get the same content with the visual noise stripped. Auto-applied when the OS reports `prefers-reduced-motion: reduce`. Persisted to `localStorage` under `display-mode` once the user explicitly chooses.

---

## 10. Don't / do

- **Don't** add rounded corners. Anywhere. The `--radius` token is `0`.
- **Don't** introduce new colors outside the EGA palette.
- **Don't** add icons outside `lucide-react` for utility purposes — text labels are preferred. (lucide can be used inside admin shortcuts.)
- **Do** use `crt-glow` on white/yellow/cyan text that sits on the blue desktop.
- **Do** wrap content in `TerminalWindow` whenever it represents a discrete "document" (a project card, a profile card, an admin form).
- **Do** prefer real box-drawing chars over CSS borders for tree connectors.
