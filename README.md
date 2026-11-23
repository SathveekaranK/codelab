# codeLab — All-in-one Computer Networks Compiler

A static, compiler-style React app for Computer Networks lab (U23AL504) preparation. It looks and behaves like a normal online compiler — language selector, file tabs, editor, console, theme toggle, Run controls — but it is a **simulator**: there is no backend and no real code execution. Programs, outputs and algorithms are preloaded from the lab manual.

No visible example list: the main screen is just a basic compiler with one program loaded. The editor and output panels can be resized by dragging the divider, double-clicked to reset, or switched between stacked and side-by-side layouts using the **↔ Side** / **↕ Stack** buttons.

**Repo:** <https://github.com/SathveekaranK/codelab>

---

## Features

- Compiler-style dark UI with light theme toggle (dark is default).
- Horizontal (side-by-side) editor/output by default on desktop; auto-stacks vertically on phones.
- Hidden experiment picker — loads any of the 10 experiments instantly.
- Multiple source files shown as real file tabs (`Client.java` / `Server.java`, `tcp.tcl` / `udp.tcl`, …).
- Editable code with line numbers and lightweight syntax highlighting.
- **Run** (`Ctrl/Cmd + Enter`) replays the recorded output from the manual and restores the original, clean code first.
- Double-click the `v2.4.1` chip to open a read-only, code-styled `algorithm.txt` viewer with the run command and dependencies (JDK, NS-2/NAM, Wireshark, input files, etc.).
- Docs page with project info and usage guide.
- Fully responsive on mobile.

---

## Hidden experiment selector

Use any of these triggers (they are intentionally not advertised in the UI):

| Trigger | Action |
| --- | --- |
| `Ctrl + Shift + E` | Open the example picker |
| `Alt + L` | Open the example picker |
| `standalone.html#lab` | Open the picker on load |
| Click the logo 5 times quickly | Open the picker |

The picker looks like a normal "Open example" dialog. Search matches the **experiment number** (`10`, `exp 3`, `question 7`, `#2`) or words from the **question text**, and each result shows the full question.

---

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually <http://localhost:5173>).

> The root `index.html` is only Vite's dev entry. Opening it by double-clicking shows a blank page because JSX needs Vite. Use `npm run dev`, `standalone.html`, or a built `client/index.html`.

---

## Build scripts

| Command | Output | Use |
| --- | --- | --- |
| `npm run build` | `dist/index.html` | Plain static build (self-contained, single file) |
| `npm run standalone` | `standalone.html` | Double-clickable offline copy |
| `npm run build:catalyst` | `client/index.html` | Catalyst-ready deploy copy |

All builds use `vite-plugin-singlefile`, so React and CSS are inlined into one HTML file — no asset paths to configure.

---

## Deploy to Zoho Catalyst

The repo is already shaped for Catalyst:

```text
codelab/
├── catalyst.json          # points Catalyst CLI at the client folder
├── client/
│   ├── index.html         # committed build output (the whole site)
│   └── client-package.json
├── src/                   # React source
├── standalone.html        # offline copy
└── package.json
```

### Option A — Web Client Hosting (direct upload, easiest)

1. Run `npm run build:catalyst`.
2. Compress the **contents** of the `client/` folder into a zip (`index.html` and `client-package.json` must be at the zip root — not inside a `client` folder).
3. In the Catalyst console, create/select your project → **Web Client Hosting** → **Upload** that zip.
4. Publish the client. Your `index.html` is the homepage.

> `catalyst.json` is not needed for direct console upload; it is included for CLI deploys.

### Option B — Catalyst CLI

1. Install the CLI: `npm i -g zoho-catalyst-cli` (or `catalyst`).
2. `catalyst login` and select your project/organization.
3. Run `npm run build:catalyst` so `client/index.html` is current.
4. From this repo root run `catalyst deploy` (or `catalyst deploy --only client`).
5. The CLI reads `catalyst.json` (`"client": { "source": "client" }`) and deploys the `client/` directory.

---

## Deploy to GitHub Pages

1. Push to `main` on <https://github.com/SathveekaranK/codelab>.
2. Repo **Settings → Pages → Build and deployment**:
   - Source: **GitHub Actions**, or
   - Source: **Deploy from a branch** → `main` / `/ (root)` and set the published site to `standalone.html`.
3. A minimal Actions workflow can run `npm ci && npm run build`, then publish `dist/` with `actions/upload-pages-artifact` + `actions/deploy-pages`.

`base: './'` in `vite.config.js` means relative asset paths work at any host path.

---

## Project structure

```text
src/
├── App.jsx          # main compiler UI, hidden picker, splitters, modals
├── DocsPage.jsx     # docs page
├── data.js          # experiments, algorithms, requirements, comment stripping
├── highlight.js     # syntax colors
└── styles.css       # themes + responsive layout
```

## Notes

- Program code was tidied where the PDF had broken lines/OCR glitches; logic and sample outputs were kept.
- Comments are stripped from the displayed code so it reads like plain lab code rather than annotated notes.
- Run is intentionally a local simulation — it shows the recorded output rather than executing edited code.
