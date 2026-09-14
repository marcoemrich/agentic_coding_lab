import type { Scenario } from "./claim-office.js";

type JsonObject = Record<string, unknown>;

function object(value: unknown, name: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as JsonObject;
}

function optionalType(value: unknown, expected: string, name: string): void {
  if (value !== undefined && typeof value !== expected) {
    throw new Error(`${name} must be a ${expected}`);
  }
}

function item(value: unknown): void {
  const candidate = object(value, "item");
  if (typeof candidate.type !== "string") throw new Error("item.type must be a string");
  optionalType(candidate.material, "string", "item.material");
  optionalType(candidate.cursed, "boolean", "item.cursed");
  if (candidate.enchantment !== undefined && !Number.isInteger(candidate.enchantment)) {
    throw new Error("item.enchantment must be an integer");
  }
}

function damages(value: unknown): void {
  if (!Array.isArray(value)) throw new Error("incident.damages must be an array");
  for (const damageValue of value) {
    const damage = object(damageValue, "damage");
    if (typeof damage.itemType !== "string") throw new Error("damage.itemType must be a string");
    if (!Number.isInteger(damage.amount)) throw new Error("damage.amount must be an integer");
  }
}

function step(value: unknown): void {
  const candidate = object(value, "step");
  if (candidate.op === "quote") {
    if (!Array.isArray(candidate.items)) throw new Error("quote.items must be an array");
    candidate.items.forEach(item);
    return;
  }
  if (candidate.op !== "claim") throw new Error("step.op must be quote or claim");
  if (!Number.isInteger(candidate.policy)) throw new Error("claim.policy must be an integer");
  const incident = object(candidate.incident, "claim.incident");
  if (typeof incident.cause !== "string") throw new Error("incident.cause must be a string");
  damages(incident.damages);
}

export function parseScenario(json: string): Scenario {
  const candidate = object(JSON.parse(json), "scenario");
  const customer = object(candidate.customer, "customer");
  if (!Number.isInteger(customer.yearsWithMHPCO)) {
    throw new Error("customer.yearsWithMHPCO must be an integer");
  }
  if (!Array.isArray(candidate.steps)) throw new Error("scenario.steps must be an array");
  candidate.steps.forEach(step);
  return candidate as unknown as Scenario;
}
