import { processScenario } from "./claim-office.js";

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  try {
    const scenario = JSON.parse(input);
    const out = processScenario(scenario);
    process.stdout.write(JSON.stringify(out) + "\n");
    process.exit(0);
  } catch (e) {
    process.stderr.write(String(e instanceof Error ? e.message : e) + "\n");
    process.exit(1);
  }
}

main();
