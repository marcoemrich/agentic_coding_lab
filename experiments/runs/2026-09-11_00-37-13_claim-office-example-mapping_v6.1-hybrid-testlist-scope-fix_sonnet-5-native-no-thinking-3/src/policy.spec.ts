import { describe, it, expect } from "vitest";
import { calculatePremium, calculateClaim, insuranceSum, processClaim } from "./policy.js";

describe("Premium calculation", () => {
  // Simplest cases
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // Base premiums per item type (single item, no modifiers, newcomer)
  it("single sword, no modifiers → base premium 100 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("single amulet, no modifiers → base premium 60 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("single staff, no modifiers → base premium 80 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("single potion, no modifiers → base premium 40 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("single rune, no modifiers → base premium 25 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("single moonstone, no modifiers → base premium 25 G (before first-insurance surcharge and fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // Component block discount (3-alike)
  it("2 runes → base premium 50 G (no block)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → base premium 60 G (block applies)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(71);
  });
  it("4 runes → base premium 100 G (no block — block requires exactly 3)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(115);
  });
  it("7 runes → base premium 175 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        Array.from({ length: 7 }, () => ({ type: "rune" })),
      ),
    ).toBe(198);
  });
  it("2 runes + 1 moonstone → base premium 75 G (no block: different types)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones → base premium 120 G (two separate blocks)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(137);
  });

  // Item-specific modifiers in isolation.
  // Per the spec's own worked example ("100 base + 50 curse + 10 first
  // insurance = 160, +5 fee = 165"), the first-insurance surcharge is 10% of
  // the plain policy base premium (100), not of the total after item
  // surcharges are added — so these expected values follow that same rule.
  it("cursed sword → 50% curse surcharge added to sword's base premium (100 G → 150 G before other modifiers)", () => {
    // 100 base + 50 curse + 10% first-insurance (of the 100 base) = 160, +5 fee = 165
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("sword with enchantment exactly 5 → 30% high-enchantment surcharge applies (100 G → 130 G before other modifiers)", () => {
    // 100 base + 30 high-enchantment + 10% first-insurance (of the 100 base) = 140, +5 fee = 145
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (stays 100 G base)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with enchantment exactly 5 → both curse and high-enchantment surcharges apply (100 G → 180 G before other modifiers)", () => {
    // 100 base + 50 curse + 30 high-enchantment + 10% first-insurance (of the 100 base) = 190, +5 fee = 195
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }]),
    ).toBe(195);
  });

  // Policy-wide modifiers in isolation
  it("customer with exactly 2 years with MHPCO → 20% loyalty discount applies to policy base premium", () => {
    // 100 base + 10% first-insurance − 20% loyalty, both computed on the 100 G
    // policy base premium (not compounded sequentially): 100 + 10 − 20 = 90,
    // rounded up = 90, + 5 fee = 95. See the spec's own integration example
    // ("100 base + ... + 10 first insurance − 20 loyalty ... = 155") which
    // sums modifier percentages of the base rather than multiplying them in.
    expect(calculatePremium({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("customer's first quote (no previous contracts) → 10% first-insurance surcharge applies to policy base premium", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("customer's second quote in the scenario → 15% follow-up discount applies to policy base premium", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("processing fee of 5 G is added to every premium", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });

  // Modifier scope on multi-item policies
  it("policy with cursed sword (100 G base) and plain amulet (60 G base) → policy base premium 160 G; curse surcharge adds 50 G (50% of cursed sword's base premium, not policy total) → 210 G before further modifiers and fee", () => {
    // 160 policyBase + 50 curse = 210 premiumBeforePolicyModifiers;
    // + 10% first-insurance of the 160 policyBase = +16 → 226, +5 fee = 231
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }]),
    ).toBe(231);
  });

  // Rounding
  it("premium calculation yielding 197.5 G → final premium rounds up to 198 G", () => {
    // sword(100) + rune(25) = 125 policyBase; +10% first-insurance = 12.5
    // → 137.5 before fee, rounds up to 138, +5 fee = 143
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "rune" }])).toBe(143);
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    // cursed sword(100) + rune(25): policyBase=125, curse=50 →
    // premiumBeforePolicyModifiers=175; +10% first-insurance of 125 = 12.5
    // → 187.5, rounds up to 188, +5 fee = 193. Rounding curse or the
    // first-insurance surcharge separately first would drift this result.
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "rune" }]),
    ).toBe(193);
  });

  // Integration examples (full end-to-end premium)
  it("newcomer with cursed sword (steel, enchantment 3): 100 base + 50 curse + 10 first-insurance = 160, +5 fee = 165 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", cursed: true, enchantment: 3 },
      ]),
    ).toBe(165);
  });
  it("long-standing customer's (3 years) second contract with cursed sword (steel, enchantment 7): 100 base + 50 curse + 30 high-enchantment − 20 loyalty + 10 first-insurance (still applies per-item) − 15 follow-up = 155, +5 fee = 160 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }],
        1,
      ),
    ).toBe(160);
  });
});

describe("Claim/payout calculation", () => {
  // Simplest / standard cases
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible; no special clause)", () => {
    expect(calculateClaim({ type: "sword", material: "steel", enchantment: 3 }, 500)).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (full reimbursement minus 100 G deductible; no enchantment/material clause applies)", () => {
    expect(calculateClaim({ type: "rune" }, 200)).toBe(100);
  });

  // Modifier thresholds for claim clauses
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment 50% clause applies, then deductible)", () => {
    expect(calculateClaim({ type: "sword", material: "dragon", enchantment: 8 }, 1000)).toBe(400);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins over full reimbursement, then deductible: 500 − 100)", () => {
    expect(calculateClaim({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause applies: full reimbursement, then deductible: 800 − 100)", () => {
    expect(calculateClaim({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause applies: 50% first, then deductible: 500 − 100)", () => {
    expect(calculateClaim({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (100 G deductible applies once per damaged item)", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(processClaim(items, damages).payout).toBe(600);
  });

  // Multiple items of the same type
  it("policy covers two swords → insurance sum 2000 G (= 2×1000), cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("dragon attack damages both swords; damages array has two {itemType: 'sword', ...} entries → each entry treated as a separate damage with its own deductible", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(processClaim(items, damages).payout).toBe(800);
  });

  // Cap exhaustion and insurance sum computation
  it("policy covers a sword and an amulet → insurance sum 1600 G (1000 + 600), cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) → cap 2000 G (based on unmodified insurance value; premium modifiers do not raise the cap)", () => {
    expect(insuranceSum([{ type: "sword", cursed: true }])).toBe(1000);
  });
  it("policy covers a sword and 3 runes (a block) → insurance sum 1750 G (1000 + 3×250); block discount affects premium only, not insurance sum", () => {
    expect(
      insuranceSum([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(1750);
  });
  it("sword insured (insurance sum 1000 G, cap 2000 G); first of two successive 1500 G claims → payout 1400 G, cap remaining 600 G", () => {
    expect(processClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("sword insured (insurance sum 1000 G, cap 2000 G); second successive 1500 G claim after first → payout 600 G, cap remaining 0 G (desired 1400 G reduced to remaining cap)", () => {
    expect(processClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], 1400)).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // Rounding
  it("payout calculation yielding 350.5 G → final payout rounds down to 350 G", () => {
    expect(calculateClaim({ type: "sword", enchantment: 8 }, 901)).toBe(350);
  });
});
