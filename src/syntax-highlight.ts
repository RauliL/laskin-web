export type HighlightKind =
  | "comment"
  | "string"
  | "number"
  | "delimiter"
  | "symbol";

export type HighlightSpan = {
  start: number;
  length: number;
  kind: HighlightKind;
};

const SEPARATORS = new Set(["[", "]", "(", ")", "{", "}", ",", '"']);

const UNIT_SYMBOLS = [
  "min",
  "mm",
  "cm",
  "km",
  "mg",
  "kg",
  "ms",
  "m",
  "g",
  "s",
  "h",
  "d",
];

function isSeparator(char: string): boolean {
  return SEPARATORS.has(char);
}

function isGraph(char: string): boolean {
  return char.length === 1 && /\S/.test(char);
}

function isSymbol(char: string): boolean {
  return isGraph(char) && !isSeparator(char);
}

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isDigits(text: string, start: number, end: number): boolean {
  for (let i = start; i < end; i++) {
    if (!isDigit(text[i]!)) {
      return false;
    }
  }

  return start < end;
}

function startsWith(text: string, pos: number, literal: string): boolean {
  return text.startsWith(literal, pos);
}

function symbolBoundaryAfter(chars: string[], pos: number): boolean {
  return pos >= chars.length || !isSymbol(chars[pos]!);
}

function matchUnit(chars: string[], pos: number): number | null {
  const tail = chars.slice(pos).join("");

  for (const unit of UNIT_SYMBOLS) {
    if (
      tail.startsWith(unit) &&
      symbolBoundaryAfter(chars, pos + [...unit].length)
    ) {
      return pos + [...unit].length;
    }
  }

  return null;
}

function parseNumberBody(chars: string[], pos: number): number | null {
  if (pos >= chars.length || !isDigit(chars[pos]!)) {
    return null;
  }

  let end = pos;

  while (end < chars.length && isDigit(chars[end]!)) {
    end++;
  }

  while (
    end < chars.length &&
    chars[end] === "_" &&
    end + 1 < chars.length &&
    isDigit(chars[end + 1]!)
  ) {
    end++;

    while (end < chars.length && isDigit(chars[end]!)) {
      end++;
    }
  }

  if (
    end < chars.length &&
    chars[end] === "." &&
    end + 1 < chars.length &&
    isDigit(chars[end + 1]!)
  ) {
    end++;

    while (end < chars.length && isDigit(chars[end]!)) {
      end++;
    }

    while (
      end < chars.length &&
      chars[end] === "_" &&
      end + 1 < chars.length &&
      isDigit(chars[end + 1]!)
    ) {
      end++;

      while (end < chars.length && isDigit(chars[end]!)) {
        end++;
      }
    }
  }

  const unitEnd = matchUnit(chars, end);

  if (unitEnd !== null) {
    end = unitEnd;
  }

  return end > pos ? end : null;
}

function scanComment(chars: string[], pos: number): number | null {
  if (pos >= chars.length || chars[pos] !== "#") {
    return null;
  }

  return chars.length;
}

function scanStringLiteral(chars: string[], pos: number): number | null {
  if (pos >= chars.length) {
    return null;
  }

  const quote = chars[pos];

  if (quote !== '"' && quote !== "'") {
    return null;
  }

  let end = pos + 1;

  while (end < chars.length) {
    if (chars[end] === quote) {
      return end + 1;
    }

    if (chars[end] === "\\" && end + 1 < chars.length) {
      end += 2;
    } else {
      end++;
    }
  }

  return end;
}

function parseNumberLiteral(chars: string[], pos: number): number | null {
  if (pos >= chars.length) {
    return null;
  }

  const afterDot = pos > 0 && chars[pos - 1] === ".";

  if (afterDot) {
    return null;
  }

  const char = chars[pos]!;

  if (char === "+" || char === "-") {
    if (char === "-" && startsWith(chars.join(""), pos, "-inf")) {
      const end = pos + 4;
      return symbolBoundaryAfter(chars, end) ? end : null;
    }

    const bodyEnd = parseNumberBody(chars, pos + 1);

    if (bodyEnd !== null) {
      return bodyEnd;
    }

    return null;
  }

  return parseNumberBody(chars, pos);
}

function scanSymbolLength(chars: string[], pos: number): number {
  if (pos >= chars.length || !isSymbol(chars[pos]!)) {
    return 0;
  }

  let end = pos;

  while (end < chars.length && isSymbol(chars[end]!)) {
    end++;
  }

  return end - pos;
}

function isDate(text: string): boolean {
  const dash1 = text.indexOf("-");

  if (dash1 <= 0) {
    return false;
  }

  const dash2 = text.indexOf("-", dash1 + 1);

  if (dash2 <= dash1 + 1) {
    return false;
  }

  return (
    text.length > 4 &&
    isDigits(text, 0, dash1) &&
    isDigits(text, dash1 + 1, dash2) &&
    isDigits(text, dash2 + 1, text.length)
  );
}

function isTime(text: string): boolean {
  return (
    text.length === 8 &&
    text[2] === ":" &&
    text[5] === ":" &&
    isDigits(text, 0, 2) &&
    isDigits(text, 3, 5) &&
    isDigits(text, 6, 8)
  );
}

function parseChronoLiteral(chars: string[], pos: number): number | null {
  const length = scanSymbolLength(chars, pos);

  if (length === 0) {
    return null;
  }

  const literal = chars.slice(pos, pos + length).join("");

  if (isDate(literal) || isTime(literal)) {
    return pos + length;
  }

  return null;
}

export function highlightLine(
  line: string,
  dictionaryWords?: ReadonlySet<string>,
): HighlightSpan[] {
  const chars = [...line];
  const spans: HighlightSpan[] = [];
  let pos = 0;

  while (pos < chars.length) {
    const commentEnd = scanComment(chars, pos);

    if (commentEnd !== null) {
      spans.push({
        start: pos,
        length: commentEnd - pos,
        kind: "comment",
      });
      break;
    }

    const stringEnd = scanStringLiteral(chars, pos);

    if (stringEnd !== null) {
      spans.push({
        start: pos,
        length: stringEnd - pos,
        kind: "string",
      });
      pos = stringEnd;
      continue;
    }

    const chronoEnd = parseChronoLiteral(chars, pos);

    if (chronoEnd !== null) {
      spans.push({
        start: pos,
        length: chronoEnd - pos,
        kind: "number",
      });
      pos = chronoEnd;
      continue;
    }

    const numberEnd = parseNumberLiteral(chars, pos);

    if (numberEnd !== null) {
      spans.push({
        start: pos,
        length: numberEnd - pos,
        kind: "number",
      });
      pos = numberEnd;
      continue;
    }

    if (isSeparator(chars[pos]!)) {
      spans.push({ start: pos, length: 1, kind: "delimiter" });
      pos++;
      continue;
    }

    const symbolLength = scanSymbolLength(chars, pos);

    if (symbolLength > 0) {
      const symbol = chars.slice(pos, pos + symbolLength).join("");

      if (dictionaryWords?.has(symbol)) {
        spans.push({
          start: pos,
          length: symbolLength,
          kind: "symbol",
        });
      }

      pos += symbolLength;
      continue;
    }

    pos++;
  }

  return spans;
}

export type HighlightSegment = {
  text: string;
  kind: HighlightKind | "default";
};

export function highlightSegments(
  line: string,
  dictionaryWords?: ReadonlySet<string>,
): HighlightSegment[] {
  const chars = [...line];
  const spans = highlightLine(line, dictionaryWords);

  if (spans.length === 0) {
    return line.length > 0 ? [{ text: line, kind: "default" }] : [];
  }

  const segments: HighlightSegment[] = [];
  let pos = 0;

  for (const span of spans) {
    if (span.start > pos) {
      segments.push({
        text: chars.slice(pos, span.start).join(""),
        kind: "default",
      });
    }

    segments.push({
      text: chars.slice(span.start, span.start + span.length).join(""),
      kind: span.kind,
    });
    pos = span.start + span.length;
  }

  if (pos < chars.length) {
    segments.push({
      text: chars.slice(pos).join(""),
      kind: "default",
    });
  }

  return segments;
}
