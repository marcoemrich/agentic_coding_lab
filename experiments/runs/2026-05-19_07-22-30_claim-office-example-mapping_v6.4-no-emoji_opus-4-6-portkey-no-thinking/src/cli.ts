import { processScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

const main = async () => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err: any) {
    process.stderr.write(err.message + "\n");
    process.exit(1);
  }
};

main();
