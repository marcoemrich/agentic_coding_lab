import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Claim Office - quote", () => {
  // Edge case: empty item list
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quote({ items: [] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(5);
  });

  // Base premiums for main items (base + 10% first-insurance + 5 G fee)
  it("single sword -> premium 115 G (100 base + 10 first-ins + 5 fee)", () => {
    expect(quote({ items: [{ type: "sword" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });
  it("single amulet -> premium 71 G (60 base + 6 first-ins + 5 fee)", () => {
    expect(quote({ items: [{ type: "amulet" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });
  it("single staff -> premium 93 G (80 base + 8 first-ins + 5 fee)", () => {
    expect(quote({ items: [{ type: "staff" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(93);
  });
  it("single potion -> premium 49 G (40 base + 4 first-ins + 5 fee)", () => {
    expect(quote({ items: [{ type: "potion" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(49);
  });

  // Components
  it("single rune -> premium 33 G (25 base + 2.5 first-ins + 5 fee -> rounded up)", () => {
    expect(quote({ items: [{ type: "rune" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(33);
  });
  it("single moonstone -> premium 33 G (25 base + 2.5 first-ins + 5 fee -> rounded up)", () => {
    expect(quote({ items: [{ type: "moonstone" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(33);
  });

  // Building block of 3 alike components
  it("2 runes -> 50 G base premium (60 total)", () => {
    expect(quote({ items: [{ type: "rune" }, { type: "rune" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(60);
  });
  it("3 runes -> 60 G base premium block applies (71 total)", () => {
    expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });
  it("4 runes -> 100 G base premium no block (115 total)", () => {
    expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });
  it("7 runes -> 175 G base premium (198 total, rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ items }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(198);
  });

  // "Alike" components
  it("2 runes + 1 moonstone -> 75 G base premium no block (88 total, rounded up)", () => {
    expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium two blocks (137 total)", () => {
    expect(quote({ items: [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(137);
  });

  // Premium modifiers - item-specific
  it("cursed sword adds 50% surcharge on item base premium", () => {
    // newcomer: 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(quote({ items: [{ type: "sword", cursed: true }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(165);
  });
  it("highly enchanted sword (level >= 5) adds 30% surcharge", () => {
    // newcomer: 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(quote({ items: [{ type: "sword", enchantment: 5 }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    // 100 base + 10 first insurance + 5 fee = 115 (no high-ench)
    expect(quote({ items: [{ type: "sword", enchantment: 4 }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    // boundary: 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(quote({ items: [{ type: "sword", enchantment: 5 }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply", () => {
    // 100 base + 50 curse + 30 high-ench + 10 first insurance + 5 fee = 195
    expect(quote({ items: [{ type: "sword", cursed: true, enchantment: 5 }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(195);
  });

  // Policy-wide modifiers
  it("long-standing customer (>= 2 years) receives 20% loyalty discount", () => {
    // sword: 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(quote({ items: [{ type: "sword" }] }, { yearsWithMHPCO: 3, contractIndex: 0 })).toBe(95);
  });
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    // boundary: sword 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(quote({ items: [{ type: "sword" }] }, { yearsWithMHPCO: 2, contractIndex: 0 })).toBe(95);
  });
  it("first insurance carries 10% initial assessment surcharge", () => {
    // each item in a quote is a first insurance: sword 100 + 10 + 5 fee = 115
    expect(quote({ items: [{ type: "sword" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });
  it("15% discount on each contract after the first", () => {
    // second contract (index 1): sword 100 - 15 follow-up + 10 first insurance + 5 fee = 100
    expect(quote({ items: [{ type: "sword" }] }, { yearsWithMHPCO: 0, contractIndex: 1 })).toBe(100);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet -> curse surcharge on cursed item only -> 210 G before fee", () => {
    // policyBase 160 + curse 50 (50% of sword base only) = 210 before further modifiers
    // newcomer full: 210 + first-ins 16 (10% of 160) + 5 fee = 231
    expect(quote({ items: [{ type: "sword", cursed: true }, { type: "amulet" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(231);
  });

  // Rounding
  it("premium yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // 7 runes newcomer: 175 base + 17.5 first-ins + 5 fee = 197.5 -> 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ items }, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(198);
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(quote(
      { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      { yearsWithMHPCO: 0, contractIndex: 0 },
    )).toBe(165);
  });
  it("long-standing customer second contract, cursed sword (steel, ench 7) -> premium 160 G", () => {
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(quote(
      { items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      { yearsWithMHPCO: 3, contractIndex: 1 },
    )).toBe(160);
  });

  // Edge cases
  it("quote with unknown item type -> throws error", () => {
    expect(() => quote({ items: [{ type: "broomstick" }] }, { yearsWithMHPCO: 0, contractIndex: 0 })).toThrow();
  });
});

describe("Claim Office - claim", () => {
  // Standard reimbursement
  it("regular sword damage 500 G -> payout 400 G (minus deductible)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("rune damage 200 G -> payout 100 G (minus deductible, no special clause)", () => {
    const policy = { items: [{ type: "rune" }] };
    const incident = { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident).payout).toBe(100);
  });

  // High enchantment reimbursement
  it("steel sword ench 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 9 }] };
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon sword ench 8, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8 }] };
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });

  // Dragon material
  it("dragon sword ench 5, damage 800 G -> payout 700 G (full then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5 }] };
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });

  // Both clauses -> 50% wins
  it("dragon sword ench 9, damage 1000 G -> payout 400 G (50% wins then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9 }] };
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages sword 500 + amulet 300 -> payout 600 G (deductible per item)", () => {
    const policy = { items: [{ type: "sword" }, { type: "amulet" }] };
    const incident = { cause: "dragon", damages: [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ] };
    expect(claim(policy, incident).payout).toBe(600);
  });

  // Cap
  it("cap based on unmodified insurance value; two swords -> cap 4000 G", () => {
    // insurance sum = 2×1000 = 2000, cap = 4000; damage 500 -> payout 400, remainingCap 3600
    const policy = { items: [{ type: "sword" }, { type: "sword" }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).remainingCap).toBe(3600);
  });
  it("cap exhaustion: two successive 1500 G claims -> 1400 then 600", () => {
    const policy = { items: [{ type: "sword" }] }; // cap 2000
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(policy, incident, first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Multiple items same type
  it("two sword damages but only one sword insured -> throws error", () => {
    const policy = { items: [{ type: "sword" }] };
    const incident = { cause: "dragon", damages: [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 400 },
    ] };
    expect(() => claim(policy, incident)).toThrow();
  });

  // Rounding
  it("payout yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    // sword ench 8, damage 901: 50% = 450.5, - 100 deductible = 350.5 -> floor 350
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 8 }] };
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident).payout).toBe(350);
  });

  // Edge cases
  it("claim references item not in policy -> throws error", () => {
    const policy = { items: [{ type: "sword" }] };
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow();
  });
  it("claim with negative amount -> throws error", () => {
    const policy = { items: [{ type: "sword" }] };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow();
  });
});
