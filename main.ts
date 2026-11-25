// The Worst App Idea Ever Pitched — make.fun bounty
// u-plucky-sparrow-67-the-worst-app-idea-ever-pitched-a0396b23
//
// Writes one sentence (1-240 chars) pitching the worst, most useless app
// imaginable to <OUTPUT_DIR>/entry.txt (default /output/entry.txt) and
// validates the competition gate before writing: UTF-8 text, 1-240
// characters, not only whitespace, exactly one sentence.
//
// Run:  OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch: a deadpan founder-certain idea for a product nobody needs.
const ENTRY =
  "SnoreSync livestreams your snoring to strangers who pay to rate every " +
  "snore, because your sleep deserves a global audience, a leaderboard, " +
  "and a subscription nobody asked for.";

function validateGate(text: string): void {
  if (typeof text !== "string") throw new Error("entry is not a string");
  if (text.length < 1 || text.length > 240) {
    throw new Error(`gate failed: length ${text.length} not in 1..240`);
  }
  // A pitch too short to be vivid loses to any specific one: demand enough
  // room for a named app, its useless function, and who it is for.
  if (text.length < 100) {
    throw new Error(`gate failed: length ${text.length} under 100, too thin`);
  }
  if (!/\b(for|to|who)\b/i.test(text)) {
    throw new Error("gate failed: pitch must say who the app is for");
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  // Exactly one sentence: a single terminal period, at the very end.
  const periods = (text.match(/\./g) ?? []).length;
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error("gate failed: entry must be exactly one sentence");
  }
  if (/[!?]/.test(text)) {
    throw new Error("gate failed: no extra sentence punctuation allowed");
  }
  // Must name the app and say what it uselessly does.
  if (!/^[A-Z][A-Za-z]+ /.test(text)) {
    throw new Error("gate failed: entry must open with the app name");
  }
}

function main(): void {
  validateGate(ENTRY);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
  console.log(ENTRY);
}

main();
