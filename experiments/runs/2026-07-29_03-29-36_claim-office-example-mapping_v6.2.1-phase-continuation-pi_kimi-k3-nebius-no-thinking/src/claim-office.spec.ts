import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("empty item list yields premium 5 (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 5 }]);
  });
  it("single sword: base 100 + 10% first insurance + 5 fee = 115", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("single amulet: 60 + 6 + 5 = 71", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 71 }]);
  });
  it("single staff: 80 + 8 + 5 = 93", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 93 }]);
  });
  it("single potion: 40 + 4 + 5 = 49", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 49 }]);
  });
  it("single rune: 25 + 2.5 + 5 = 32.5 rounded up to 33", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 33 }]);
  });

  // --- Quote: component blocks ---
  it("two runes: 50 + 5 + 5 = 60", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 60 }]);
  });
  it("three runes form a block: 60 + 6 + 5 = 71", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 71 }]);
  });
  it("four runes: no block (block requires exactly 3), 100 + 10 + 5 = 115", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("seven runes: no block, 175 + 17.5 + 5 = 197.5 rounded up to 198", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual([{ premium: 198 }]);
  });
  it("two runes + one moonstone: no block (different types), 75 + 7.5 + 5 = 87.5 -> 88", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual([{ premium: 88 }]);
  });
  it("three runes + three moonstones: two separate blocks, 120 + 12 + 5 = 137", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("newcomer with cursed sword: 100 + 50 curse + 10 first insurance + 5 fee = 165", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment 4: no high-enchantment surcharge -> 115", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("sword with enchantment exactly 5: +30% -> 100 + 30 + 10 + 5 = 145", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 145 }]);
  });
  it("cursed sword with enchantment 5: both surcharges -> 100 + 50 + 30 + 10 + 5 = 195", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 195 }]);
  });
  it("cursed sword + plain amulet: curse applies to sword only -> 160 + 50 + 16 + 5 = 231", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", cursed: true },
          { type: "amulet", cursed: false },
        ],
      }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 231 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with 1 year: no loyalty discount -> 115", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("customer with exactly 2 years: -20% loyalty -> 100 + 10 - 20 + 5 = 95", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(scenario)).toEqual([{ premium: 95 }]);
  });
  it("second quote in scenario: -15% follow-up discount -> 100 + 10 - 15 + 5 = 100", () => {
    const quote = { op: "quote", items: [{ type: "sword" }] };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [quote, quote] };
    expect(processScenario(scenario)).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract (3 years, cursed sword ench 7) -> 160", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    // first quote: 40 + 4 - 8 loyalty + 5 = 41
    // second quote: 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160
    expect(processScenario(scenario)).toEqual([{ premium: 41 }, { premium: 160 }]);
  });

  // --- Claim: reimbursement rules ---
  it("claim: steel sword ench 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 33 },
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("claim: sword 500 + amulet 300 -> deductible per damaged item -> payout 600, remainingCap 2600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("claim: steel sword ench 9, damage 1000 -> 50% then deductible -> 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: dragon sword ench 5, damage 800 -> full reimbursement -> 700", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("claim: dragon sword ench 9, damage 1000 -> 50% rule wins -> 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: dragon sword ench exactly 8, damage 1000 -> 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: steel sword ench 8, damage 901 -> 350.5 rounded down to 350", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 350, remainingCap: 1650 },
    ]);
  });

  // --- Claim: insurance sum, cap, multiple items ---
  it("claim: cursed sword damage 1500 -> cap based on unmodified insurance value -> 1400, remainingCap 600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 165 },
      { payout: 1400, remainingCap: 600 },
    ]);
  });
  it("claim: sword + block of 3 runes -> insurance sum 1750, cap 3500 -> damage 1000 -> 900, remaining 2600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    // premium: base 100 + 60 block = 160 + 16 + 5 = 181; block does not affect insurance sum
    expect(processScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 900, remainingCap: 2600 },
    ]);
  });
  it("claim: two insured swords, two sword damage entries -> each own deductible -> 800, remainingCap 3200", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 225 },
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("cap exhaustion: two successive claims of 1500 -> 1400 (remaining 600), then 600 (remaining 0)", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    };
    expect(processScenario(scenario)).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- CLI end-to-end ---
  it("CLI: schema example -> premium 59; payout 100, remainingCap 1100", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  // --- CLI: error cases ---
  it("CLI: quote with unknown item type exits non-zero with stderr error and no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toContain("results");
  });
  it("CLI: claim for item not part of the policy exits non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("CLI: claim with unknown damage item type exits non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("CLI: more damage entries of a type than the policy covers exits non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("CLI: negative damage amount exits non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
});
