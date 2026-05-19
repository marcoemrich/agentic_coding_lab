import { quote } from "./claim-office.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const input = JSON.parse(await readStdin());
  const steps: unknown[] = Array.isArray(input) ? input : [input];
  const results: unknown[] = [];

  for (const step of steps) {
    const { action, customer, items, isFollowUp } = step as {
      action: string;
      customer: unknown;
      items: unknown[];
      isFollowUp?: boolean;
    };

    if (action === "quote") {
      results.push(quote(customer, items, isFollowUp ?? false));
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  }

  process.stdout.write(JSON.stringify(results) + "\n");
}

main().catch((err: Error) => {
  process.stderr.write(err.message + "\n");
  process.exitCode = 1;
});
