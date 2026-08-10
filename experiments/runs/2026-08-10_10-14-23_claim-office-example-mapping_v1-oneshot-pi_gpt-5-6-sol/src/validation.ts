import { ITEM_TYPES, type Item, type ItemType, type Scenario, type Step } from "./claim-office.js";

const typeSet = new Set<string>(ITEM_TYPES);
const object = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected an object");
  }
  return value as Record<string, unknown>;
};

const integer = (value: unknown, field: string): number => {
  if (!Number.isInteger(value)) throw new Error(`${field} must be an integer`);
  return value as number;
};

const string = (value: unknown, field: string): string => {
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  return value;
};

function itemType(value: unknown, field: string): ItemType {
  const valueAsString = string(value, field);
  if (!typeSet.has(valueAsString)) throw new Error(`Unknown item type: ${valueAsString}`);
  return valueAsString as ItemType;
}

function optionalFields(source: Record<string, unknown>, item: Item): void {
  if (source.material !== undefined) item.material = string(source.material, "material");
  if (source.enchantment !== undefined) item.enchantment = integer(source.enchantment, "enchantment");
  if (source.cursed !== undefined) {
    if (typeof source.cursed !== "boolean") throw new Error("cursed must be a boolean");
    item.cursed = source.cursed;
  }
}

function parseItem(value: unknown): Item {
  const source = object(value);
  const item: Item = { type: itemType(source.type, "item.type") };
  optionalFields(source, item);
  return item;
}

function parseQuote(source: Record<string, unknown>): Step {
  if (!Array.isArray(source.items)) throw new Error("quote.items must be an array");
  return { op: "quote", items: source.items.map(parseItem) };
}

function parseDamage(value: unknown): { itemType: ItemType; amount: number } {
  const source = object(value);
  const amount = integer(source.amount, "damage.amount");
  if (amount < 0) throw new Error("damage.amount must not be negative");
  return { itemType: itemType(source.itemType, "damage.itemType"), amount };
}

function parseClaim(source: Record<string, unknown>): Step {
  const incident = object(source.incident);
  const cause = string(incident.cause, "incident.cause");
  if (!Array.isArray(incident.damages)) throw new Error("incident.damages must be an array");
  return {
    op: "claim",
    policy: integer(source.policy, "claim.policy"),
    incident: { cause, damages: incident.damages.map(parseDamage) },
  };
}

function parseStep(value: unknown): Step {
  const source = object(value);
  if (source.op === "quote") return parseQuote(source);
  if (source.op === "claim") return parseClaim(source);
  throw new Error("step.op must be quote or claim");
}

export function parseScenario(value: unknown): Scenario {
  const source = object(value);
  const customer = object(source.customer);
  if (!Array.isArray(source.steps)) throw new Error("steps must be an array");
  return {
    customer: { yearsWithMHPCO: integer(customer.yearsWithMHPCO, "customer.yearsWithMHPCO") },
    steps: source.steps.map(parseStep),
  };
}
