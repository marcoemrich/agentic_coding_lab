import { processScenario } from "./claim-office.js";

function main(): void {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const parsed = JSON.parse(input);
      const result = processScenario(parsed);
      console.log(JSON.stringify(result));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(message + "\n");
      process.exit(1);
    }
  });
}

main();
