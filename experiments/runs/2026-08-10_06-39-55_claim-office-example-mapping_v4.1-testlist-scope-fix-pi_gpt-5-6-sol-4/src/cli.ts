import { pathToFileURL } from "node:url";
import {
  calculatePolicyPremium,
  ITEM_TYPES,
  payoutCap,
  processClaim,
  type ClaimDamage,
  type Item,
  type ItemType,
} from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: ClaimDamage[] };
}

type ScenarioStep = QuoteStep | ClaimStep;
interface CliInput {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
}

export interface CliExecutionResult {
  status: number;
  stdout: string;
  stderr: string;
}

const ITEM_TYPE_SET: ReadonlySet<string> = new Set(ITEM_TYPES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, description: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${description} must be an object`);
  return value;
}

function requireString(value: unknown, description: string): string {
  if (typeof value !== "string") throw new Error(`${description} must be a string`);
  return value;
}

function requireInteger(value: unknown, description: string): number {
  if (!Number.isInteger(value)) throw new Error(`${description} must be an integer`);
  return value as number;
}

function requireItemType(value: unknown, description: string): ItemType {
  const type = requireString(value, description);
  if (!ITEM_TYPE_SET.has(type)) throw new Error(`Unknown item type: ${type}`);
  return type as ItemType;
}

function validateOptionalItemFields(raw: Record<string, unknown>, description: string): void {
  if (raw.material !== undefined && typeof raw.material !== "string") {
    throw new Error(`${description}.material must be a string`);
  }
  if (raw.enchantment !== undefined && !Number.isInteger(raw.enchantment)) {
    throw new Error(`${description}.enchantment must be an integer`);
  }
  if (raw.cursed !== undefined && typeof raw.cursed !== "boolean") {
    throw new Error(`${description}.cursed must be a boolean`);
  }
}

function validateItem(value: unknown, description: string): Item {
  const raw = requireRecord(value, description);
  const type = requireItemType(raw.type, `${description}.type`);
  validateOptionalItemFields(raw, description);
  return {
    type,
    ...(raw.material !== undefined ? { material: raw.material as string } : {}),
    ...(raw.enchantment !== undefined ? { enchantment: raw.enchantment as number } : {}),
    ...(raw.cursed !== undefined ? { cursed: raw.cursed as boolean } : {}),
  };
}

function validateQuoteStep(raw: Record<string, unknown>, index: number): QuoteStep {
  if (!Array.isArray(raw.items)) throw new Error(`steps[${index}].items must be an array`);
  return {
    op: "quote",
    items: raw.items.map((item, itemIndex) =>
      validateItem(item, `steps[${index}].items[${itemIndex}]`)),
  };
}

function validateClaimStep(raw: Record<string, unknown>, index: number): ClaimStep {
  const policy = requireInteger(raw.policy, `steps[${index}].policy`);
  const incident = requireRecord(raw.incident, `steps[${index}].incident`);
  const cause = requireString(incident.cause, `steps[${index}].incident.cause`);
  if (!Array.isArray(incident.damages)) {
    throw new Error(`steps[${index}].incident.damages must be an array`);
  }
  const damages = incident.damages.map((value, damageIndex): ClaimDamage => {
    const description = `steps[${index}].incident.damages[${damageIndex}]`;
    const damage = requireRecord(value, description);
    const amount = requireInteger(damage.amount, `${description}.amount`);
    if (amount < 0) throw new Error(`${description}.amount must not be negative`);
    return {
      itemType: requireItemType(damage.itemType, `${description}.itemType`),
      amount,
    };
  });
  return { op: "claim", policy, incident: { cause, damages } };
}

function validateInput(value: unknown): CliInput {
  const raw = requireRecord(value, "input");
  const customer = requireRecord(raw.customer, "customer");
  const yearsWithMHPCO = requireInteger(customer.yearsWithMHPCO, "customer.yearsWithMHPCO");
  if (!Array.isArray(raw.steps)) throw new Error("steps must be an array");

  const steps = raw.steps.map((value, index): ScenarioStep => {
    const step = requireRecord(value, `steps[${index}]`);
    const op = requireString(step.op, `steps[${index}].op`);
    if (op === "quote") return validateQuoteStep(step, index);
    if (op === "claim") return validateClaimStep(step, index);
    throw new Error(`steps[${index}].op must be quote or claim`);
  });
  return { customer: { yearsWithMHPCO }, steps };
}

function processInput(input: CliInput): string {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let previousQuoteContracts = 0;
  const results = input.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const result = {
        premium: calculatePolicyPremium(
          step.items,
          input.customer.yearsWithMHPCO,
          previousQuoteContracts,
        ),
      };
      policies.set(stepIndex, { items: step.items, remainingCap: payoutCap(step.items) });
      previousQuoteContracts += 1;
      return result;
    }

    const policy = policies.get(step.policy);
    if (!policy || step.policy >= stepIndex) {
      throw new Error("Policy index must identify an earlier quote step");
    }
    const claim = processClaim(policy.items, step.incident.damages, policy.remainingCap);
    policy.remainingCap = claim.remainingCap;
    return claim;
  });
  return JSON.stringify({ results });
}

export function runCliWithStatus(serializedInput: string): CliExecutionResult {
  try {
    const input = validateInput(JSON.parse(serializedInput) as unknown);
    return { status: 0, stdout: processInput(input), stderr: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: 1, stdout: "", stderr: message };
  }
}

export function runCli(serializedInput: string): string {
  const result = runCliWithStatus(serializedInput);
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}

async function main(): Promise<void> {
  let stdin = "";
  for await (const chunk of process.stdin) stdin += String(chunk);
  const result = runCliWithStatus(stdin);
  if (result.stdout) process.stdout.write(`${result.stdout}\n`);
  if (result.stderr) process.stderr.write(`${result.stderr}\n`);
  process.exitCode = result.status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
