import { processScenario } from "./engine.js";

export async function main(input: string): Promise<string> {
  const scenario = JSON.parse(input);
  const results = processScenario(scenario);
  return JSON.stringify({ results });
}

// When run directly (not in tests), read from stdin
if (
  import.meta.url === new URL(import.meta.url).href &&
  typeof process !== "undefined" &&
  !process.env.VITEST
) {
  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });
  process.stdin.on("end", async () => {
    try {
      const output = await main(data);
      process.stdout.write(output);
    } catch (error: any) {
      process.stderr.write(error.message || String(error));
      process.exit(1);
    }
  });
}
