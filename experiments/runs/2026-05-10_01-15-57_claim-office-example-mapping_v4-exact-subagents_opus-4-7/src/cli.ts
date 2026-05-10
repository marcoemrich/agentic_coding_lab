import { readFileSync } from "node:fs";
import { quote, claim } from "./claim-office.js";

type Item = { type: string; material: string; enchantment: number; cursed: boolean };
type Damage = { itemType: string; amount: number };
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const STDIN_FD = 0;

const scenario: Scenario = JSON.parse(readFileSync(STDIN_FD, "utf-8"));
const { yearsWithMHPCO } = scenario.customer;

const findPolicyItems = (policyIndex: number): Item[] => {
  const policyStep = scenario.steps[policyIndex];
  return policyStep.op === "quote" ? policyStep.items : [];
};

const hasPriorQuote = (index: number): boolean =>
  scenario.steps.slice(0, index).some((step) => step.op === "quote");

const processStep = (step: Step, index: number): object => {
  if (step.op === "quote") {
    const applyFollowUpDiscount = hasPriorQuote(index);
    return { premium: quote({ yearsWithMHPCO, items: step.items, applyFirstInsurance: true, applyFollowUpDiscount }) };
  }
  return claim({ items: findPolicyItems(step.policy), damages: step.incident.damages });
};

const results = scenario.steps.map(processStep);
process.stdout.write(JSON.stringify({ results }));
