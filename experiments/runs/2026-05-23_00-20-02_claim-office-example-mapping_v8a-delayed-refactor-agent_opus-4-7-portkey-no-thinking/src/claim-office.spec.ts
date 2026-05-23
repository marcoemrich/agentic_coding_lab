import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario, Scenario } from "./claim-office.js";

function quote(items: object[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items: items as any }],
  };
  const out = processScenario(scenario);
  return (out.results[0] as { premium: number }).premium;
}

describe("Item base premiums (price list)", () => {
  it("sword: base premium 100 G (+ 5 G fee, with first insurance = 115)", () => {
    // 100 + 10 (first ins) + 5 fee = 115
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("amulet: base premium 60 G", () => {
    // 60 + 6 + 5 = 71
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("staff: base premium 80 G", () => {
    // 80 + 8 + 5 = 93
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("potion: base premium 40 G", () => {
    // 40 + 4 + 5 = 49
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("Component building blocks", () => {
  it("2 runes → 50 G base premium", () => {
    // base 50; first insurance +5; fee +5 → 60
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    // base 60; first ins +6; fee +5 → 71
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3 → 3+1 = 60+25=85? Actually spec says 100)", () => {
    // Spec: 4 runes → 100 G base (no block).
    // 100 + 10 + 5 = 115
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
    ])).toBe(115);
  });
  it("7 runes → 175 G base premium", () => {
    // 175 + 17.5 = 192.5 + 5 = 197.5 → rounds up to 198
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });
});

describe("'Alike' components clarification (❓)", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // 75 + 7.5 + 5 = 87.5 → 88
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ])).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // 120 + 12 + 5 = 137
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
});

describe("Modifier scope on multi-item policies (❓)", () => {
  it("cursed sword + plain amulet → base 160 G, +50 G curse → 210 G before further modifiers and fee", () => {
    // Newcomer (0 years), first contract:
    // policy base 160; curse +50 = 210; first ins +160*0.1=16; fee +5 → 231
    expect(quote([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ])).toBe(231);
  });

  it("policy-wide modifiers apply to policy base (loyalty, follow-up, first insurance)", () => {
    // sword + amulet, loyal customer (3 years), follow-up contract (contractIndex=1).
    // base 160; ench/curse 0; loyalty -160*0.2=-32; first ins +160*0.1=16; followup -160*0.15=-24
    // subtotal = 160 - 32 + 16 - 24 = 120; +5 = 125
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { premium: number }).premium).toBe(125);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword: base 100; loyalty -20; first ins +10 → 90; +5 = 95
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // base 100; ench +30; first ins +10 → 140; +5 = 145
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with exactly enchantment 5 AND cursed → both surcharges apply", () => {
    // base 100; ench +30; curse +50; first ins +10 → 190; +5 = 195
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // base 100; first ins +10 → 110; +5 = 115
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword with enchantment 4 cursed → curse surcharge only", () => {
    // base 100; curse +50; first ins +10 → 160; +5 = 165
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 → payout 400", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
});

describe("Deductible per damage event", () => {
  it("dragon attack damages insured sword (500) and amulet (300); payout = 600", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    };
    const out = processScenario(scenario);
    // (500-100) + (300-100) = 400+200 = 600
    expect((out.results[1] as { payout: number }).payout).toBe(600);
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, ench 3), damage 500 → payout 400", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
  it("damage to a rune (insurance value 250), damage 200 → payout 100", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(100);
  });
});

describe("Enchantment threshold vs dragon material", () => {
  it("dragon sword, ench 9, damage 1000 → payout 400 (50% wins then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
  it("dragon sword, ench 5, damage 800 → payout 700 (full reimburse then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 → payout 400 (50% then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
});

describe("Multiple items of the same type (❓)", () => {
  it("two swords → insurance sum 2000, cap 4000", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] } },
      ],
    };
    const out = processScenario(scenario);
    // remainingCap should equal 4000 - 0 = 4000 (payout 0 after deductible clamp)
    const claimResult = out.results[1] as { payout: number; remainingCap: number };
    expect(claimResult.remainingCap).toBe(4000);
  });
  it("two sword damages each get their own deductible", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    };
    const out = processScenario(scenario);
    // (500-100) + (500-100) = 800
    expect((out.results[1] as { payout: number }).payout).toBe(800);
  });
  it("more damages of a type than insured items → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
  });
});

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { remainingCap: number }).remainingCap).toBe(3200);
  });
  it("cursed sword → cap 2000 (based on unmodified insurance value); premium 165 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[0] as { premium: number }).premium).toBe(165);
    expect((out.results[1] as { remainingCap: number }).remainingCap).toBe(2000);
  });
  it("sword + 3 runes → insurance sum 1750", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { remainingCap: number }).remainingCap).toBe(3500);
  });
  it("two successive claims of 1500 each on sword (cap 2000) → 1400 then 600", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Rounding in the MHPCO's favor", () => {
  it("premium of 197.5 → rounded up to 198", () => {
    // 7 runes case (already verified above): 175 + 17.5 + 5 = 197.5 → 198
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("payout of 350.5 → rounded down to 350", () => {
    // dragon sword with high enchantment (≥8): 50% applies.
    // To get 350.5 after deductible: amount/2 - 100 = 350.5 → amount = 901
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { payout: number }).payout).toBe(350);
  });
});

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
  it("unknown item type in quote → CLI exits non-zero with stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim references damaged item not part of policy → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
  });
  it("claim references unknown item type in damages → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
  });
  it("damage with negative amount → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
  });
});

describe("Integration examples", () => {
  it("Newcomer with a cursed sword → 165 G", () => {
    // customer 0 years, 1st contract; cursed sword (steel, enchantment 3)
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    const out = processScenario(scenario);
    expect((out.results[0] as { premium: number }).premium).toBe(165);
  });
  it("Long-standing customer's second contract → 160 G", () => {
    // customer 3 years; second quote; cursed sword (steel, enchantment 7)
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }, // first quote (some item)
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    const out = processScenario(scenario);
    expect((out.results[1] as { premium: number }).premium).toBe(160);
  });
});

describe("CLI behavior (stdin/stdout)", () => {
  it("processes a scenario and writes results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty("premium");
    expect(out.results[1]).toHaveProperty("payout");
    expect(out.results[1]).toHaveProperty("remainingCap");
  });
});
