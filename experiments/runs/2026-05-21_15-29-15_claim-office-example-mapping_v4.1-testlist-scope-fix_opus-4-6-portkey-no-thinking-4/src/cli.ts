import { claimOffice } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString());
  for (const step of input.steps) {
    step.type = step.op;
  }
  const results = claimOffice(input);
  process.stdout.write(JSON.stringify({ results }));
});
