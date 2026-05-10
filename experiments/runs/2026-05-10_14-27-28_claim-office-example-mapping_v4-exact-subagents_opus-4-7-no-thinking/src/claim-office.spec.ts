import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / processing fee
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    expect(quote(customer, [])).toBe(5);
  });

  // Base premiums for single items (with first insurance + fee, newcomer)
  it("quote for a single plain sword (newcomer, no contracts) yields 115 G (100 base + 10 first + 5 fee)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote(customer, [sword])).toBe(115);
  });
  it("quote for a single plain amulet (newcomer) yields 71 G (60 base + 6 first + 5 fee)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(quote(customer, [amulet])).toBe(71);
  });
  it("quote for a single plain staff (newcomer) yields 93 G (80 base + 8 first + 5 fee)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const staff = { type: "staff", material: "wood", enchantment: 0, cursed: false };
    expect(quote(customer, [staff])).toBe(93);
  });
  it("quote for a single plain potion (newcomer) yields 49 G (40 base + 4 first + 5 fee)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const potion = { type: "potion", material: "glass", enchantment: 0, cursed: false };
    expect(quote(customer, [potion])).toBe(49);
  });

  // Components base premiums
  it("quote for 2 runes yields base premium 50 G (no block applies)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    expect(quote(customer, [rune, rune])).toBe(60);
  });
  it("quote for 3 runes yields base premium 60 G (block of 3 alike applies)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    expect(quote(customer, [rune, rune, rune])).toBe(71);
  });
  it("quote for 4 runes yields base premium 100 G (no block — block requires exactly 3)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    expect(quote(customer, [rune, rune, rune, rune])).toBe(115);
  });
  it("quote for 7 runes yields base premium 175 G (no block — block requires exactly 3)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    expect(quote(customer, [rune, rune, rune, rune, rune, rune, rune])).toBe(198);
  });

  // "Alike" components — same type
  it("quote for 2 runes + 1 moonstone yields base premium 75 G (no block, different types)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    const moonstone = { type: "moonstone" };
    expect(quote(customer, [rune, rune, moonstone])).toBe(88);
  });
  it("quote for 3 runes + 3 moonstones yields base premium 120 G (two separate blocks)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    const moonstone = { type: "moonstone" };
    expect(quote(customer, [rune, rune, rune, moonstone, moonstone, moonstone])).toBe(137);
  });

  // Item-specific modifiers
  it("cursed sword adds 50% surcharge to that item's base premium", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote(customer, [sword])).toBe(165);
  });
  it("sword with enchantment exactly 5 adds 30% high-enchantment surcharge", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote(customer, [sword])).toBe(145);
  });
  it("sword with enchantment 4 has no high-enchantment surcharge", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote(customer, [sword])).toBe(115);
  });
  it("cursed sword with enchantment 5 applies both curse and high-enchantment surcharges", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote(customer, [sword])).toBe(195);
  });

  // Modifier scope on multi-item policies
  it("policy with cursed sword and plain amulet: curse surcharge applies only to sword's base (210 G before policy modifiers + fee)", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(quote(customer, [sword, amulet])).toBe(231);
  });

  // Policy-wide modifiers
  it("customer with exactly 2 years receives 20% loyalty discount on policy base", () => {
    const customer = { yearsWithMHPCO: 2, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote(customer, [sword])).toBe(95);
  });
  it("first insurance adds 10% surcharge to policy base", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote(customer, [sword])).toBe(115);
  });
  it("follow-up contract gives 15% discount on policy base", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 1 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote(customer, [sword])).toBe(100);
  });

  // Processing fee added at the end
  it("5 G processing fee is always added after all other modifiers", () => {
    const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };
    expect(quote(newcomer, [])).toBe(5);
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote(newcomer, [sword])).toBe(115);
  });

  // Rounding
  it("premium of 197.5 G is rounded UP to 198 G", () => {
    const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const rune = { type: "rune" };
    expect(quote(newcomer, [rune, rune, rune, rune, rune, rune, rune])).toBe(198);
  });

  // Integration: Newcomer with cursed sword
  it("newcomer (0 years, no previous) with cursed sword (steel, ench 3) yields premium 165 G", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote(customer, [sword])).toBe(165);
  });

  // Integration: Long-standing customer's second contract
  it("3-year customer's second contract: cursed sword (steel, ench 7) yields premium 160 G", () => {
    const customer = { yearsWithMHPCO: 3, previousContracts: 1 };
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote(customer, [sword])).toBe(160);
  });

  // CLAIM PROCESSING — basic
  it("standard sword damage 500 G yields payout 400 G (500 - 100 deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 500 };
    expect(claim([sword], [damage]).payout).toBe(400);
  });
  it("rune damage 200 G yields payout 100 G (200 - 100 deductible, no special clauses)", () => {
    const rune = { type: "rune" };
    const damage = { itemType: "rune", amount: 200 };
    expect(claim([rune], [damage]).payout).toBe(100);
  });

  // Claim payout rounding
  it("payout of 350.5 G is rounded DOWN to 350 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8, cursed: false };
    const damage = { itemType: "sword", amount: 901 };
    expect(claim([sword], [damage]).payout).toBe(350);
  });

  // Deductible per damage event
  it("dragon attack damages sword (500) and amulet (300): payout 600 G (deductible applies once per item)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    const swordDamage = { itemType: "sword", amount: 500 };
    const amuletDamage = { itemType: "amulet", amount: 300 };
    expect(claim([sword, amulet], [swordDamage, amuletDamage]).payout).toBe(600);
  });

  // Special reimbursement clauses
  it("steel sword with enchantment 9, damage 1000 G: payout 400 G (50% then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const damage = { itemType: "sword", amount: 1000 };
    expect(claim([sword], [damage]).payout).toBe(400);
  });
  it("dragon-material sword with enchantment 5, damage 800 G: payout 700 G (full reimbursement then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5, cursed: false };
    const damage = { itemType: "sword", amount: 800 };
    expect(claim([sword], [damage]).payout).toBe(700);
  });
  it("dragon-material sword with enchantment 9, damage 1000 G: payout 400 G (50% wins, then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9, cursed: false };
    const damage = { itemType: "sword", amount: 1000 };
    expect(claim([sword], [damage]).payout).toBe(400);
  });
  it("dragon-material sword with enchantment exactly 8, damage 1000 G: payout 400 G (high-enchantment clause applies)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8, cursed: false };
    const damage = { itemType: "sword", amount: 1000 };
    expect(claim([sword], [damage]).payout).toBe(400);
  });

  // Cap
  it("sword policy (sum 1000, cap 2000): two claims of 1500 each yield first payout 1400 G with cap 600 remaining", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 1500 };
    const result = claim([sword], [damage]);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword policy second claim of 1500 G with 600 G cap remaining yields payout 600 G and cap 0", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 1500 };
    const result = claim([sword], [damage], 1400);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
  it("cursed sword: cap is 2000 G based on unmodified insurance value (premium modifiers do not raise cap)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const damage = { itemType: "sword", amount: 3000 };
    const result = claim([sword], [damage]);
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });
  it("policy with sword + 3 runes: insurance sum 1750 G (block discount affects only premium, not insurance sum)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const rune = { type: "rune" };
    const damage = { itemType: "sword", amount: 4000 };
    const result = claim([sword, rune, rune, rune], [damage]);
    expect(result.payout).toBe(3500);
    expect(result.remainingCap).toBe(0);
  });

  // Multiple items of same type
  it("policy with two swords: insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 4500 };
    const result = claim([sword, sword], [damage]);
    expect(result.payout).toBe(4000);
    expect(result.remainingCap).toBe(0);
  });
  it("two sword damage entries each get their own deductible when both swords are insured", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 500 };
    const result = claim([sword, sword], [damage, damage]);
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });
  it("two sword damage entries when only one sword is insured: claim is rejected", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damage = { itemType: "sword", amount: 500 };
    expect(() => claim([sword], [damage, damage])).toThrow();
  });

  // Error cases
  it("quote with unknown item type (e.g. broomstick): exits non-zero with stderr message", () => {
    const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };
    expect(() => quote(newcomer, [{ type: "broomstick" }])).toThrow();
  });
  it("claim referencing item not in policy: exits non-zero with stderr message", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(() => claim([sword], [{ itemType: "amulet", amount: 200 }])).toThrow();
  });
  it("claim with negative damage amount: exits non-zero with stderr message", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(() => claim([sword], [{ itemType: "sword", amount: -200 }])).toThrow();
  });

  // CLI integration
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout", async () => {
    const { runScenario } = await import("./cli.js");
    const scenario = {
      customer: { yearsWithMHPCO: 0, previousContracts: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    const output = runScenario(scenario);
    expect(output.results).toHaveLength(1);
    expect(output.results[0].premium).toBe(115);
  });
  it("CLI processes sequential steps; claim refers to earlier quote by zero-based step index", async () => {
    const { runScenario } = await import("./cli.js");
    const scenario = {
      customer: { yearsWithMHPCO: 0, previousContracts: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policyStep: 0,
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const output = runScenario(scenario);
    expect(output.results).toHaveLength(2);
    expect(output.results[0].premium).toBe(115);
    expect(output.results[1].payout).toBe(400);
    expect(output.results[1].remainingCap).toBe(1600);
  });
});
