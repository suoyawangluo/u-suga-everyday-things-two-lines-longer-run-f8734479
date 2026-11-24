// Everyday Things, Two Lines — make.fun entry
// u-suga-everyday-things-two-lines-longer-run-f8734479
//
// Line 1 explains one everyday thing (a traffic jam) to a 10-year-old in a
// single vivid sentence built on one analogy. Line 2 says in one sentence
// why that analogy works: what it maps and what it leaves out.
//
// The entry is fixed text: the program's only job is to write it to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt) exactly as written,
// so the judge sees the same two lines on every run.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "A traffic jam is a zipper stuck halfway, with every car a tooth that cannot slide past the one in front of it.";
const LINE_2 =
  "It maps the way cars lock together nose to tail and nothing moves until the jam ahead opens, but it leaves out that a real zipper has a slider to pull it open, while a jam has no slider at all, only time.";

const ENTRY = `${LINE_1}\n${LINE_2}\n`;

// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text of
// 1 to 400 characters, not only white space. The brief also wants exactly
// two lines: one sentence explaining the thing, one sentence on the mapping.
function checkGate(text: string): { chars: number; sha256: string } {
  const chars = [...text].length;
  if (chars < 1 || chars > 400) {
    throw new Error(`gate: ${chars} code points, want 1-400`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  const lines = text.trimEnd().split("\n");
  if (lines.length !== 2) {
    throw new Error(`gate: ${lines.length} lines, want exactly 2`);
  }
  for (const [i, line] of lines.entries()) {
    if (line.trim().length === 0) throw new Error(`gate: line ${i + 1} is empty`);
    // One sentence per line: exactly one sentence-ending mark, at the end.
    const ends = (line.match(/[.!?]/g) ?? []).length;
    if (ends !== 1 || !/[.!?]$/.test(line)) {
      throw new Error(`gate: line ${i + 1} is not a single sentence`);
    }
  }
  const sha256 = createHash("sha256").update(text, "utf8").digest("hex");
  return { chars, sha256 };
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  // Read back and verify byte-for-byte, then run the gate on what is on disk.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) throw new Error("read-back mismatch");
  const { chars, sha256 } = checkGate(back);
  console.log(`wrote ${outPath} (${chars} code points, sha256 ${sha256}), verified`);
  console.log(`line 1 (${[...LINE_1].length} chars): ${LINE_1}`);
  console.log(`line 2 (${[...LINE_2].length} chars): ${LINE_2}`);
}

main();
