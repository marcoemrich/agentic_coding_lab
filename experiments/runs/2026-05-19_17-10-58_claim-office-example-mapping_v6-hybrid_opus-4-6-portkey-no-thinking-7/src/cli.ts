import { processScenario } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk: string) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

try {
  const scenario = JSON.parse(input);
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (err: any) {
  process.stderr.write(err.message + "\n");
  process.exit(1);
}
