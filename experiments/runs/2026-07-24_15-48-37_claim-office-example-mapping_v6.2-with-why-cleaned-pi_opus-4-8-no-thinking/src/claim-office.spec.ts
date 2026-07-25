import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single main items ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("single sword -> base 100 G + fee (+ first insurance)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // 100 base + 10 first insurance = 110 + 5 fee = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet -> base 60 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    // 60 base + 6 first insurance = 66 + 5 fee = 71
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("single staff -> base 80 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    // 80 base + 8 first insurance = 88 + 5 fee = 93
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("single potion -> base 40 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    // 40 base + 4 first insurance = 44 + 5 fee = 49
    expect(out.results[0]).toEqual({ premium: 49 });
  });

  // --- Components and building blocks ---
  it("2 runes -> 50 G base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 2*25 = 50; + 10% first insurance = 55; + 5 fee = 60
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    // block base 60; + 10% first insurance = 66; + 5 fee = 71
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block, requires exactly 3)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // no block: 4*25 = 100 base; +10% = 110; +5 fee = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // no block: 7*25 = 175 base; +10% = 192.5; +5 fee = 197.5 -> rounded up = 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base (no block: different types)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // 2*25 + 1*25 = 75 base (no block); +10% = 82.5; +5 fee = 87.5 -> rounded up = 88
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base (two separate blocks)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    // two blocks: 60 + 60 = 120 base; +10% = 132; +5 fee = 137
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds 50% of item base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("high enchantment (>=5) adds 30% of item base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // 100 base + 30 high-ench + 10 first insurance = 140 + 5 fee = 145
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // threshold is >=5, exactly 5 qualifies: 100 + 30 + 10 = 140 + 5 fee = 145
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    // enchantment 4 < 5: no surcharge. 100 + 10 first insurance = 110 + 5 fee = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword enchantment 5 -> both surcharges apply", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });
    // 100 + 50 curse + 30 high-ench + 10 first insurance = 190 + 5 fee = 195
    expect(out.results[0]).toEqual({ premium: 195 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> 210 G before further modifiers and fee", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // base 160 + 50 curse (of sword only) = 210; + first insurance 10% of 160 = 16 -> 226; + 5 fee = 231
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // --- Policy-wide modifiers ---
  it("first insurance carries 10% initial assessment surcharge", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    // 40 base + 4 (10% first insurance) = 44 + 5 fee = 49
    expect(out.results[0]).toEqual({ premium: 49 });
  });
  it("long-standing customer (>=2 years) receives 20% loyalty discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    // 100 base - 20 loyalty (20% of base) + 10 first insurance = 90 + 5 fee = 95
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    // exactly 2 years qualifies (>=2): 100 - 20 loyalty + 10 first insurance = 90 + 5 fee = 95
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("follow-up contract (each after first) receives 15% discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    // Quote 1: 100 + 10 first insurance + 5 = 115
    expect(out.results[0]).toEqual({ premium: 115 });
    // Quote 2 (follow-up): 100 + 10 first insurance - 15 follow-up + 5 = 100
    expect(out.results[1]).toEqual({ premium: 100 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> 198 G (rounded up, MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    // 7*25=175 base; +10% = 192.5; +5 fee = 197.5 -> rounded UP = 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> 350 G (rounded down, MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // ench 8: 901*0.5 = 450.5, then -100 = 350.5 -> rounded DOWN = 350; cap 2000-350=1650
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("newcomer cursed sword (steel ench 3) -> 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract cursed sword ench 7 -> 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Insurance sum & cap ---
  it("two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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
    // insurance sum 2*1000 = 2000, cap 4000; each 500-100=400, total 800; remaining 4000-800=3200
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // insurance sum 1000+600 = 1600, cap 3200; 200-100=100; remaining 3200-100=3100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    // cap based on unmodified insurance value 1000 -> 2000; 300-100=200; remaining 2000-200=1800
    expect(out.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("sword + 3 runes block -> insurance sum 1750 G (block affects premium only)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // insurance sum 1000 + 3*250 = 1750 (block only affects premium), cap 3500; 200-100=100; remaining 3400
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword damage 500 G -> payout 400 G (full minus deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600 remaining
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G -> payout 100 G (no special clause)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // rune insurance value 250, cap 500; 200 - 100 deductible = 100; remaining 500 - 100 = 400
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("high-enchantment (>=8) sword damage 1000 -> payout 400 (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // enchantment >=8: 50% of 1000 = 500, then -100 deductible = 400; cap 2000 - 400 = 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5 damage 800 -> payout 700 (full then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // dragon material: full reimbursement 800, then -100 deductible = 700; cap 2000 - 700 = 1300
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword ench 9 damage 1000 -> payout 400 (50% wins, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // both clauses apply; 50% wins: 1000*0.5 = 500, then -100 = 400; cap 2000 - 400 = 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 8 damage 1000 -> payout 400 (high-ench applies, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // enchantment exactly 8 >=8: 50% clause applies: 1000*0.5 = 500, then -100 = 400; cap 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword ench 9 damage 1000 -> payout 400 (high-ench, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // steel, ench 9 >=8: 50% clause: 1000*0.5 = 500, then -100 = 400; cap 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword 500 + amulet 300 -> payout 600 (deductible per item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
    // sword 500-100=400, amulet 300-100=200, total 600; cap 3200-600=2600
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("two swords both damaged -> each entry separate damage with own deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // each entry own deductible: (500-100)+(300-100) = 400+200 = 600; cap 4000-600=3400
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damages of a type than insured -> claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword two claims 1500 each -> payout 1400 remaining 600, then payout 600 remaining 0", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // cap 2000; claim1: 1500-100=1400 -> payout 1400, remaining 600
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // claim2: desired 1400 but only 600 cap left -> payout 600, remaining 0
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases / errors ---
  it("unknown item type in quote -> throws (rejected)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("claim references item not in policy -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      })
    ).toThrow();
  });
  it("claim damage with negative amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow();
  });
});
