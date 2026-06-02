import { fileURLToPath } from "node:url";
import { runScenario, type Scenario } from "./claim-office.js";

export const runCli = (input: string): string => {
  const scenario = JSON.parse(input) as Scenario;
  return JSON.stringify(runScenario(scenario));
};

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      buf += chunk;
    });
    process.stdin.on("end", () => resolve(buf));
  });

const isEntryPoint =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isEntryPoint) {
  readStdin().then((input) => {
    process.stdout.write(runCli(input));
  });
}
