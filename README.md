# Python Lab Compiler

An offline React workspace with the programs from the updated lab manual: 10 complete Python programs for the Deep Learning Lab (U23AL511). Each program carries its aim, a step-by-step algorithm, full source code and the recorded output.

Two interfaces share the same programs:

- **Compiler view** — a Programiz-style online compiler: dark editor, file tab, Visualize / Run toolbar and an output pane.
- **Notebook view** — a Google Colab-style notebook: menu bar, left tool rail, outline sidebar and Markdown, code and output cells. Always light-themed. The notebook starts with `!pip install tensorflow matplotlib -q` before the imports.

## Features

- 10 complete Python programs with aims, step-by-step algorithms and outputs.
- Working implementations: perceptron, ANN forward pass, MLP training, evaluation metrics, generative text and a healthcare case study.
- Editable code with line numbers and syntax highlighting.
- Programiz-style compiler with Output / Input / Algorithm panels.
- Google Colab-style notebook with an install cell ahead of the code.
- Dark and light themes in the compiler view; notebook view stays light.
- Adjustable editor font size, downloadable source files.
- Responsive down to phone widths.

Run locally:

```bash
npm install
npm run dev
```

`index.html` is Vite's dev entry only — open `standalone.html` for a double-clickable offline copy.

## Controls

| Action | How |
| --- | --- |
| Run the selected program | `Ctrl / ⌘ + Enter`, or the Run button |
| Open the question picker | Click the **programiz logo** or the **Colab logo** 5 times quickly (`Ctrl + Shift + E` also works) |
| Switch to the notebook | Click **PRO** 5 times quickly |
| Return to the compiler | Click the **G avatar** in the notebook header 5 times quickly |
| View the algorithm in the notebook | Double-click the **search** icon in the notebook rail |
| Close a dialog | `Esc` |

The question picker, view switch and algorithm view are intentionally not exposed in the interface.

## Builds

| Command | Output |
| --- | --- |
| `npm run build` | `dist/index.html` |
| `npm run standalone` | `standalone.html` |
| `npm run build:catalyst` | `client/index.html` |

Every build uses `vite-plugin-singlefile`, so the site is one self-contained HTML file with no asset paths to configure.

## Repository notes

- No credentials, personal names or private data are included.
- `node_modules/`, `dist/`, local env files and editor state are excluded via `.gitignore`.
- No network calls are made at runtime; all programs and outputs are local.
