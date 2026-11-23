import { useState } from 'react';

const FEATURES = [
  'Clean, compiler-inspired code editor',
  'Multiple programming language selection',
  'Experiment-specific file tabs',
  'Input, Output and Problems panels',
  'Light and dark themes',
  'Preloaded experiment programs',
  'Quick experiment switching',
  'Standalone HTML build'
];

const SHORTCUTS = [
  { label: 'Keyboard shortcut', value: 'Ctrl + Shift + E' },
  { label: 'Alternative shortcut', value: 'Alt + L' },
  { label: 'Direct URL', value: 'standalone.html#lab' },
  { label: 'Secret trick', value: 'Click the logo 5 times' }
];

export default function DocsPage({ onOpenCompiler }) {
  const [revealClicks, setRevealClicks] = useState(0);
  const revealed = revealClicks >= 2;

  return (
    <div className="docs-scroll">
      <div className="docs-wrap">
        <header className="docs-hero">
          <div className="docs-eyebrow">🦊 NARIKOOTAM COMPILER LAB</div>
          <h1>Welcome to <span>CodeLab</span></h1>
          <p className="docs-tagline">
            Built by Narikootam. Powered by last-minute practical exam energy. 😂
          </p>
          <p className="docs-lead">
            Welcome to our little programming playground! This project was created to make our
            Advanced Programming practical preparation easier, faster, and a little less stressful.
          </p>
          <div className="docs-actions">
            <button className="docs-primary" onClick={onOpenCompiler}>Open Compiler →</button>
            <span className="docs-chip">All-in-One CN Compiler</span>
            <span className="docs-chip">React</span>
            <span className="docs-chip">Static app</span>
            <span className="docs-chip">AP Practical</span>
          </div>
        </header>

        <div className="docs-produced">
          Produced by <strong>Narikootam Productions 🦊</strong>
        </div>

        <div className="docs-rednotice">
          <strong>🚨 Staff nearby?</strong>
          <ol>
            <li>Close this page.</li>
            <li>Don't press <code>Ctrl + Shift + E</code>.</li>
            <li>Act natural — <strong>we're not here.</strong></li>
          </ol>
          <button onClick={onOpenCompiler}>Panic → Compiler</button>
        </div>

        <section className="docs-section">
          <div className="docs-section-head">
            <span className="docs-section-icon">💻</span>
            <div>
              <h2>About This Website</h2>
              <p>What CodeLab actually is.</p>
            </div>
          </div>
          <p className="docs-paragraph">
            This website is a compiler-style interface developed using React for our Advanced
            Programming (AP) practical examination preparation.
          </p>
          <p className="docs-paragraph">
            It comes with a collection of predefined experiment programs, their corresponding code,
            and expected output. Instead of manually typing every program, users can select an
            experiment, explore its source code, provide input where applicable, and view its output
            through a compiler-like interface.
          </p>
        </section>

        <section className="docs-section">
          <div className="docs-section-head">
            <span className="docs-section-icon">⚡</span>
            <div>
              <h2>How to Use</h2>
              <p>Six steps from zero to practical-ready.</p>
            </div>
          </div>
          <ol className="steps">
            <li><strong>Open CodeLab</strong><span>Launch <code>standalone.html</code> in your browser.</span></li>
            <li><strong>Choose an experiment</strong><span>Open the experiment selector and choose the program you want to study.</span></li>
            <li><strong>Explore the code</strong><span>The selected program will appear in the editor.</span></li>
            <li><strong>Provide input</strong><span>Enter the required input in the Input panel, if applicable.</span></li>
            <li><strong>Run the program</strong><span>Click the Run button to see the corresponding predefined output.</span></li>
            <li><strong>Explore more</strong><span>Switch between experiments and revise the programs before your practical exam.</span></li>
          </ol>
        </section>

        <section className="docs-section">
          <div className="docs-section-head">
            <span className="docs-section-icon">🕹️</span>
            <div>
              <h2>Hidden Experiment Selector</h2>
              <p>Kept out of sight so the interface still looks like a basic compiler.</p>
            </div>
          </div>
          <p className="docs-paragraph">
            The experiment picker is intentionally hidden to maintain a clean compiler interface.
            Use any of these ways to open it:
          </p>
          <div className="shortcut-grid">
            {SHORTCUTS.map((item) => (
              <div className="shortcut-card" key={item.label}>
                <small>{item.label}</small>
                <code>{item.value}</code>
              </div>
            ))}
          </div>
          <p className="docs-muted">Press <code>Esc</code> to close the selector.</p>
        </section>

        <section className="docs-section">
          <div className="docs-section-head">
            <span className="docs-section-icon">🛠️</span>
            <div>
              <h2>Features</h2>
              <p>Everything packed into one self-contained file.</p>
            </div>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feature) => (
              <div className="feature-item" key={feature}>
                <span>✓</span>{feature}
              </div>
            ))}
          </div>
        </section>

        <section className="docs-love">
          <span className="docs-love-icon">🦊😂</span>
          <h2>A Little Note</h2>
          <p>
            We did not build this to change the world. We built it so nobody has to type the
            same program the night before the practical and pretend they understood it.
          </p>
          <p>
            It started with five friends staring at the manual thinking, <em>“What if the Run
            button just… worked?”</em> So we added code, a few secret shortcuts, a hidden picker,
            and one very confident “compile” animation.
          </p>
          <strong>
            Powered by curiosity, friendship, and highly questionable amounts of last-minute
            preparation. 🦊
          </strong>
        </section>

        <footer className="docs-footer">
          <strong>NARIKOOTAM 🦊</strong>
          <span>Five friends. One compiler. Zero regrets (hopefully).</span>
        </footer>

        <button
          className="docs-secret-names"
          onClick={() => setRevealClicks((count) => Math.min(2, count + 1))}
        >
          {revealed
            ? 'Uvaise • Karthi • Gokul • Kavi • Sathvee were never here. 🦊'
            : '••••• • •••• • •••• • ••• • •••••'}
        </button>
      </div>
    </div>
  );
}
