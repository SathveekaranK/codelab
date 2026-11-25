import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EXPERIMENTS, COURSES } from './data.js';
import { highlight } from './highlight.js';
import DocsPage from './DocsPage.jsx';

const LANG_LABEL = { python: 'Python' };

const initialCodes = () => Object.fromEntries(EXPERIMENTS.map((exp) => [exp.id, exp.code]));
const initialStdin = () => Object.fromEntries(EXPERIMENTS.map((exp) => [exp.id, exp.stdin || '']));

function outputClass(line) {
  if (/error|nothing|exception/i.test(line) && !/no error/i.test(line)) return 'term-error';
  if (/success|inserted|registered/i.test(line)) return 'term-success';
  if (line.startsWith('$')) return 'term-command';
  return 'term-plain';
}

/* ---------- editor shared by both skins ---------- */
function Editor({ value, onChange, lang, fontSize = 14, className = '', label = 'Code editor' }) {
  const areaRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);

  useEffect(() => {
    if (preRef.current) preRef.current.innerHTML = highlight(value, lang);
    if (gutterRef.current) {
      const count = value.split('\n').length;
      gutterRef.current.textContent = Array.from({ length: count }, (_, i) => i + 1).join('\n');
    }
  }, [value, lang]);

  const sync = () => {
    if (!areaRef.current) return;
    if (preRef.current) {
      preRef.current.scrollTop = areaRef.current.scrollTop;
      preRef.current.scrollLeft = areaRef.current.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = areaRef.current.scrollTop;
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const { selectionStart: start, selectionEnd: end } = e.currentTarget;
    const next = value.slice(0, start) + '    ' + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (!areaRef.current) return;
      areaRef.current.selectionStart = areaRef.current.selectionEnd = start + 4;
    });
  };

  const shared = {
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, Menlo, monospace',
    fontSize: `${fontSize}px`,
    lineHeight: `${fontSize + 8}px`,
    whiteSpace: 'pre',
    tabSize: 4
  };

  return (
    <div className={`code-editor ${className}`}>
      <div className="ce-gutter" ref={gutterRef} aria-hidden="true" style={shared} />
      <div className="ce-area">
        <pre className="ce-highlight" ref={preRef} aria-hidden="true" style={shared}><code /></pre>
        <textarea
          ref={areaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={sync}
          onKeyDown={onKeyDown}
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          aria-label={label}
          style={{ ...shared, WebkitTextFillColor: 'transparent' }}
        />
      </div>
    </div>
  );
}

function OutputLines({ output }) {
  if (!output) {
    return <div className="term-hint">Your output will appear here after you run the code.</div>;
  }
  if (output.phase === 'running') {
    return (
      <>
        <div className="term-line term-command">$ {output.command}</div>
        <div className="term-line term-muted">Compiling and running…</div>
      </>
    );
  }
  return (
    <>
      {output.lines.map((line, i) => (
        <div key={i} className={`term-line ${outputClass(line)}`}>{line || '\u00a0'}</div>
      ))}
      <div className="term-line term-muted term-done">Process exited with code 0 · {output.elapsed}s</div>
    </>
  );
}

/* ---------- dialogs ---------- */
function Picker({ activeId, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('All programs');
  const q = query.trim().toLowerCase();

  const visible = useMemo(() => EXPERIMENTS.filter((exp) => {
    const matchesCourse = course === 'All programs' || exp.course === course;
    const haystack = `${exp.id} ${exp.title} ${exp.tag} ${exp.file} ${exp.course}`.toLowerCase();
    return matchesCourse && (!q || q.split(/\s+/).every((token) => haystack.includes(token)));
  }), [q, course]);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="picker-dialog" role="dialog" aria-modal="true" aria-label="Open program" onClick={(e) => e.stopPropagation()}>
        <div className="picker-head">
          <div>
            <strong>Open program</strong>
            <small>Deep Learning Lab · U23AL511</small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="picker-search">
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by program name or number…" aria-label="Search programs" />
        </div>
        <div className="picker-filters" role="group" aria-label="Filter by lab">
          {COURSES.map((c) => (
            <button key={c} className={c === course ? 'active' : ''} onClick={() => setCourse(c)}>{c}</button>
          ))}
        </div>
        <div className="picker-list">
          {visible.length === 0 && <div className="picker-empty">No program matches that search.</div>}
          {visible.map((exp) => (
            <button
              key={exp.id}
              className={`picker-item ${exp.id === activeId ? 'active' : ''}`}
              onClick={() => { onSelect(exp.id); onClose(); }}
            >
              <span className="picker-num">{String(exp.id).padStart(2, '0')}</span>
              <span className="picker-copy">
                <span className="picker-title-row">
                  <strong>{exp.title}</strong>
                  <span className={`lang-pill ${exp.lang}`}>{LANG_LABEL[exp.lang]}</span>
                </span>
                <small>{exp.course} · {exp.file}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="picker-foot"><span>Esc</span> to close</div>
      </div>
    </div>
  );
}

function AlgorithmDialog({ exp, onClose }) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="algo-dialog" role="dialog" aria-modal="true" aria-label="Algorithm" onClick={(e) => e.stopPropagation()}>
        <div className="algo-head">
          <span className={`lang-dot ${exp.lang}`} />
          <strong>algorithm.txt</strong>
          <small>{exp.course} · {exp.title}</small>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="algo-body">
          <div className="algo-gutter">{exp.algorithm.map((_, i) => <span key={i}>{i + 1}</span>)}</div>
          <div className="algo-lines">
            <div className="algo-comment">/* AIM: {exp.aim} */</div>
            {exp.algorithm.map((step, i) => <div key={i}>{String(i + 1).padStart(2, '0')}&nbsp; {step}</div>)}
          </div>
        </div>
        <div className="algo-foot">
          <span>● READ ONLY</span><span>{exp.algorithm.length} steps</span>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Programiz skin ---------- */
function ProgramizSkin({ state }) {
  const {
    exp, code, setCode, theme, setTheme, output, run, running,
    openAlgorithm, setView, fontSize, setFontSize,
    stdin, setStdin, reset, download, tab, setTab, toast, handlePro
  } = state;

  return (
    <div className="pz">
      <header className="pz-topbar">
        <button className="pz-logo" onClick={state.handleLogo} title="Programiz">
          <span className="pz-mark">◢</span><span>programiz</span>
        </button>
        <span className="pz-subtitle">Online {LANG_LABEL[exp.lang]} Compiler</span>
        <div className="pz-header-right">
          <button className="pz-pro" onClick={handlePro}>PRO ›</button>
        </div>
      </header>

      <div className="pz-body">
        <aside className="pz-rail" aria-label="Language">
          <button className="active" title="Python" aria-label="Python" disabled>◉</button>
        </aside>

        <main className="pz-main">
          <div className="pz-toolbar">
            <span className="pz-file-tab">
              <span className={`lang-dot ${exp.lang}`} />{exp.file}
            </span>
            <button className="pz-visualize" onClick={openAlgorithm}>
              <span className="pz-play-outline">▷</span> Visualize
            </button>
            <button className="pz-run" onClick={run} disabled={running}>
              <span>▶</span> {running ? 'Running…' : 'Run'}
            </button>
            <button className={`pz-output-tab ${tab === 'output' ? 'active' : ''}`} onClick={() => setTab('output')}>Output</button>
            <span className="pz-toolbar-spacer" />
            <button className="pz-icon-btn" onClick={download} title="Download code" aria-label="Download code">⤴</button>
            <button className="pz-icon-btn" onClick={openAlgorithm} title="More options / algorithm" aria-label="More options">⋮</button>
          </div>

          <div className="pz-split">
            <section className="pz-editor-pane" aria-label="Code editor panel">
              <Editor value={code} onChange={setCode} lang={exp.lang} fontSize={fontSize} label={`${exp.file} code`} />
            </section>
            <section className="pz-output-pane" aria-label="Output panel">
              <div className="pz-output-mini">
                <button className={tab === 'output' ? 'active' : ''} onClick={() => setTab('output')}>Output</button>
                <button className={tab === 'input' ? 'active' : ''} onClick={() => setTab('input')}>Input</button>
                <button className={tab === 'algorithm' ? 'active' : ''} onClick={() => setTab('algorithm')}>Algorithm</button>
                <span className="pz-toolbar-spacer" />
                <button onClick={() => state.setFull(!state.full)} title="Toggle full screen output">{state.full ? 'Exit full' : 'Full'}</button>
              </div>
              <div className="pz-output-body">
                {tab === 'output' && <div className="terminal"><OutputLines output={output} /></div>}
                {tab === 'input' && (
                  <div className="stdin-box">
                    <label htmlFor="pz-stdin">stdin <span>Data passed to your program.</span></label>
                    <textarea id="pz-stdin" value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck="false" placeholder="No input required for this program." />
                  </div>
                )}
                {tab === 'algorithm' && (
                  <div className="pz-algo-inline">
                    <strong>{exp.title}</strong>
                    <p>{exp.aim}</p>
                    <ol>{exp.algorithm.map((step, i) => <li key={i}>{step}</li>)}</ol>
                  </div>
                )}
              </div>
            </section>
          </div>

          <footer className="pz-status">
            <span className="pz-status-left">
              <span className={`lang-dot ${exp.lang}`} />
              {exp.course} · Experiment {String(exp.id).padStart(2, '0')}
            </span>
            <span className="pz-toolbar-spacer" />
            <button onClick={reset}>Restore code</button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            <button onClick={() => setFontSize((f) => Math.max(11, f - 1))} aria-label="Decrease font size">A−</button>
            <button onClick={() => setFontSize((f) => Math.min(20, f + 1))} aria-label="Increase font size">A+</button>
            <button onClick={() => setView('docs')}>Docs</button>
          </footer>
        </main>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- Google Colab skin ---------- */
function ColabSkin({ state }) {
  const {
    exp, code, setCode, output, run, running,
    openAlgorithm, fontSize, setFontSize,
    stdin, setStdin, reset, download, tab, setTab, toast, handleLogo, handleAvatar
  } = state;
  const [sideTab, setSideTab] = useState('toc');

  const installCmd = '!pip install tensorflow matplotlib -q';
  const installOutput = 'Requirement already satisfied: tensorflow in /usr/local/lib/python3.11/dist-packages (2.21.0)';

  return (
    <div className="cl">
      <header className="cl-header">
        <div className="cl-header-left">
          <button className="cl-icon-btn" aria-label="Open menu" title="Menu">☰</button>
          <button className="cl-brand" onClick={handleLogo} title="Colab"><span className="cl-brand-mark">▲</span> Colab</button>
          <span className="cl-divider" />
          <input className="cl-filename" defaultValue="Lab_Programs.ipynb" aria-label="Notebook name" />
          <button className="cl-icon-btn cl-save" title="Saved to local browser">☁</button>
        </div>
        <div className="cl-header-right">
          <button className="cl-share" onClick={download}>Share</button>
          <button className="cl-avatar" onClick={handleAvatar} title="Account">G</button>
        </div>
      </header>

      <div className="cl-menubar">
        <div className="cl-menu-items">
          <span>File</span><span>Edit</span><span>View</span><span>Insert</span>
          <span>Runtime</span><span>Tools</span><span>Help</span>
        </div>
        <div className="cl-menu-actions">
          <button onClick={run} disabled={running}>▶ Run all</button>
          <span className="cl-connect">Disconnected ⚙</span>
        </div>
      </div>

      <div className="cl-body">
        <aside className="cl-rail" aria-label="Notebook tools">
          <button className="cl-icon-btn" onDoubleClick={openAlgorithm} title="Search" aria-label="Search">⌕</button>
          <button className={`cl-icon-btn ${sideTab === 'toc' ? 'active' : ''}`} onClick={() => setSideTab('toc')} title="Table of contents" aria-label="Table of contents">☰</button>
          <button className={`cl-icon-btn ${sideTab === 'files' ? 'active' : ''}`} onClick={() => setSideTab('files')} title="Files" aria-label="Files">▤</button>
          <button className="cl-icon-btn" title="Snippets" aria-label="Snippets">⌘</button>
        </aside>

        <aside className="cl-sidepanel">
          <div className="cl-side-tabs">
            <button className={sideTab === 'files' ? 'active' : ''} onClick={() => setSideTab('files')}>Files</button>
            <button className={sideTab === 'toc' ? 'active' : ''} onClick={() => setSideTab('toc')}>Table of contents</button>
          </div>
          {sideTab === 'toc' ? (
            <div className="cl-side-list">
              <div className="cl-side-caption">OUTLINE</div>
              <div className="cl-file-item active">{exp.title}</div>
              {['Algorithm', 'Code', 'Output'].map((section) => (
                <div key={section} className="cl-side-item">{section}</div>
              ))}
            </div>
          ) : (
            <div className="cl-side-list">
              <div className="cl-side-caption">NOTEBOOK FILES</div>
              <div className="cl-file-item">📁 sample_data/</div>
              <div className="cl-file-item active">🐍 {exp.file}</div>
            </div>
          )}
        </aside>

        <main className="cl-notebook" aria-label="Notebook">
          <div className="cl-cell-row">
            <div className="cl-cell-gutter">
              <button className="cl-cell-run" onClick={run} disabled={running} title="Install dependencies" aria-label="Install dependencies">▶</button>
              <span className="cl-cell-prompt">{output && !running ? '[1]' : '[ ]'}</span>
            </div>
            <section className="cl-cell cl-setup">
              <header className="cl-cell-bar">
                <span className="cl-cell-type">Setup</span>
                <span>pip</span>
                <span className="cl-cell-spacer" />
                <span>install before import</span>
              </header>
              <pre className="cl-setup-code">{installCmd}</pre>
              {output && (
                <div className="cl-setup-output">
                  <div className="term-line term-muted">{running ? 'Collecting packages…' : installOutput}</div>
                </div>
              )}
            </section>
          </div>

          <div className="cl-cell-row">
            <div className="cl-cell-gutter">
              <button className="cl-cell-run" onClick={run} disabled={running} title="Run this cell" aria-label="Run code cell">▶</button>
              <span className="cl-cell-prompt">{output && !running ? '[2]' : '[ ]'}</span>
            </div>
            <section className="cl-cell cl-code">
              <header className="cl-cell-bar">
                <span className={`lang-dot ${exp.lang}`} />
                <span>{exp.file}</span>
                <span className="cl-cell-spacer" />
                <button onClick={reset} title="Restore original code">Restore</button>
                <button onClick={download} title="Download code">Download</button>
                <button onClick={() => setFontSize((f) => Math.max(11, f - 1))} aria-label="Decrease font size">A−</button>
                <button onClick={() => setFontSize((f) => Math.min(20, f + 1))} aria-label="Increase font size">A+</button>
                <button className="cl-cell-run-small" onClick={run} disabled={running}>Run ▶</button>
              </header>
              <Editor value={code} onChange={setCode} lang={exp.lang} fontSize={fontSize} className="cl-editor" label={`${exp.file} code cell`} />
            </section>
          </div>

          <div className="cl-cell-row">
            <div className="cl-cell-gutter"><span className="cl-cell-prompt">[ ]</span></div>
            <section className="cl-cell cl-output">
              <header className="cl-cell-bar">
                <span className="cl-cell-type">Output</span>
                <span className="cl-cell-spacer" />
                <button className={tab === 'output' ? 'active' : ''} onClick={() => setTab('output')}>Output</button>
                <button className={tab === 'input' ? 'active' : ''} onClick={() => setTab('input')}>Input</button>
                <button onClick={() => state.clearOutput()}>Clear</button>
              </header>
              <div className="cl-output-body">
                {tab === 'output' && <div className="terminal"><OutputLines output={output} /></div>}
                {tab === 'input' && (
                  <div className="stdin-box">
                    <label htmlFor="cl-stdin">stdin <span>Data passed to your program.</span></label>
                    <textarea id="cl-stdin" value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck="false" placeholder="No input required for this program." />
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="cl-add-cell">
            <button onClick={run} disabled={running}>+ Code</button>
            <button>+ Text</button>
          </div>
        </main>
      </div>

      <footer className="cl-statusbar">
        <span className="cl-status-left">● Ready</span>
        <span>{exp.course}</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>{LANG_LABEL[exp.lang]}</span>
      </footer>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- app ---------- */
export default function App() {
  const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
  const [view, setView] = useState(hash === '#docs' ? 'docs' : hash === '#colab' ? 'colab' : 'compiler');
  const [selected, setSelected] = useState(1);
  const [codes, setCodes] = useState(initialCodes);
  const [stdin, setStdin] = useState(initialStdin);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState(null);
  const [tab, setTab] = useState('output');
  const [pickerOpen, setPickerOpen] = useState(hash === '#lab');
  const [algoOpen, setAlgoOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [toast, setToast] = useState('');
  const timerRef = useRef(null);
  const toastRef = useRef(null);
  const logoClicks = useRef(0);
  const proClicks = useRef(0);
  const avatarClicks = useRef(0);
  const clickTimer = useRef(null);
  const proTimer = useRef(null);
  const avatarTimer = useRef(null);

  const exp = EXPERIMENTS.find((item) => item.id === selected) || EXPERIMENTS[0];
  const code = codes[exp.id];
  const running = output?.phase === 'running';

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#colab') setView('colab');
      else if (h === '#docs') setView('docs');
      else if (h === '#lab') { setView('compiler'); setPickerOpen(true); }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearTimeout(toastRef.current);
    clearTimeout(clickTimer.current);
    clearTimeout(proTimer.current);
    clearTimeout(avatarTimer.current);
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const select = useCallback((id) => {
    clearTimeout(timerRef.current);
    setSelected(id);
    setOutput(null);
    setTab('output');
    setFull(false);
  }, []);

  const setLang = useCallback((lang) => {
    const first = EXPERIMENTS.find((item) => item.lang === lang);
    if (first) select(first.id);
  }, [select]);

  const setCode = useCallback((value) => {
    setCodes((prev) => ({ ...prev, [exp.id]: value }));
  }, [exp.id]);

  const run = useCallback(() => {
    clearTimeout(timerRef.current);
    setTab('output');
    setOutput({ phase: 'running', command: `python ${exp.file}` });
    timerRef.current = setTimeout(() => {
      setOutput({
        phase: 'done',
        lines: exp.output.split('\n'),
        elapsed: (0.18 + (exp.id % 5) * 0.07).toFixed(2)
      });
    }, 650);
  }, [exp]);

  const reset = useCallback(() => {
    setCodes((prev) => ({ ...prev, [exp.id]: exp.code }));
    setStdin((prev) => ({ ...prev, [exp.id]: exp.stdin || '' }));
    setOutput(null);
    notify('Code restored to the lab manual version');
  }, [exp, notify]);

  const download = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exp.file;
    a.click();
    URL.revokeObjectURL(url);
    notify(`${exp.file} downloaded`);
  }, [code, exp.file, notify]);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'enter' && view !== 'docs') { e.preventDefault(); run(); }
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'e') || (e.altKey && key === 'l')) {
        e.preventDefault();
        setPickerOpen((open) => !open);
      }
      if (key === 'escape') { setPickerOpen(false); setAlgoOpen(false); setFull(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [run, view]);

  const handleLogo = () => {
    logoClicks.current += 1;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { logoClicks.current = 0; }, 1800);
    if (logoClicks.current >= 5) { logoClicks.current = 0; setPickerOpen(true); }
  };

  const handlePro = () => {
    proClicks.current += 1;
    clearTimeout(proTimer.current);
    proTimer.current = setTimeout(() => { proClicks.current = 0; }, 1800);
    if (proClicks.current >= 5) { proClicks.current = 0; setView('colab'); }
  };

  const handleAvatar = () => {
    avatarClicks.current += 1;
    clearTimeout(avatarTimer.current);
    avatarTimer.current = setTimeout(() => { avatarClicks.current = 0; }, 1800);
    if (avatarClicks.current >= 5) { avatarClicks.current = 0; setView('compiler'); }
  };

  const state = {
    exp, code, setCode, theme, setTheme, output, run, running,
    openPicker: () => setPickerOpen(true), openAlgorithm: () => setAlgoOpen(true),
    view, setView, fontSize, setFontSize, stdin,
    setStdin: (value) => setStdin((prev) => ({ ...prev, [exp.id]: value })),
    reset, download, tab, setTab, toast, select, setLang, full, setFull,
    clearOutput: () => setOutput(null), handleLogo, handlePro, handleAvatar
  };

  const effectiveTheme = view === 'colab' ? 'light' : theme;

  return (
    <div className={`app theme-${effectiveTheme} view-${view} ${full ? 'output-full' : ''}`}>
      {view === 'docs' ? (
        <DocsPage onOpenCompiler={() => setView('compiler')} />
      ) : view === 'colab' ? (
        <ColabSkin state={state} />
      ) : (
        <ProgramizSkin state={state} />
      )}

      {pickerOpen && (
        <Picker activeId={exp.id} onSelect={select} onClose={() => setPickerOpen(false)} />
      )}
      {algoOpen && <AlgorithmDialog exp={exp} onClose={() => setAlgoOpen(false)} />}
    </div>
  );
}
