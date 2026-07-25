#!/usr/bin/env node
import { handleScenario } from "./claim-office.js";

const input = JSON.parse(await readStdin());
const result = handleScenario(input);
console.log(JSON.stringify(result));

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}
