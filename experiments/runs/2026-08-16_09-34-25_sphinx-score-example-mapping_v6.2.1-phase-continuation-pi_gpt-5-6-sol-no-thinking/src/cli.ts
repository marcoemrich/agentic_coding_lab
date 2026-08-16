#!/usr/bin/env node
import { scoreSphinxes, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write(output: string): void };
};

interface ArmyInput {
  army: Card[];
}

const chunks: Uint8Array[] = [];
for await (const chunk of process.stdin) chunks.push(chunk);

const byteLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
const stdin = new Uint8Array(byteLength);
let offset = 0;
for (const chunk of chunks) {
  stdin.set(chunk, offset);
  offset += chunk.byteLength;
}

const input = JSON.parse(new TextDecoder().decode(stdin)) as ArmyInput;
process.stdout.write(`${JSON.stringify({ score: scoreSphinxes(input.army) })}\n`);
