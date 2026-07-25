import { processScenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
  await new Promise<void>((resolve) => process.stdin.on("end", resolve));

  const input = JSON.parse(Buffer.concat(chunks).toString());

  try {
    const results = processScenario(input);
    console.log(JSON.stringify({ results }));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

main();
