#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

readStdin().then((raw) => {
  const input = JSON.parse(raw);
  const output = runScenario(input);
  process.stdout.write(JSON.stringify(output) + "\n");
});
