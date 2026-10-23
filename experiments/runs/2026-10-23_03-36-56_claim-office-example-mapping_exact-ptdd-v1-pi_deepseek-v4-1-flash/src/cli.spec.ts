import { describe, expect, it } from "vitest";
import { runScenario } from "./cli.js";

describe("claim-office CLI", () => {
  it("writes a quote result with the premium for a single-step scenario -- amulet, 5 years, premium 59 G (loyalty applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 59 }] });
  });
  it.todo("writes a claim result with payout and remainingCap for a two-step scenario -- amulet premium 59 G, damage 200 G yields payout 100 G and remainingCap 1100 G");
  it.todo("writes one result per step in input order -- quote, quote, claim yields three results in that order");
  it.todo("rejects a quote item with an unknown type -- non-zero exit status, error description on stderr, no results on stdout");
  it.todo("rejects a claim whose damage item is not part of the policy -- non-zero exit status, error description on stderr");
  it.todo("rejects a claim whose damage item type is unknown -- non-zero exit status, error description on stderr");
  it.todo("rejects a claim with a negative damage amount -- non-zero exit status, error description on stderr");
  it.todo("rejects a claim with more damage entries of a type than the policy covers -- non-zero exit status, error description on stderr");
  it.todo("processes the newcomer cursed sword integration example -- premium 165 G");
  it.todo("processes the long-standing customer's second contract integration example -- first quote 175 G, second quote 160 G");
  it.todo("processes the schema example scenario -- amulet premium 59 G, then claim payout 100 G and remainingCap 1100 G");
});
