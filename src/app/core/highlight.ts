export type TokenKind = 'kw' | 'str' | 'com' | 'dec' | 'num' | 'fn' | 'tag' | 'txt';
export interface Token { kind: TokenKind; text: string; }

const KEYWORDS = new Set([
  'var', 'let', 'const', 'function', 'return', 'export', 'class', 'new', 'import', 'from',
  'if', 'else', 'true', 'false', 'null', 'undefined', 'this', 'void', 'standalone',
]);

const PATTERN = new RegExp([
  String.raw`(?<com>\/\/[^\n]*|\/\*[\s\S]*?\*\/)`,
  String.raw`(?<str>'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|` + '`(?:\\\\.|[^`\\\\])*`)',
  String.raw`(?<dec>@[A-Za-z]+)`,
  String.raw`(?<tag>(?<![\w$])<\/?[a-z][\w-]*)`,
  String.raw`(?<num>\b\d+(?:\.\d+)?\b)`,
  String.raw`(?<word>[A-Za-z_$][\w$]*)`,
].join('|'), 'g');

/**
 * Tiny, dependency-free tokenizer for the code samples on this site.
 * Output is rendered as text nodes in spans, so no innerHTML is involved.
 */
export function highlight(code: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  const push = (kind: TokenKind, text: string) => {
    if (!text) return;
    const prev = out[out.length - 1];
    if (prev && prev.kind === kind) prev.text += text;
    else out.push({ kind, text });
  };

  for (const m of code.matchAll(PATTERN)) {
    push('txt', code.slice(last, m.index));
    const g = m.groups!;
    if (g['com']) push('com', g['com']);
    else if (g['str']) push('str', g['str']);
    else if (g['dec']) push('dec', g['dec']);
    else if (g['tag']) push('tag', g['tag']);
    else if (g['num']) push('num', g['num']);
    else if (g['word']) {
      const isCall = /^\s*\(/.test(code.slice(m.index! + m[0].length));
      push(KEYWORDS.has(g['word']) ? 'kw' : isCall ? 'fn' : 'txt', g['word']);
    }
    last = m.index! + m[0].length;
  }
  push('txt', code.slice(last));
  return out;
}
