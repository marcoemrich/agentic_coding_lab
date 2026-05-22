import { processScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    process.stdout.write(JSON.stringify(processScenario(scenario)));
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }
});
