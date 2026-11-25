export default function DocsPage({ onOpenCompiler }) {
  return (
    <div className="docs-scroll">
      <div className="docs-wrap">
        <div className="docs-top">
          <div className="docs-brand"><span>◢</span> python lab</div>
          <button onClick={onOpenCompiler}>← Back to compiler</button>
        </div>

        <header className="docs-hero">
          <h1>Python Lab Compiler</h1>
          <p>
            A self-contained practice workspace built from the updated lab manual: short,
            clean programs with their aims, algorithms and expected output — available in
            two familiar interfaces.
          </p>
          <div className="docs-chip-row">
            <span className="docs-chip">10 programs</span>
            <span className="docs-chip">Python</span>
            <span className="docs-chip">U23AL511</span>
            <span className="docs-chip">Offline ready</span>
          </div>
          <button className="docs-primary" onClick={onOpenCompiler}>Open compiler →</button>
        </header>

        <section className="docs-section">
          <h2>Two views, one workspace</h2>
          <table className="docs-table">
            <thead>
              <tr><th>View</th><th>Looks and feels like</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><td>Compiler</td><td>Programiz online compiler</td><td>Quick edit → run → read output</td></tr>
              <tr><td>Notebook</td><td>Google Colab notebook</td><td>Install cell, then code and output</td></tr>
            </tbody>
          </table>
        </section>

        <section className="docs-section">
          <h2>What is included</h2>
          <ul>
            <li>10 short Python programs for the Deep Learning Lab experiments.</li>
            <li>Aim, algorithm and expected output for every program.</li>
            <li>Editable code with line numbers and syntax highlighting.</li>
            <li>Dark and light themes, adjustable editor font size.</li>
            <li>Download any program as its original source file.</li>
          </ul>
        </section>

        <section className="docs-section">
          <h2>How to use</h2>
          <ol>
            <li>Read the aim and algorithm, then edit the code if you want to experiment.</li>
            <li>Press <strong>Run</strong> (or <code>Ctrl + Enter</code>) to see the program output.</li>
            <li>Open <strong>Input</strong> to see the sample stdin for programs that read from the console.</li>
          </ol>
        </section>

        <section className="docs-section">
          <h2>Shortcuts</h2>
          <table className="docs-table">
            <thead><tr><th>Action</th><th>Shortcut</th></tr></thead>
            <tbody>
              <tr><td>Run program</td><td><code>Ctrl / ⌘ + Enter</code></td></tr>
              <tr><td>Close a dialog</td><td><code>Esc</code></td></tr>
            </tbody>
          </table>
        </section>

        <p className="docs-footer">
          Every program and output is local to the page, so the whole site works offline from a single HTML file.
        </p>
      </div>
    </div>
  );
}
