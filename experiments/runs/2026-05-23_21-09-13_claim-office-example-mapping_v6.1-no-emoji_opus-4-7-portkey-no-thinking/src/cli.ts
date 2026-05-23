import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

try {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
} catch (err) {
  process.stderr.write(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
