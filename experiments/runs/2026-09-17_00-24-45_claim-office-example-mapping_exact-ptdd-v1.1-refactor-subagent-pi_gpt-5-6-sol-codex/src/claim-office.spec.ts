import { describe, expect, it } from "vitest";
// @ts-expect-error The kata intentionally has no Node declaration package.
import { spawnSync } from "node:child_process";
import { executeScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes each main-item price-list entry independently: sword 115 G, amulet 71 G, staff 93 G, potion 49 G on isolated first quotes", () => {
    const expectedPremiums = { sword: 115, amulet: 71, staff: 93, potion: 49 };

    for (const [type, premium] of Object.entries(expectedPremiums)) {
      expect(executeScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type }] }],
      })).toEqual({ results: [{ premium }] });
    }
  });
  it("quotes ordinary components at 25 G each: 2 runes have 50 G base premium and a 60 G first quote", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    })).toEqual({ results: [{ premium: 60 }] });
  });
  it("applies the exact-three block only at three alike components: 3/4/7 runes have 60/100/175 G base premiums", () => {
    const cases = [[3, 71], [4, 115], [7, 198]];

    for (const [count, premium] of cases) {
      expect(executeScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
      })).toEqual({ results: [{ premium }] });
    }
  });
  it("requires component type equality for a block: 2 runes plus 1 moonstone cost 75 G base and quote at 88 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    })).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices separate alike blocks independently: 3 runes plus 3 moonstones cost 120 G base and quote at 137 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ] }],
    })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the affected item: cursed sword plus plain amulet is 231 G after policy modifiers and fee", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet", cursed: false },
      ] }],
    })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years to the policy base premium: a plain sword quotes at 95 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies high-enchantment and curse surcharges together at exactly enchantment 5: sword quotes at 195 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but still applies curse: sword quotes at 165 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds the 10 percent first-insurance surcharge to every newly quoted item regardless of customer history: sword plus amulet quote at 149 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
    })).toEqual({ results: [{ premium: 149 }] });
  });
  it("discounts each contract after the first by 15 percent while retaining first-insurance surcharge: second-quote sword costs 100 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 100 }] });
  });
  it("quotes a newcomer cursed sword at 165 G including first-insurance surcharge and final fee", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a 3-year customer's second-contract cursed enchantment-7 sword at 160 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a 197.5 G final premium up to 198 G and preserves fractional intermediate amounts", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [
          { type: "sword", cursed: true, enchantment: 5 },
          { type: "rune" }, { type: "rune" },
        ] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 198 }] });
  });
  it("returns quote results in step order using the binding JSON output field premium", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "potion" }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 43 }] });
  });
  it("rejects an unknown quoted item type with non-zero status, stderr description, and no stdout results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item type/i);
    expect(result.stdout).toBe("");
  });

  it("reimburses a regular steel enchantment-3 sword damaged for 500 G at 400 G after one deductible", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("reimburses a rune damaged for 200 G at 100 G without item-specific clauses", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("applies one deductible per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("applies the 50 percent clause at exactly enchantment 8 even for dragon material: 1000 G damage pays 400 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "shattering", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("lets the 50 percent clause win for dragon enchantment 9: 1000 G damage pays 400 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("fully reimburses dragon material below enchantment 8: enchantment-5 damage of 800 G pays 700 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("halves steel enchantment-9 damage before deductible: 1000 G damage pays 400 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rounds a 350.5 G raw final payout down to 350 G while preserving fractional intermediate amounts", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("gives two insured swords a 4000 G cap and treats two sword damage entries as separate events with separate deductibles", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("rejects a whole claim when damage entries outnumber insured items of that type", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured/i);
    expect(result.stdout).toBe("");
  });
  it("sets sword-plus-amulet cap from their 1600 G insurance sum to 3200 G", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] });
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value rather than premium", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sets sword-plus-3-runes cap from 1750 G insurance value to 3500 G despite the premium block", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] });
  });
  it("tracks cap exhaustion across claims: successive 1500 G sword claims pay 1400 G then 600 G, leaving zero", () => {
    expect(executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    })).toEqual({ results: [
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });
  it("rejects damage to an item type absent from the policy with non-zero status and stderr description", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured/i);
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damaged item type with non-zero status and stderr description", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "mystery", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured/i);
    expect(result.stdout).toBe("");
  });
  it("rejects negative damage with non-zero status and stderr description", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage amount/i);
    expect(result.stdout).toBe("");
  });
  it("returns quote and claim results in input order with binding payout and remainingCap fields", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
