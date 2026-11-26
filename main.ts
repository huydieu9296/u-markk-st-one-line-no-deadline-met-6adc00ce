// One Line, No Deadline Met — make.fun entry program.
// It holds the entry text, checks it against the bounty limits, and
// writes it to $MAKEFUN_OUTPUT_DIR/entry.txt for the grader.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = `I handed the deadline to Future Me, and Future Me just filed for an extension.`;
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function reject(problem: string): never {
  console.error(`entry rejected: ${problem}`);
  process.exit(1);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function countSentences(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter((part) => part.length > 0).length;
}

const entry = ENTRY.trim();
const words = countWords(entry);
const sentences = countSentences(entry);
if (entry.length < MIN_CHARS) reject(`only ${entry.length} characters, need at least ${MIN_CHARS}`);
if (entry.length > MAX_CHARS) reject(`${entry.length} characters, over the ${MAX_CHARS} limit`);
if (entry !== ENTRY) reject("entry has leading or trailing whitespace");
if (words < 1) reject("entry has no words");
if (sentences < 1) reject("entry has no sentence");
if (sentences !== 1) reject(`entry has ${sentences} sentences, need exactly 1`);
if (/[\u0000-\u001f\u007f]/.test(entry)) reject("entry contains control characters");

const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(destinationDir, { recursive: true });
const entryOutPath = join(destinationDir, "entry.txt");
writeFileSync(entryOutPath, `${entry}\n`, "utf8");
const writtenBack = readFileSync(entryOutPath, "utf8");
if (writtenBack !== `${entry}\n`) reject("entry.txt does not match the entry after writing");
console.log(`wrote ${entry.length} characters (${words} words, ${sentences} sentences) to ${entryOutPath}`);
