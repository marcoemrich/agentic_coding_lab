import { runScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
};

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message ?? String(err)}\n`);
  process.exit(1);
});
