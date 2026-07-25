import { describe, it, expect } from "vitest";
import { executeScenario } from "./scenario.js";

describe("Scenario orchestration", () => {
  it("multi-step: quote amulet (5 years) then claim by policy index 0 -> [{premium:59},{payout:100,remainingCap:1100}]", () => {
    const results = executeScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("follow-up contract: two sword quotes (0 years) -> second quote gets 15% follow-up discount [{premium:115},{premium:100}]", () => {
    const results = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
});
