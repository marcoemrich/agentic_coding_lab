import { processScenario } from "./claim-office.js";

const KNOWN_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const input = JSON.parse(await readStdin());

  for (const step of input.steps) {
    if (step.op === "quote") {
      for (const item of step.items ?? []) {
        if (!KNOWN_TYPES.has(item.type)) {
          process.stderr.write(`Unknown item type: "${item.type}"\n`);
          process.exit(1);
        }
      }
    }
    if (step.op === "claim") {
      for (const damage of step.incident?.damages ?? []) {
        if (damage.amount < 0) {
          process.stderr.write(`Negative damage amount: ${damage.amount}\n`);
          process.exit(1);
        }
        if (!KNOWN_TYPES.has(damage.itemType)) {
          process.stderr.write(`Unknown item type in claim: "${damage.itemType}"\n`);
          process.exit(1);
        }
      }
    }
  }

  try {
    const result = processScenario(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err: unknown) {
    process.stderr.write((err as Error).message + "\n");
    process.exit(1);
  }
}

main();
