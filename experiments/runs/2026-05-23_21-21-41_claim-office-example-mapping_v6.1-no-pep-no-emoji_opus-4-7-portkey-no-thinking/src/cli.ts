import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
  });

const main = async () => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stderr.write(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
};

main();
