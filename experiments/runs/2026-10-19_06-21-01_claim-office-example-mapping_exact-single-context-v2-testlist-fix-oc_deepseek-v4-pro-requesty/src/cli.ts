import { processScenario } from "./office.js";

function main(): void {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const scenario = JSON.parse(input);
      const result = processScenario(scenario);
      process.stdout.write(JSON.stringify(result));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    }
  });
}

main();