import { claimOffice } from "./claim-office.js";

let inputData = "";

process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk: string) => {
  inputData += chunk;
});
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(inputData);
    const result = claimOffice(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
});
