import { quote, processClaim } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const request = JSON.parse(input);
  let result: number;

  if (request.action === "quote") {
    result = quote(request.customer, request.items, request.options);
  } else if (request.action === "claim") {
    result = processClaim(request.item, request.damage);
  } else {
    process.stderr.write(`Unknown action: ${request.action}\n`);
    process.exit(1);
  }

  process.stdout.write(JSON.stringify({ result }) + "\n");
});
