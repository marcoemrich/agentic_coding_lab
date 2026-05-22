import { runScenario, Scenario } from "./claim-office.js";

const readStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
};

main().catch((err) => {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
});
