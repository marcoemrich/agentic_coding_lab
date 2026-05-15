import { runScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
};

main();
