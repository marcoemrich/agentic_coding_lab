import { quote, claim, type Item, type Incident, type QuoteResult } from "./claim-office.js";

interface Step {
  op: string;
  items: Item[];
  policy: number;
  incident: Incident;
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    const quotedPolicies: QuoteResult[] = [];
    const results = scenario.steps.map((step: Step, index: number) => {
      if (step.op === "claim") {
        const policy = quotedPolicies[step.policy];
        return claim(policy, step.incident);
      }
      const result = quote(scenario.customer, step.items, { followUp: false });
      quotedPolicies[index] = result;
      return { premium: result.premium };
    });
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    process.stderr.write(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
});
