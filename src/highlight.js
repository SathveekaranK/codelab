const KEYWORDS = new Set(`public private protected class interface extends implements static final void
  int boolean byte char long short float double new return if else for while do break continue
  try catch finally throw throws this super switch case default package import true false null
  instanceof synchronized enum struct namespace using inline const delete template typename
  set proc global foreach expr incr puts exit exec source eval elseif then`.split(/\s+/));

const TYPES = new Set(`String System BufferedReader InputStreamReader DataInputStream
  DataOutputStream PrintStream Socket ServerSocket DatagramSocket DatagramPacket InetAddress
  ByteArrayOutputStream ByteArrayInputStream BufferedImage ImageIO ImageIcon JFrame JLabel
  IOException Exception Object Thread Application Agent`.split(/\s+/));

export const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Minimal, dependency-free syntax highlighter for Java / TCL / C++ / shell. */
export function highlight(code, lang) {
  const pattern = /(\/\*[\s\S]*?\*\/)|(\/\/[^\n]*)|(#[^\n]*)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\$[A-Za-z_]\w*|[A-Za-z_$][\w$]*)/g;

  let html = '';
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    html += escapeHtml(code.slice(last, match.index));
    const token = match[0];
    let cls = '';

    if (match[1] || match[2]) cls = 'tok-comment';
    else if (match[3]) cls = lang === 'cpp' ? 'tok-preproc' : 'tok-comment';
    else if (match[4] || match[5]) cls = 'tok-string';
    else if (match[6]) cls = 'tok-number';
    else if (match[7]) {
      if (token.startsWith('$')) cls = 'tok-var';
      else if (KEYWORDS.has(token)) cls = 'tok-keyword';
      else if (TYPES.has(token) || /^[A-Z]/.test(token)) cls = 'tok-type';
    }

    html += cls ? `<span class="${cls}">${escapeHtml(token)}</span>` : escapeHtml(token);
    last = pattern.lastIndex;
  }

  return html + escapeHtml(code.slice(last));
}
