import { describe, it, expect } from "vitest";
import { quote, claim, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — empty and single items
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("a single sword yields premium of 115 G (100 base + 10 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 1, cursed: false }])).toBe(115);
  });
  it("a single amulet yields premium of 71 G (60 base + 6 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }])).toBe(71);
  });
  it("a single staff yields premium of 93 G (80 base + 8 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
  });
  it("a single potion yields premium of 49 G (40 base + 4 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 1, cursed: false }])).toBe(49);
  });

  // Components
  it("a single rune (component) yields premium of 33 G (25 base + 2.5 first + 5 fee → rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("2 runes yield premium of 60 G (50 base + 5 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes (block) yield premium of 71 G (60 base + 6 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes yield premium of 115 G (100 base + 10 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
  });
  it("3 runes + 3 moonstones (two blocks) yield premium of 137 G (120 base + 12 first + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("2 runes + 1 moonstone yields premium of 88 G (75 base + 7.5 first + 5 fee → rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ])).toBe(88);
  });

  // Premium modifiers (single item, newcomer)
  it("cursed sword (newcomer, enchantment 3) yields premium of 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ])).toBe(165);
  });
  it("highly enchanted sword (enchantment 5, not cursed, newcomer) yields premium of 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 5, cursed: false },
    ])).toBe(145);
  });
  it("sword with enchantment 4 (newcomer, not cursed) yields premium of 115 G (no high-enchantment surcharge)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 4, cursed: false },
    ])).toBe(115);
  });

  // Loyalty discount & follow-up contract
  it("long-standing customer (2+ years) with a single sword yields premium of 95 G (100 + 10 first − 20 loyalty + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
    ])).toBe(95);
  });
  it("second contract of a long-standing customer adds the 15% follow-up discount", () => {
    // 3-year customer, second contract, cursed sword (steel, enchantment 7):
    // 100 base + 50 curse + 30 high + 10 first - 20 loyalty - 15 follow-up + 5 fee = 160
    expect(quote({ yearsWithMHPCO: 3 }, [
      { type: "sword", material: "steel", enchantment: 7, cursed: true },
    ], { contractIndex: 1 })).toBe(160);
  });

  // Multi-item policies and modifier scope
  it("policy with cursed sword + plain amulet (newcomer) yields premium of 231 G", () => {
    // 100 sword + 60 amulet = 160 base; first 10% × 160 = 16; curse 50% × 100 = 50; fee 5 → 231
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 1, cursed: true },
      { type: "amulet", material: "silver", enchantment: 1, cursed: false },
    ])).toBe(231);
  });

  // Claim — basic
  it("claim on a sword (steel, enchantment 3) with damage 500 G pays 400 G and remainingCap 1600 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune with damage 200 G pays 100 G (full minus 100 deductible)", () => {
    const policy = { items: [{ type: "rune" }] };
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim — special clauses
  it("dragon-material sword (enchantment 9) damage 1000 G pays 400 G (50% rule wins then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword (enchantment 5) damage 800 G pays 700 G (full minus deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword (enchantment 9) damage 1000 G pays 400 G (50% then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — multiple damages
  it("claim with two damages (sword + amulet) applies deductible per damage entry", () => {
    const policy = {
      items: [
        { type: "sword", material: "steel", enchantment: 1, cursed: false },
        { type: "amulet", material: "silver", enchantment: 1, cursed: false },
      ],
    };
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident, 0)).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim — cap and successive claims
  it("successive claims exhaust the cap and reduce later payouts", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] };
    const incident1 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident1, 0);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const incident2 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const second = claim(policy, incident2, 1400);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  // CLI / scenario integration
  it("scenario with a quote step returns premium in results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("scenario with a quote followed by a claim returns premium then payout+remainingCap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(runScenario(scenario as never)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("unknown item type in quote causes error (rejected)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "broomstick", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    };
    expect(() => runScenario(scenario as never)).toThrow();
  });
  it("claim referencing item not in policy is rejected", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident, 0)).toThrow();
  });
  it("claim with negative damage amount is rejected", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident, 0)).toThrow();
  });
});
