import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

const run = (steps: Scenario["steps"], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps }).results;

describe("claim office", () => {
  it("prices exact component blocks and an empty policy", () => {
    expect(run([{ op: "quote", items: [] }])).toEqual([{ premium: 5 }]);
    expect(run([{ op: "quote", items: ["rune", "rune", "rune"].map((type) => ({ type: type as "rune" })) }]))
      .toEqual([{ premium: 71 }]);
    expect(run([{ op: "quote", items: ["rune", "rune", "moonstone"].map((type) => ({ type: type as "rune" | "moonstone" })) }]))
      .toEqual([{ premium: 88 }]);
  });

  it("combines item and policy modifiers", () => {
    expect(run([{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }]))
      .toEqual([{ premium: 165 }]);
    const items = [{ type: "amulet" as const }];
    expect(run([{ op: "quote", items }, { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }], 3))
      .toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  it("applies special reimbursement, deductibles, and cumulative cap", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 }] } },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 4000 }] } },
    ];
    expect(run(steps)).toEqual([
      { premium: 211 },
      { payout: 600, remainingCap: 2600 },
      { payout: 1900, remainingCap: 700 },
    ]);
  });

  it("rejects excess damages for an insured type", () => {
    expect(() => run([
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ])).toThrow(/uninsured/);
  });
});
