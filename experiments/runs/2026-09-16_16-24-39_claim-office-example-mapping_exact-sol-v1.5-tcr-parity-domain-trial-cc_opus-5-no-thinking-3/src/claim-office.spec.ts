import { describe, expect, it } from "vitest";
import { basePremium, ClaimOffice, itemisedPremium } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([])).toBe(5);
  });

  // --- Base premiums per main item type (plain item, newcomer with 0 years, first item) ---
  it("quotes a plain sword with base premium 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("quotes a plain amulet with base premium 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("quotes a plain staff with base premium 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("quotes a plain potion with base premium 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  // --- Component base premiums and the building block of 3 alike components ---
  it("quotes 1 rune with base premium 25 G", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("quotes 2 runes with base premium 50 G (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("quotes 3 runes with base premium 60 G (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 4 runes with base premium 100 G (no block -- block requires exactly 3)", () => {
    expect(basePremium(Array(4).fill({ type: "rune" }))).toBe(100);
  });
  it("quotes 7 runes with base premium 175 G (no block -- block requires exactly 3)", () => {
    expect(basePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });
  it("quotes 1 moonstone with base premium 25 G", () => {
    expect(basePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("quotes 2 runes + 1 moonstone with base premium 75 G (no block: alike means same type)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("quotes 3 runes + 3 moonstones with base premium 120 G (two separate blocks)", () => {
    expect(
      basePremium([...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })]),
    ).toBe(120);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to a cursed item's base premium (cursed sword -> 150 G base+curse)", () => {
    expect(itemisedPremium([{ type: "sword", cursed: true }])).toBe(150);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 (sword -> 130 G base+enchantment)", () => {
    expect(itemisedPremium([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (plain sword -> 100 G base)", () => {
    expect(itemisedPremium([{ type: "sword", enchantment: 4 }])).toBe(100);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 (-> 180 G)", () => {
    expect(itemisedPremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO (sword -> 80 G after discount)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 2 }).quote([{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO (sword -> 100 G)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 1 }).quote([{ type: "sword" }])).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge per item in the quote (sword -> 110 G)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up discount to every contract after the customer's first quote (second quote of a sword -> 95 G before fee)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });
  it("adds the 5 G processing fee at the very end of every quote", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    expect(office.quote([{ type: "sword" }])).toBe(95);
  });

  // --- Modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item's base premium on a multi-item policy (cursed sword + plain amulet -> 210 G before further modifiers and fee)", () => {
    expect(itemisedPremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });

  // --- Rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    const runes = [{ type: "rune", cursed: true }, { type: "rune" }, { type: "rune" }];
    expect(office.quote(runes)).toBe(84);
  });
  it("rounds a payout of 350.5 G down to 350 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(office.claim(0, { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] }).payout).toBe(350);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 2 });
    const cursedRunes = Array(3).fill({ type: "rune", cursed: true });
    expect(office.quote(cursedRunes)).toBe(97);
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, no previous contract) as 165 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(office.quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second contract for a cursed steel sword (enchantment 7, 3 years) as 160 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    office.quote([{ type: "amulet" }]);
    expect(office.quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])).toBe(160);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a steel sword with enchantment 3 damaged by 500 G (full reimbursement minus 100 G deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }).payout).toBe(400);
  });
  it("pays out 100 G for a rune (no enchantment, no material) damaged by 200 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "rune" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] }).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item (sword 500 G + amulet 300 G -> payout 600 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] };
    expect(office.claim(0, incident).payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses 50 % for damage to an item with enchantment exactly 8 before the deductible (dragon sword, damage 1000 G -> payout 400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(office.claim(0, { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("reimburses steel sword with enchantment 9 damaged by 1000 G at 50 % then deductible -> payout 400 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("reimburses dragon-material sword with enchantment 5 damaged by 800 G in full then deductible -> payout 700 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] }).payout).toBe(700);
  });
  it("lets the 50 % high-enchantment rule win over full dragon reimbursement (dragon sword, enchantment 9, damage 1000 G -> payout 400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy at twice the insurance sum (sword + amulet -> insurance sum 1600 G, cap 3200 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const result = office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] });
    expect(result).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values (cursed sword, premium 165 G -> cap 2000 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(office.quote([{ type: "sword", cursed: true }])).toBe(165);
    const result = office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(2000);
  });
  it("includes component insurance values in the insurance sum unaffected by the block discount (sword + 3 runes -> insurance sum 1750 G, cap 3500 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, ...Array(3).fill({ type: "rune" })]);
    const result = office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(3500);
  });
  it("reports the remaining cap after a claim (sword, cap 2000 G, claim 1500 G -> payout 1400 G, remainingCap 600 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later payout to the remaining cap (second claim of 1500 G -> payout 600 G, remainingCap 0 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(office.claim(0, incident)).toEqual({ payout: 1400, remainingCap: 600 });
    expect(office.claim(0, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---
  it("sums insurance values for two swords in one policy (insurance sum 2000 G, cap 4000 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    const result = office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(4000);
  });
  it("treats two damage entries of the same item type as separate damages each with its own deductible", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(office.claim(0, { cause: "dragon attack", damages }).payout).toBe(800);
  });

  // --- Error cases (observable contract: the CLI exits non-zero and writes an error description to stderr; the domain layer signals this by throwing an Error) ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick) by throwing an Error", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(() => office.quote([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("rejects a claim whose damage references an item type not covered by the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => office.claim(0, incident)).toThrow(/does not cover/);
  });
  it("rejects a claim whose damage references an unknown item type by throwing an Error", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] };
    expect(() => office.claim(0, incident)).toThrow(/does not cover/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const damages = [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }];
    expect(() => office.claim(0, { cause: "dragon attack", damages })).toThrow(/does not cover/);
  });
  it("rejects a claim containing a damage entry with a negative amount (-200) by throwing an Error", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => office.claim(0, incident)).toThrow(/negative/);
  });

  // --- CLI adapter ---
});
