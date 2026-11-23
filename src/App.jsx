import { useEffect, useMemo, useRef, useState } from 'react';
import { EXPERIMENTS, ALGORITHMS, REQUIREMENTS } from './data.js';
import { highlight } from './highlight.js';
import DocsPage from './DocsPage.jsx';

const LANG_LABEL = { java: 'Java', tcl: 'TCL Script', cpp: 'C++', bash: 'Shell' };

const STDIN = {
  3: 'Hai Server\nHello\nend\nds',
  4: 'yahoo.com\ncricinfo.com\nyoutube.com',
  6: '165.165.80.80\n6A:08:AA:C2',
  10: '7\n1\n0\n1\n1\n0\n0\n1\n3\n1\n0\n1\n1\n0\n1\n1\n0\n0\n1\n0\n1'
};

const initialCodes = () =>
  Object.fromEntries(EXPERIMENTS.map((exp, i) => [i, exp.files.map((file) => file.code)]));

function outputClass(line) {
  if (line.startsWith('---')) return 'section';
  if (line.startsWith('$')) return 'cmd';
  if (/no error|success|BUILD|finished|complete|exited/i.test(line)) return 'success';
  if (/error|not found|closed|down/i.test(line)) return 'error';
  return 'plain';
}

/* ---------------- Top navigation ---------------- */
function Navbar({ theme, view, onNavigate, onToggleTheme, onShare, onSecret }) {
  const clicks = useRef(0);
  const clickTimer = useRef(null);

  const handleLogo = () => {
    clicks.current += 1;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clicks.current = 0; }, 1800);
    if (clicks.current >= 5) {
      clicks.current = 0;
      onSecret();
    }
  };

  return (
    <header className="top-nav">
      <div className="nav-left">
        <button className="nav-logo" onClick={handleLogo} title="codeLab">
          <span>&lt;/&gt;</span>
        </button>
        <div className="nav-brand">
          <strong>codeLab</strong>
          <small>Online Compiler</small>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <button className={view === 'compiler' ? 'active' : ''} onClick={() => onNavigate('compiler')}>
            Compiler
          </button>
          <button className={view === 'docs' ? 'active' : ''} onClick={() => onNavigate('docs')}>
            Docs
          </button>
        </nav>
      </div>
      <div className="nav-right">
        <button className="nav-icon" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <button className="nav-text-btn" onClick={onShare}>Share</button>
        <div className="avatar">G</div>
      </div>
    </header>
  );
}

/* ---------------- Hidden example library ---------------- */
const normalizeSearch = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function highlightQuestion(text, query) {
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  if (!tokens.length) return text;
  const pattern = new RegExp(
    `(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'ig'
  );
  const tokenSet = new Set(tokens);
  return text.split(pattern).map((part, i) =>
    tokenSet.has(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part
  );
}

function LibraryModal({ active, onSelect, onClose }) {
  const [filter, setFilter] = useState('');
  const query = filter.trim();
  const numberMatch = query.match(/^(?:experiment|exp|question|q|no|number|lab|program)?\s*#?\s*(\d+)\.?$/i);

  const visible = useMemo(() => {
    const entries = EXPERIMENTS.map((exp, i) => ({ exp, i }));
    if (!query) return entries;

    if (numberMatch) {
      const number = Number(numberMatch[1]);
      return entries.filter(({ exp }) => exp.id === number);
    }

    const tokens = normalizeSearch(query).split(' ').filter(Boolean);
    return entries.filter(({ exp }) => {
      const haystack = normalizeSearch(
        `${exp.id} ${exp.title} ${exp.tag} ${exp.aim} ${exp.result} ${exp.files.map((f) => f.name).join(' ')}`
      );
      return tokens.every((token) => haystack.includes(token));
    });
  }, [query, numberMatch?.[1]]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="library-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <strong>Open example</strong>
            <small>Search by number or the question you received</small>
          </div>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="library-search">
          <span className="search-icon">⌕</span>
          <input
            autoFocus
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by number or question…"
          />
        </div>
        <div className="library-hint">
          Try <code>10</code>, <code>CRC</code>, or a few words from the question.
        </div>
        <div className="library-list">
          {visible.length === 0 && (
            <div className="examples-empty">No matching programs. Try an experiment number or words from its question.</div>
          )}
          {visible.map(({ exp, i }) => (
            <button
              key={exp.id}
              className={`library-item ${i === active ? 'active' : ''}`}
              onClick={() => { onSelect(i); onClose(); }}
            >
              <span className="example-num">{String(exp.id).padStart(2, '0')}</span>
              <span className="example-copy">
                <span className="library-title-row">
                  <strong>{exp.title}</strong>
                  <span className={`mini-lang ${exp.lang}`}>{LANG_LABEL[exp.lang]}</span>
                </span>
                <span className="library-qlabel">Question</span>
                <span className="library-question">{highlightQuestion(exp.aim, query)}</span>
                <small>{exp.tag}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="library-foot">
          <span>Ctrl + Shift + E</span> to toggle · <span>Esc</span> to close
        </div>
      </div>
    </div>
  );
}

/* ---------------- Language dropdown ---------------- */
function LanguageSelect({ file, files, onPick }) {
  const [open, setOpen] = useState(false);
  const unique = useMemo(() => {
    const seen = new Set();
    return files.filter((f) => (seen.has(f.lang) ? false : (seen.add(f.lang), true)));
  }, [files]);

  return (
    <div className="lang-select">
      <button className="lang-select-btn" onClick={() => setOpen((v) => !v)}>
        <span className={`lang-dot ${file.lang}`} />
        {LANG_LABEL[file.lang]}
        <span className="chevron">▾</span>
      </button>
      {open && (
        <>
          <div className="dropdown-backdrop" onClick={() => setOpen(false)} />
          <div className="lang-menu">
            <div className="lang-menu-title">Language</div>
            {unique.map((item) => (
              <button
                key={item.lang}
                className={item.lang === file.lang ? 'selected' : ''}
                onClick={() => { onPick(item.lang); setOpen(false); }}
              >
                <span className={`lang-dot ${item.lang}`} />
                {LANG_LABEL[item.lang]}
                {item.lang === file.lang && <span className="check">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Console ---------------- */
function Console({ output, tab, onTab, stdin, onStdin, onClear, style }) {
  const status = output?.phase === 'running' ? 'Running' : output?.phase === 'done' ? 'Finished' : 'Ready';

  return (
    <section className="console" style={style}>
      <div className="console-tabs">
        <button className={tab === 'output' ? 'active' : ''} onClick={() => onTab('output')}>Output</button>
        <button className={tab === 'input' ? 'active' : ''} onClick={() => onTab('input')}>Input</button>
        <button className={tab === 'problems' ? 'active' : ''} onClick={() => onTab('problems')}>
          Problems <span className="problem-count">0</span>
        </button>
        <div className="console-right">
          <span className={`run-status ${status.toLowerCase()}`}>● {status}</span>
          <button className="console-clear" onClick={onClear}>Clear</button>
        </div>
      </div>

      <div className="console-body">
        {tab === 'output' && (
          <div className="terminal">
            {!output && <div className="terminal-hint">Your output will appear here after you run the code.</div>}
            {output?.phase === 'running' && (
              <>
                <div className="term-line cmd">{output.command}</div>
                <div className="term-line muted">Compiling and executing…</div>
              </>
            )}
            {output?.phase === 'done' && (
              <>
                {output.lines.map((line, i) => (
                  <div key={i} className={`term-line ${outputClass(line)}`}>{line || '\u00a0'}</div>
                ))}
                <div className="term-line success">
                  Process exited with code 0 · {output.elapsed}s
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'input' && (
          <div className="stdin-wrap">
            <div className="stdin-label">stdin <span>Data below is passed to your program.</span></div>
            <textarea
              value={stdin}
              onChange={(e) => onStdin(e.target.value)}
              spellCheck="false"
              placeholder="No input required for this program."
            />
          </div>
        )}

        {tab === 'problems' && (
          <div className="no-problems">
            <span className="check-circle">✓</span>
            <div><strong>No problems detected</strong><small>Compilation finished without errors.</small></div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- About / toast ---------------- */
function AboutModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><strong>About this compiler</strong><button onClick={onClose}>✕</button></div>
        <p>
          codeLab is a front-end demo built around the Computer Networks lab manual. The code and
          results are recorded locally, so the Run button replays a sample execution instead of
          calling a real compiler service.
        </p>
        <p className="modal-note">Everything runs in your browser — no data is sent anywhere.</p>
      </div>
    </div>
  );
}

/* ---------------- Algorithm viewer ---------------- */
function AlgorithmModal({ exp, onClose }) {
  const algorithm = ALGORITHMS[exp.id] || '// No algorithm recorded for this experiment.';
  const lines = algorithm.split('\n');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="algorithm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="algorithm-head">
          <span className={`file-dot ${exp.lang}`} />
          <strong>algorithm.txt</strong>
          <small>Experiment {String(exp.id).padStart(2, '0')} · {exp.title}</small>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="algorithm-meta">
          <div><span>RUN</span><code>{exp.command}</code></div>
          <div><span>REQUIRES</span><p>{REQUIREMENTS[exp.id]}</p></div>
        </div>
        <div className="algorithm-code">
          <div className="algorithm-gutter">
            {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          <pre
            className="algorithm-text"
            dangerouslySetInnerHTML={{ __html: highlight(algorithm, 'java') }}
          />
        </div>
        <div className="algorithm-foot">
          <span className="algorithm-readonly">● READ ONLY</span>
          <span>{lines.length} lines</span>
          <span>UTF-8</span>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */
export default function App() {
  const [view, setView] = useState('compiler');
  const [expIndex, setExpIndex] = useState(9);
  const [fileIndex, setFileIndex] = useState(0);
  const [codes, setCodes] = useState(initialCodes);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(13);
  const [output, setOutput] = useState(null);
  const [consoleTab, setConsoleTab] = useState('output');
  const [stdin, setStdin] = useState(() => Object.fromEntries(
    EXPERIMENTS.map((exp, i) => [i, STDIN[i] || ''])
  ));
  const [aboutOpen, setAboutOpen] = useState(false);
  const [algorithmOpen, setAlgorithmOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [caret, setCaret] = useState({ line: 1, col: 1 });
  const [layout, setLayout] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 760 ? 'vertical' : 'horizontal'
  );
  const [splitRatio, setSplitRatio] = useState(0.62);

  const codeRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  const timerRef = useRef(null);
  const toastRef = useRef(null);
  const splitRef = useRef(null);
  const draggingRef = useRef(false);

  const exp = EXPERIMENTS[expIndex];
  const file = exp.files[fileIndex];
  const code = codes[expIndex][fileIndex];
  const dirty = code !== file.code;

  useEffect(() => {
    if (highlightRef.current) highlightRef.current.innerHTML = highlight(code, file.lang);
    if (gutterRef.current) {
      const count = code.split('\n').length;
      gutterRef.current.textContent = Array.from({ length: count }, (_, i) => i + 1).join('\n');
    }
  }, [code, file.lang]);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = 0;
      codeRef.current.scrollLeft = 0;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = 0;
  }, [expIndex, fileIndex]);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearTimeout(toastRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const vertical = layout === 'vertical';
      const position = vertical ? e.clientY - rect.top : e.clientX - rect.left;
      const size = vertical ? rect.height : rect.width;
      if (size <= 0) return;
      setSplitRatio(Math.min(0.82, Math.max(0.18, position / size)));
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.classList.remove('is-resizing', 'resizing-v', 'resizing-h');
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.classList.remove('is-resizing', 'resizing-v', 'resizing-h');
    };
  }, [layout]);

  useEffect(() => {
    if (window.location.hash.toLowerCase() === '#lab') setLibraryOpen(true);
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 2000);
  };

  const selectExample = (index) => {
    clearTimeout(timerRef.current);
    setView('compiler');
    setExpIndex(index);
    setFileIndex(0);
    setOutput(null);
    setConsoleTab('output');
  };

  const updateCode = (value) => {
    setCodes((prev) => ({
      ...prev,
      [expIndex]: prev[expIndex].map((text, i) => (i === fileIndex ? value : text))
    }));
  };

  const syncScroll = () => {
    if (!codeRef.current) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = codeRef.current.scrollTop;
      highlightRef.current.scrollLeft = codeRef.current.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = codeRef.current.scrollTop;
  };

  const updateCaret = () => {
    const el = codeRef.current;
    if (!el) return;
    const before = code.slice(0, el.selectionStart).split('\n');
    setCaret({ line: before.length, col: before[before.length - 1].length + 1 });
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const { selectionStart: start, selectionEnd: end } = e.currentTarget;
    updateCode(code.slice(0, start) + '  ' + code.slice(end));
    requestAnimationFrame(() => {
      if (!codeRef.current) return;
      codeRef.current.selectionStart = codeRef.current.selectionEnd = start + 2;
      updateCaret();
    });
  };

  const run = () => {
    clearTimeout(timerRef.current);
    setCodes((prev) => ({ ...prev, [expIndex]: exp.files.map((f) => f.code) }));
    setConsoleTab('output');
    setOutput({ phase: 'running', command: exp.command });
    timerRef.current = setTimeout(() => {
      setOutput({
        phase: 'done',
        command: exp.command,
        lines: exp.output.split('\n'),
        elapsed: (0.28 + (exp.id % 5) * 0.09).toFixed(2)
      });
      timerRef.current = null;
    }, 700);
  };

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'enter') { e.preventDefault(); run(); }
      if ((e.ctrlKey && e.shiftKey && key === 'e') || (e.altKey && key === 'l')) {
        e.preventDefault();
        setLibraryOpen((open) => !open);
      }
      if (key === 'escape') {
        setAboutOpen(false);
        setLibraryOpen(false);
        setAlgorithmOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const reset = () => {
    setCodes((prev) => ({
      ...prev,
      [expIndex]: prev[expIndex].map((text, i) => (i === fileIndex ? file.code : text))
    }));
    setOutput(null);
    notify('Code reset to original example');
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(code);
      notify('Code link copied to clipboard');
    } catch {
      notify('Sharing is unavailable in this browser');
    }
  };

  const pickLanguage = (lang) => {
    const index = exp.files.findIndex((f) => f.lang === lang);
    if (index >= 0) setFileIndex(index);
  };

  const startDrag = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    document.body.classList.add('is-resizing', layout === 'vertical' ? 'resizing-v' : 'resizing-h');
  };

  const nudgeSplit = (e) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitRatio((ratio) => Math.max(0.18, ratio - step));
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitRatio((ratio) => Math.min(0.82, ratio + step));
    }
  };

  const lineHeight = fontSize + 8;
  const editorBasis = `calc(${splitRatio * 100}% - 3px)`;
  const consoleBasis = `calc(${(1 - splitRatio) * 100}% - 3px)`;

  return (
    <div className={`app theme-${theme}`}>
      <Navbar
        theme={theme}
        view={view}
        onNavigate={setView}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onShare={share}
        onSecret={() => setLibraryOpen(true)}
      />

      {view === 'compiler' ? (
        <>
          <div className="page-head">
        <div>
          <h1>Online Compiler</h1>
          <p>All-in-one Computer Networks compiler — write, run and revise lab programs in your browser.</p>
        </div>
        <div className="page-head-right">
          <span className="language-chip"><span className={`lang-dot ${file.lang}`} />{LANG_LABEL[file.lang]}</span>
          <span
            className="version-chip"
            title="Double-click to view algorithm"
            onDoubleClick={() => setAlgorithmOpen(true)}
          >
            v2.4.1
          </span>
        </div>
      </div>

      <div className="workspace">
        <main className="compiler">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <LanguageSelect file={file} files={exp.files} onPick={pickLanguage} />
              <div className="file-tabs">
                {exp.files.map((item, i) => (
                  <button
                    key={item.name}
                    className={`file-tab ${i === fileIndex ? 'active' : ''}`}
                    onClick={() => { setFileIndex(i); setOutput(null); }}
                  >
                    <span className={`file-dot ${item.lang}`} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="toolbar-right">
              <div className="font-controls">
                <button onClick={() => setFontSize((f) => Math.max(11, f - 1))} title="Decrease font">A−</button>
                <button onClick={() => setFontSize((f) => Math.min(18, f + 1))} title="Increase font">A+</button>
              </div>
              <button className="tool-btn" onClick={reset}>↺ Reset</button>
              <button className="tool-btn" onClick={share}>⤴ Share</button>
              <button
                className="tool-btn layout-btn"
                onClick={() => setLayout((current) => (current === 'vertical' ? 'horizontal' : 'vertical'))}
                title={layout === 'vertical' ? 'Switch to side-by-side view' : 'Switch to stacked view'}
              >
                {layout === 'vertical' ? '↔ Side' : '↕ Stack'}
              </button>
              <button className="run-btn" onClick={run} disabled={output?.phase === 'running'}>
                ▶ <span>{output?.phase === 'running' ? 'Running…' : 'Run'}</span>
              </button>
            </div>
          </div>

          <div
            ref={splitRef}
            className={`split-body layout-${layout}`}
          >
          <div className="editor" style={{ flexBasis: editorBasis }}>
            <div className="gutter" ref={gutterRef} aria-hidden="true"
              style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }} />
            <div className="code-area">
              <pre
                className="highlight"
                ref={highlightRef}
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, margin: 0,
                  padding: '14px 18px', overflow: 'hidden',
                  pointerEvents: 'none', background: 'transparent',
                  fontFamily: 'Consolas, Menlo, monospace',
                  fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`,
                  whiteSpace: 'pre'
                }}
              ><code /></pre>
              <textarea
                ref={codeRef}
                value={code}
                onChange={(e) => updateCode(e.target.value)}
                onScroll={syncScroll}
                onKeyDown={handleKeyDown}
                onSelect={updateCaret}
                onClick={updateCaret}
                onKeyUp={updateCaret}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                wrap="off"
                aria-label="Code editor"
                style={{
                  position: 'absolute', inset: 0, border: 0, outline: 'none',
                  width: '100%', height: '100%', resize: 'none',
                  padding: '14px 18px', background: 'transparent',
                  color: 'transparent', WebkitTextFillColor: 'transparent',
                  caretColor: '#e6edf3', overflow: 'auto',
                  fontFamily: 'Consolas, Menlo, monospace',
                  fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`,
                  whiteSpace: 'pre', tabSize: 4
                }}
              />
            </div>
          </div>

          <div
            className="split-divider"
            role="separator"
            tabIndex={0}
            aria-orientation={layout === 'vertical' ? 'horizontal' : 'vertical'}
            aria-label="Resize editor and output"
            title="Drag to resize · double-click to reset"
            onPointerDown={startDrag}
            onDoubleClick={() => setSplitRatio(0.62)}
            onKeyDown={nudgeSplit}
          >
            <span className="split-grip" />
          </div>

          <Console
            output={output}
            tab={consoleTab}
            onTab={setConsoleTab}
            stdin={stdin[expIndex]}
            onStdin={(value) => setStdin((prev) => ({ ...prev, [expIndex]: value }))}
            onClear={() => setOutput(null)}
            style={{ flexBasis: consoleBasis }}
          />
          </div>

          <footer className="status-bar">
            <span className={`status-dot ${output?.phase === 'running' ? 'busy' : dirty ? 'modified' : ''}`} />
            <span>{output?.phase === 'running' ? 'Compiling…' : dirty ? 'Modified' : 'Ready'}</span>
            <span className="status-spacer" />
            <span>Ln {caret.line}, Col {caret.col}</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>{LANG_LABEL[file.lang]}</span>
          </footer>
        </main>
          </div>
        </>
      ) : (
        <DocsPage onOpenCompiler={() => setView('compiler')} />
      )}

      {libraryOpen && (
        <LibraryModal active={expIndex} onSelect={selectExample} onClose={() => setLibraryOpen(false)} />
      )}
      {algorithmOpen && <AlgorithmModal exp={exp} onClose={() => setAlgorithmOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}
