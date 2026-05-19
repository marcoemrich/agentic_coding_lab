import { quote, claim } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));

  let result;
  if (input.action === "quote") {
    result = quote(input.items, input.customer);
  } else if (input.action === "claim") {
    result = claim(input.policy, input.incident);
  } else {
    process.stderr.write(`Unknown action: ${input.action}\n`);
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(result) + "\n");
});
