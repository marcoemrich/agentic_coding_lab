import { calculatePremium } from "./quote.js";
import { calculatePayout } from "./claim.js";
import type { QuoteInput, QuoteItem } from "./quote.js";
import type { ClaimInput, PolicyItem } from "./claim.js";
import { readFileSync } from "node:fs";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

class CliValidationError extends Error {}

const validateItemType = (type: string): void => {
  if (!(type in INSURANCE_VALUES)) {
    throw new CliValidationError(`Unknown item type: "${type}"`);
  }
};

const STDIN_FD = 0;

const readStdin = (): string => {
  return readFileSync(STDIN_FD, "utf-8");
};

const toPolicyItems = (items: QuoteItem[]): PolicyItem[] =>
  items.map((item) => ({
    ...item,
    insuranceValue: INSURANCE_VALUES[item.type],
  }));

interface Policy {
  items: PolicyItem[];
}

interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { damages: ClaimInput["damages"] };
}

type ScenarioStep = QuoteStep | ClaimStep;

const processQuoteStep = (
  step: QuoteStep,
  customer: QuoteInput["customer"],
  policies: Policy[]
): { premium: number } => {
  for (const item of step.items) {
    validateItemType(item.type);
  }
  const quoteInput: QuoteInput = { customer, items: step.items };
  const premium = calculatePremium(quoteInput);
  policies.push({ items: toPolicyItems(step.items) });
  return { premium };
};

const countByType = (items: { type: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const validateDamages = (
  damages: ClaimInput["damages"],
  policy: Policy
): void => {
  const insuredCounts = countByType(policy.items);

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new CliValidationError(
        `Damage amount cannot be negative: ${damage.amount}`
      );
    }
    if (!insuredCounts.has(damage.itemType)) {
      throw new CliValidationError(
        `Damaged item type "${damage.itemType}" is not part of the referenced policy`
      );
    }
  }

  const damagedCounts = countByType(damages.map((d) => ({ type: d.itemType })));
  for (const [type, damagedCount] of damagedCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new CliValidationError(
        `Claim references ${damagedCount} "${type}" damages but only ${insuredCount} are insured`
      );
    }
  }
};

const processClaimStep = (step: ClaimStep, policies: Policy[]) => {
  const policy = policies[step.policy];
  validateDamages(step.incident.damages, policy);
  const claimInput: ClaimInput = {
    policy,
    damages: step.incident.damages,
  };
  return calculatePayout(claimInput);
};

const main = () => {
  try {
    const raw = readStdin();
    const scenario = JSON.parse(raw);

    const results: unknown[] = [];
    const policies: Policy[] = [];

    for (const step of scenario.steps as ScenarioStep[]) {
      if (step.op === "quote") {
        results.push(processQuoteStep(step, scenario.customer, policies));
      } else if (step.op === "claim") {
        results.push(processClaimStep(step, policies));
      }
    }

    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
};

main();
