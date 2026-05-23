import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases (edge cases) ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Quote: base premiums for main items ---
  it("single sword (steel, ench 0, not cursed), new customer's first contract → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet → 60 base + 6 first-insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff → 80 base + 8 first-insurance + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion → 40 base + 4 first-insurance + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Quote: components and blocks ---
  it("2 runes → 50 G base + 5 first-insurance + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → 60 G base (block applies) + 6 first-insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → 100 G base (no block — block requires exactly 3) + 10 first-insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes → 175 G base + 18 first-insurance (rounded up) + 5 fee = 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone → 75 G base (no block: different types) + 8 first-insurance + 5 fee = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // 75 base + 7.5 first-insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones → 120 G base (two separate blocks) + 12 first-insurance + 5 fee = 137 G", () => {
    const result = runScenario({
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
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword adds 50% risk surcharge → 100 base + 50 curse + 10 first-insurance + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted item (sword, ench 7) → 100 base + 30 high-ench + 10 first-insurance + 5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 + 30 + 10 + 5 = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge → 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 → both surcharges apply → 100+50+30+10+5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // --- Quote: policy-wide modifiers ---
  it("long-standing customer (3 years) gets 20% loyalty discount → 100 base + 10 first-insurance - 20 loyalty + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years → loyalty discount applies → 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance carries 10% initial assessment surcharge applied to policy base", () => {
    // already covered: 100 G base + 10 G first-insurance + 5 G fee = 115 G — but reaffirm
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("follow-up contract gets 15% discount (2nd quote in scenario, sword) → 100 base + 10 first-ins - 15 follow-up + 5 fee = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("5 G processing fee added to every premium (sword: 100 + 10 + 5 = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Quote: scope clarifications (❓) ---
  it("cursed sword + plain amulet → 100+60=160 base, +50 curse on sword only, +16 first-ins + 5 fee = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("first-insurance surcharge applies even on follow-up contracts (covered by integration example below)", () => {
    // Long-standing customer (3 years), 2nd quote, cursed sword ench 7 → 160 G
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee = 160 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rounding (in MHPCO's favor = round premium up) ---
  it("premium calculation that yields 197.5 G → 198 G (rounded up)", () => {
    // 7 runes: base 7*25=175, first-ins 17.5, fee 5 → 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("intermediate amounts kept as fractions; only final premium rounded", () => {
    // 1 rune: base 25, first-ins 2.5 (fractional), fee 5 → 32.5 → 33
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  // --- Quote: error cases ---
  it("quote includes item with unknown type → throws error (CLI will exit non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      }),
    ).toThrow(/unknown.*type|broomstick/i);
  });

  // --- Quote: integration examples ---
  it("newcomer (0 years, no prev contract) with cursed sword (steel, ench 3) → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer (3 years), 2nd quote, cursed sword (steel, ench 7) → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3) damaged 500 G → payout 400 G, cap 2000-400=1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G) damaged 200 G → payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: enchantment threshold ---
  it("steel sword ench 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 8, damage 1000 G → payout 400 G (ench rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material ---
  it("dragon-material sword ench 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: both clauses ---
  it("dragon-material sword ench 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0 },
            { type: "amulet", material: "silver", enchantment: 0 },
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
    // sword: 500-100=400; amulet: 300-100=200; total=600. Cap was 3200 → 2600.
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: multiple items of same type ---
  it("two-sword policy → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0 },
            { type: "sword", material: "steel", enchantment: 0 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damages on two-sword policy → each treated as separate damage with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0 },
            { type: "sword", material: "steel", enchantment: 0 },
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
    // 500-100 + 500-100 = 800; cap 4000 → 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array has more entries of a type than policy covers → throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0 }],
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
      }),
    ).toThrow(/sword|not.*part|covered/i);
  });

  // --- Claim: cap based on insurance values ---
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0 },
            { type: "amulet", material: "silver", enchantment: 0 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword (premium 165 G with modifiers) → cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block discount doesn't affect insurance sum), cap 3500", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0 },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword cap 2000 G, first claim 1500 G damage → payout 1400 G, cap remaining 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword cap 2000 G, second claim 1500 G after first exhausted to 600 → payout 600 G, cap remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding (in MHPCO's favor = round payout down) ---
  it("payout calculation 350.5 G → 350 G (rounded down)", () => {
    // steel sword ench 9, damage 901 → 450.5 - 100 = 350.5 → 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(350);
  });

  // --- Claim: error cases ---
  it("claim references damage entry whose item is not part of policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow(/amulet|not.*part|covered/i);
  });
  it("claim references item with unknown type → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains damage entry with amount: -200 → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/amount|negative|-200/i);
  });

  // --- CLI / scenario level ---
  it("scenario with single quote step produces results array with one premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("scenario with quote then claim returns premium then payout + remainingCap (schema example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    // amulet: 60 base + 6 first-ins - 12 loyalty + 5 fee = 59 G
    expect(result.results[0]).toEqual({ premium: 59 });
    // payout: 200 - 100 = 100; cap 1200 → 1100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("CLI reads JSON from stdin and writes JSON to stdout", async () => {
    const { execFileSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
