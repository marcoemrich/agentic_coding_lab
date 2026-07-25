import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for main items (single item, no modifiers, newcomer 0 years) ---
  // Note: a single-item quote for a newcomer includes +10% first-insurance and +5 fee.
  // We isolate base-premium behaviour via the integration/edge tests below.

  // --- Edge: empty item list ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(res.results[0]).toEqual({ premium: 5 });
  });

  // --- Component blocks (base premium examples) ---
  it("2 runes -> 50 G base premium", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + first-insurance 10% (5) + fee 5 = 60
    expect(res.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // block base 60 + first-insurance 10% (6) + fee 5 = 71
    expect(res.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block; needs exactly 3)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // no block: 4*25=100 + first-insurance 10 + fee 5 = 115
    expect(res.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    // 7*25=175 + first-insurance 17.5 + fee 5 = 197.5 -> ceil 198
    expect(res.results[0]).toEqual({ premium: 198 });
  });

  // --- 'Alike' components ---
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // 3*25=75 (no block) + first-insurance 7.5 + fee 5 = 87.5 -> ceil 88
    expect(res.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    // two blocks: 60+60=120 + first-insurance 12 + fee 5 = 137
    expect(res.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100) + plain amulet (60) -> 210 G before further modifiers and fee", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    // policy base 160 + curse 50 (item-specific) = 210; + first-insurance 10% of 160 (16) + fee 5 = 231
    expect(res.results[0]).toEqual({ premium: 231 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100 - loyalty 20 (20% of 100) + first-insurance 10 + fee 5 = 95
    expect(res.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // base 100 + high-ench 30 (30% of 100) + first-insurance 10 + fee 5 = 145
    expect(res.results[0]).toEqual({ premium: 145 });
  });
  it("cursed sword with enchantment 5 -> both curse and high-enchantment surcharges apply", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    // base 100 + curse 50 + high-ench 30 + first-insurance 10 + fee 5 = 195
    expect(res.results[0]).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    // base 100 + first-insurance 10 + fee 5 = 115 (no high-ench)
    expect(res.results[0]).toEqual({ premium: 115 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(res.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract, cursed sword ench 7 -> premium 160 G", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // 2nd contract: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance
    //   - 15 follow-up = 155 + 5 fee = 160
    expect(res.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    // 175 + 17.5 + 5 = 197.5 -> rounded up to 198
    expect(res.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // high-ench (>=8): 901*0.5 = 450.5, - 100 deductible = 350.5 -> floor 350
    expect(res.results[1]).toEqual({ payout: 350, remainingCap: 2000 - 350 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (full minus deductible)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(res.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (value 250), damage 200 -> payout 100 (no special clause)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // cap = 250*2 = 500; 200 - 100 deductible = 100; remaining 400
    expect(res.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high enchantment / dragon material ---
  it("steel sword, ench 9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // 1000*0.5=500 - 100 = 400; cap 2000, remaining 1600
    expect(res.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 5, damage 800 -> payout 700 (full then deductible)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    // dragon: full reimbursement 800 - 100 = 700; cap 2000, remaining 1300
    expect(res.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, ench 9, damage 1000 -> payout 400 (50% rule wins)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // both clauses; 50% wins: 1000*0.5=500 - 100 = 400; remaining 1600
    expect(res.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 8, damage 1000 -> payout 400 (high-ench clause then deductible)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // ench 8 -> 50% clause applies: 500 - 100 = 400; remaining 1600
    expect(res.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("sword (500) and amulet (300) damaged -> payout 600 (deductible per item)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    // (500-100) + (300-100) = 600; cap (1000+600)*2=3200, remaining 2600
    expect(res.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("policy with two swords -> insurance sum 2000, both swords damaged handled separately", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    // cap = 2000*2 = 4000; each: 500-100=400, total 800; remaining 3200
    expect(res.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more sword damages than swords insured -> claim rejected (non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      }),
    ).toThrow();
  });

  // --- Cap ---
  it("policy sword + amulet -> insurance sum 1600, cap 3200", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    // cap = (1000+600)*2 = 3200; payout 300-100=200; remaining 3000
    expect(res.results[1]).toEqual({ payout: 200, remainingCap: 3000 });
  });
  it("cursed sword -> cap 2000 (based on unmodified insurance value)", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    // cap = 1000*2 = 2000 (premium modifiers don't raise cap); payout 200; remaining 1800
    expect(res.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("policy sword + 3 runes block -> insurance sum 1750", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750 (block affects premium only); cap 3500; payout 200; remaining 3300
    expect(res.results[1]).toEqual({ payout: 200, remainingCap: 3300 });
  });
  it("cap exhaustion: two 1500 claims on sword -> 1400 then 600, remaining 0", () => {
    const res = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    // cap 2000; first: 1500-100=1400, remaining 600; second: desired 1400 -> capped to 600, remaining 0
    expect(res.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(res.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases ---
  it("unknown item type in quote -> CLI exits non-zero, error to stderr", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> CLI exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim damage amount -200 -> CLI exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
});
