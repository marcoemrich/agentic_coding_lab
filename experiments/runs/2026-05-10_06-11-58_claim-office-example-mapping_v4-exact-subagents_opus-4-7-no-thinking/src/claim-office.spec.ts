// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- QUOTE: empty and base premiums ---
  it("empty item list yields premium of 5G (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(5);
  });
  it("quote for a single sword yields 115G (100G base + 10G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("quote for a single amulet yields 71G (60G base + 6G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "gold", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("quote for a single staff yields 93G (80G base + 8G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("quote for a single potion yields 49G (40G base + 4G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(49);
  });

  // --- QUOTE: components and blocks ---
  it("quote for a single rune yields 33G (25G base + 2.5G first insurance, ceil to 28G + 5G fee = 33G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });
  it("quote for 2 runes yields 60G (50G base + 5G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it("quote for 3 runes applies block: 71G (60G block base + 6G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("quote for 4 runes does not apply block: 115G (100G base + 10G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("quote for 7 runes yields 198G (175G base + 17.5G first insurance + 5G fee, ceil)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });
  it("quote for 2 runes + 1 moonstone yields 88G (75G base + 7.5G first insurance + 5G fee, ceil; no block — different types)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(88);
  });
  it("quote for 3 runes + 3 moonstones applies two separate blocks: 137G (120G base + 12G first insurance + 5G fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(137);
  });

  // --- QUOTE: item-specific modifiers ---
  it("cursed sword adds 50% surcharge to that item's base premium (premium = 165G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("highly enchanted sword (enchantment 5) adds 30% surcharge (premium = 145G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(145);
  });
  it("sword with enchantment 4 has no high-enchantment surcharge (premium = 115G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("cursed sword with enchantment 5 stacks both surcharges (premium = 195G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(195);
  });

  // --- QUOTE: policy-wide modifiers ---
  it("first insurance adds 10% surcharge to policy base (sword + amulet -> 181G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(181);
  });
  it("long-standing customer (2 years) gets 20% loyalty discount (sword -> 95G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(95);
  });
  it("customer with exactly 2 years receives loyalty discount (threshold)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(95);
  });
  it("customer with less than 2 years does not receive loyalty discount (sword, 1 year -> 115G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("follow-up contract (second quote) gets 15% discount (step 2 sword -> 100G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });

  // --- QUOTE: integration examples from spec ---
  it("newcomer with cursed sword (steel, enchantment 3) -> premium 165G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("multi-item: cursed sword + plain amulet -> 231G total (160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const scenario = {
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
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(231);
  });
  it("long-standing customer's second contract: cursed sword (enchantment 7) -> 160G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1].premium).toBe(160);
  });

  // --- QUOTE: rounding ---
  it("premium of 197.5G rounds up to 198G (in MHPCO's favor) (7 runes premium = 198G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });

  // --- QUOTE: rejections ---
  it("quote with unknown item type causes runScenario to throw (rejection)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // --- CLAIM: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500G -> payout 400G, remainingCap 1600G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance 250G), damage 200G -> payout 100G, remainingCap 400G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "unknown", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- CLAIM: deductible per damage event ---
  it("dragon attack damages sword (500G) and amulet (300G) -> payout 600G (deductible per item)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- CLAIM: enchantment threshold ---
  it("steel sword, enchantment 9, damage 1000G -> payout 400G (50% then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- CLAIM: dragon material ---
  it("dragon-material sword, enchantment 5, damage 800G -> payout 700G, remainingCap 1300G (full reimbursement, deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 8, damage 1000G -> payout 400G, remainingCap 1600G (high-ench wins over dragon)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000G -> payout 400G, remainingCap 1600G (50% rule wins)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- CLAIM: rounding ---
  it("payout calculation of 350.5G rounds down to 350G (steel sword ench 9 damage 901 -> 350)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- CLAIM: cap and multiple items ---
  it("policy with two swords -> insurance sum 2000G, cap 4000G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two sword damages on a two-sword policy -> each entry has its own deductible (payout 600, remainingCap 3400)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("cursed sword has cap 2000G (cursed sword damage 2500 -> payout 2000, remainingCap 0)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy with sword + 3 runes -> insurance sum 1750G, cap 3500G (damage sword 4000 -> payout 3500, remainingCap 0)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 4000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // --- CLAIM: cap exhaustion across successive claims ---
  it("sword (cap 2000G), first claim 1500G -> payout 1400G, remainingCap 600G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000G), second claim 1500G after first -> payout 600G, remaining cap 0G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
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
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- CLAIM: rejections ---
  it("claim references item not in policy -> runScenario throws (e.g., amulet damage on sword-only policy)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains damage entry with negative amount -> runScenario throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("more damage entries of a type than policy covers -> runScenario throws (e.g., 2 sword damages on a 1-sword policy)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
