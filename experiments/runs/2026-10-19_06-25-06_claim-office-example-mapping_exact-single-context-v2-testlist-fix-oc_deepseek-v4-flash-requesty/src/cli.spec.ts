import { describe, it, expect } from "vitest";
import { runScenario } from "./insurance.js";

describe("CLI scenario processing", () => {
  it.todo("schema example: 5-year customer quotes an amulet then claims fire damage 200 -> premium, payout 100, remainingCap 1100");
  it.todo("quote then claim: outputs premium, then payout and remainingCap in order");
  it.todo("quote with an unknown item type (e.g. broomstick) -> exits non-zero with error to stderr, no results on stdout");
  it.todo("claim references an item not in the policy (amulet damaged, only sword insured) -> exits non-zero, error to stderr");
  it.todo("claim contains a damage entry with amount -200 -> exits non-zero, error to stderr");
  it.todo("damages array has more entries of a type than the policy covers -> exits non-zero, whole claim rejected");
});