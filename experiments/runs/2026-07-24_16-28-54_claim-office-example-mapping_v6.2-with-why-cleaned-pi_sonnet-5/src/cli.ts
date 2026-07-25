import { computePremium } from "./quote.js";
import { computeClaim, computeInsuranceCap } from "./claim.js";
import type { Item, QuoteCustomer, Damage, ClaimResult } from "./types.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface PolicyRecord {
  items: Item[];
  remainingCap: number;
}

interface QuoteResult {
  premium: number;
}

type StepResult = QuoteResult | ClaimResult;

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

const processStep = (
  step: Step,
  customer: QuoteCustomer,
  policiesByStepIndex: Map<number, PolicyRecord>,
  stepIndex: number
): StepResult => {
  if (step.op === "quote") {
    const premium = computePremium(customer, step.items);
    policiesByStepIndex.set(stepIndex, { items: step.items, remainingCap: computeInsuranceCap(step.items) });
    return { premium };
  }
  const policy = policiesByStepIndex.get(step.policy)!;
  const result = computeClaim(policy.items, step.incident.damages, policy.remainingCap);
  policy.remainingCap = result.remainingCap;
  return result;
};

const main = async (): Promise<void> => {
  try {
    const input = JSON.parse(await readStdin());
    // isFollowUpContract is hardcoded to false: no step type yet signals a
    // follow-up contract, so every quote is treated as a new one. The
    // customer is built once, since it stays the same across every step.
    const customer: QuoteCustomer = {
      yearsWithMHPCO: input.customer.yearsWithMHPCO,
      isFollowUpContract: false,
    };
    const policiesByStepIndex = new Map<number, PolicyRecord>();
    const results = input.steps.map((step: Step, index: number) =>
      processStep(step, customer, policiesByStepIndex, index)
    );
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    // Explicit error reporting instead of relying on Node's default
    // unhandled-rejection behavior, which is implicit and version-dependent.
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
};

main();
