import { processScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = processScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
};

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
