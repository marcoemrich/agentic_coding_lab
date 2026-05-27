import { processScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stderr.write(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
};

main();
