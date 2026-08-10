#!/usr/bin/env node
import { ITEM_TYPES, processScenario, type ItemType, type Scenario } from "./claim-office.js";

function fail(message: string): never { throw new Error(message); }
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isInteger = (value: unknown): value is number => Number.isInteger(value);
const isItemType = (value: unknown): value is ItemType =>
  typeof value === "string" && (ITEM_TYPES as readonly string[]).includes(value);

function validateItem(value: unknown, context: string): void {
  if (!isRecord(value) || !isItemType(value.type)) fail(`${context} has an unknown or missing item type`);
  if (value.enchantment !== undefined && !isInteger(value.enchantment)) fail(`${context} enchantment must be an integer`);
  if (value.cursed !== undefined && typeof value.cursed !== "boolean") fail(`${context} cursed must be boolean`);
  if (value.material !== undefined && typeof value.material !== "string") fail(`${context} material must be a string`);
}

function validateQuote(step: Record<string, unknown>, context: string): void {
  const items = step.items;
  if (!Array.isArray(items)) fail(`${context} items must be an array`);
  items.forEach((item, index) => validateItem(item, `${context} item ${index}`));
}

function validateDamage(value: unknown, context: string): void {
  if (!isRecord(value) || !isItemType(value.itemType)) fail(`${context} has an unknown or missing item type`);
  if (!isInteger(value.amount) || value.amount < 0) fail(`${context} amount must be a non-negative integer`);
}

function validateClaim(step: Record<string, unknown>, context: string): void {
  if (!isInteger(step.policy) || step.policy < 0) fail(`${context} policy must be a non-negative integer`);
  const incident = step.incident;
  if (!isRecord(incident)) fail(`${context} incident must be an object`);
  if (typeof incident.cause !== "string") fail(`${context} cause must be a string`);
  const damages = incident.damages;
  if (!Array.isArray(damages)) fail(`${context} damages must be an array`);
  damages.forEach((damage, index) => validateDamage(damage, `${context} damage ${index}`));
}

function validateScenario(value: unknown): asserts value is Scenario {
  if (!isRecord(value)) fail("Invalid scenario");
  const customer = value.customer;
  const steps = value.steps;
  if (!isRecord(customer) || !Array.isArray(steps)) fail("Invalid scenario");
  if (!isInteger(customer.yearsWithMHPCO)) fail("yearsWithMHPCO must be an integer");
  steps.forEach((rawStep, index) => {
    const context = `Step ${index}`;
    if (!isRecord(rawStep)) fail(`${context} must be an object`);
    if (rawStep.op === "quote") validateQuote(rawStep, context);
    else if (rawStep.op === "claim") validateClaim(rawStep, context);
    else fail(`${context} has an unknown operation`);
  });
}

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  const input: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  validateScenario(input);
  process.stdout.write(`${JSON.stringify(processScenario(input))}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
});
