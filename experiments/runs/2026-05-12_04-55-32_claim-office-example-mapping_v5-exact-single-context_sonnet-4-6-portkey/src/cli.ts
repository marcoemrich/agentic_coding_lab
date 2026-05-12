import { quote, claim } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const request = JSON.parse(input);

let result: unknown;
if (request.operation === "quote") {
  result = quote(request.customer, request.items, request.previousContracts);
} else if (request.operation === "claim") {
  result = claim(request.policy, request.incident);
} else {
  result = { error: `Unknown operation: ${request.operation}` };
}

process.stdout.write(JSON.stringify(result) + "\n");
