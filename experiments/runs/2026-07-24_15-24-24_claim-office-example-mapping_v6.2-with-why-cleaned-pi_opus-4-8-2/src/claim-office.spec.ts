import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest / edge ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums per main item (base + fee, newcomer adds first-insurance) ---
  // We isolate base premium behaviour using a long-standing? No: newcomer has first-insurance surcharge.
  // Keep base-premium tests via multi-modifier integration; but list per-item base values.
  it("single sword base premium 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100 + 10% first insurance (10) + 5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet base premium 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    // 60 + 10% first insurance (6) + 5 fee = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff base premium 80 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    // 80 + 10% (8) + 5 = 93
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion base premium 40 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    // 40 + 10% (4) + 5 = 49
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Components and building blocks ---
  it("2 runes -> 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 2*25 = 50; +10% (5) + 5 fee = 60
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // block of 3 alike -> base 60; +10% (6) + 5 fee = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block, requires exactly 3)", () => {
    const items = Array(4).fill({ type: "rune" });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 4 runes = 100 base (no block); +10% (10) + 5 = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const items = Array(7).fill({ type: "rune" });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 7 runes = 175 base (no block, only exactly-3 blocks); +10% (17.5)=192.5 ceil + 5 = 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // no block (types differ): 3*25 = 75 base; +10% (7.5)=82.5 ceil 83 + 5 = 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const items = [
      ...Array(3).fill({ type: "rune" }),
      ...Array(3).fill({ type: "moonstone" }),
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // two blocks: 60 + 60 = 120 base; +10% (12) + 5 = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds 50% risk surcharge of item base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
      ],
    });
    // base 100 + curse (50% of item base = 50) + first insurance (10% of policy base 100 = 10) = 160; +5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted item (enchantment >= 5) adds 30% surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 6 }] },
      ],
    });
    // base 100 + high enchant (30% of 100 = 30) + first insurance (10) = 140; +5 = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // base 100 + high enchant 30 + first insurance 10 = 140; +5 = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    // base 100 + first insurance 10 = 110; +5 = 115 (no surcharge)
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("long-standing customer (>= 2 years) receives 20% loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100 - loyalty (20% of 100 = 20) + first insurance 10 = 90; +5 = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100 - loyalty 20 + first insurance 10 = 90; +5 = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance carries 10% initial assessment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    // base 60 + first insurance (10% of 60 = 6) = 66; +5 = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("follow-up contract (each after first) gets 15% discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // first quote: base 100 + first insurance 10 = 110; +5 = 115
    // second quote (follow-up): base 100 + first insurance 10 - follow-up (15% of 100 = 15) = 95; +5 = 100
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> 210 G before further modifiers and fee (curse applies to item base only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    // policy base 160 + curse (50% of sword base 100 = 50) = 210 before further modifiers
    // loyalty (20% of 160 = 32) discount, first insurance (10% of 160 = 16)
    // 210 - 32 + 16 = 194; +5 = 199
    expect(result.results[0]).toEqual({ premium: 199 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // 7 runes: base 175 + first insurance 17.5 = 192.5; + 5 fee = 197.5 -> rounds up to 198
    const items = Array(7).fill({ type: "rune" });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    // ench 8 -> 50% of 901 = 450.5, then deductible 100 = 350.5 -> rounds down to 350
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract cursed sword (steel, ench 7) -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // second quote: 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 remaining 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250), damage 200 -> payout 100 (deductible, no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    // full reimbursement 200 - 100 = 100; cap = 250*2 = 500 remaining 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon sword, ench 8, damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // ench 8 -> 50% clause: 500, then deductible 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, ench 9, damage 1000 -> payout 400 (both clauses, 50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // both clauses; 50% wins: 500 then deductible 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, ench 5, damage 800 -> payout 700 (dragon full, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    // dragon material -> full reimbursement 800, then deductible 100 = 700
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 -> payout 400 (high-enchant 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // ench 9 -> 50%: 500 then deductible 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
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
    });
    // (500-100) + (300-100) = 400 + 200 = 600; insurance sum 1600 cap 3200 remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords -> insurance sum 2000, cap 4000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // insurance sum 2000, cap 4000; claim 200-100=100 -> remaining 3900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("dragon attack damages both swords, each entry separate deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
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
    });
    // two separate deductibles: (500-100)*2 = 800; cap 4000 remaining 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damage entries of a type than covered -> claim rejected (non-zero exit)", () => {
    expect(() =>
      runScenario({
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
      })
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword + amulet -> insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // insurance sum 1000+600=1600, cap 3200; payout 100 -> remaining 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword (premium 165) -> cap 2000 (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // premium 165; cap based on insurance value 1000 -> 2000; payout 100 remaining 1900
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes block -> insurance sum 1750 (block affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // insurance sum 1000 + 3*250 = 1750, cap 3500; payout 100 remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000; two claims 1500 each -> payout 1400 remaining 600, then payout 600 remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    // cap 2000; first: 1500-100=1400 remaining 600; second: 1400 desired reduced to 600 remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- CLI-level error cases ---
  it("quote with unknown item type -> CLI exits non-zero, error to stderr, no results", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).toBe("");
  });
  it("claim references item not in policy -> CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
  });
  it("claim damage with amount -200 -> CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
  });
});
