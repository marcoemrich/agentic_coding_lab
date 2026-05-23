import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

const newcomer = { yearsWithMHPCO: 0 };
const longstanding = { yearsWithMHPCO: 3 };

const quote = (items: unknown[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: unknown[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test", damages },
});

const runQuote = (customer: { yearsWithMHPCO: number }, items: unknown[]) =>
  runScenario({ customer, steps: [quote(items)] }) as {
    results: { premium: number }[];
  };

describe("MHPCO Claim Office", () => {
  // Edge: empty
  it("empty item list → premium 5 G (only processing fee)", () => {
    expect(runQuote(newcomer, []).results[0].premium).toBe(5);
  });

  // Base premiums per item type
  it("single sword, newcomer → 115 G", () => {
    expect(runQuote(newcomer, [{ type: "sword" }]).results[0].premium).toBe(115);
  });
  it("single amulet, newcomer → 71 G", () => {
    expect(runQuote(newcomer, [{ type: "amulet" }]).results[0].premium).toBe(71);
  });
  it("single staff, newcomer → 93 G", () => {
    expect(runQuote(newcomer, [{ type: "staff" }]).results[0].premium).toBe(93);
  });
  it("single potion, newcomer → 49 G", () => {
    expect(runQuote(newcomer, [{ type: "potion" }]).results[0].premium).toBe(49);
  });

  // Components — basic
  it("1 rune → 33 G premium (25 + 2.5 first → ceil 28 + 5 fee)", () => {
    expect(runQuote(newcomer, [{ type: "rune" }]).results[0].premium).toBe(33);
  });

  it("2 runes → 50 G base (no block); premium = 50 + 5 first + 5 = 60 G", () => {
    // 2*25 = 50 base; first-ins = 2*2.5 = 5; total = 55, +5 fee = 60
    expect(
      runQuote(newcomer, [{ type: "rune" }, { type: "rune" }]).results[0].premium,
    ).toBe(60);
  });

  it("3 runes → 60 G base premium (block applies); premium = 60 + 7.5 first → ceil 68 + 5 fee = 73 G", () => {
    // base sum (block) = 60; first-ins per item = 3*2.5 = 7.5; total 67.5, ceil 68 + 5 = 73
    expect(
      runQuote(newcomer, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]).results[0].premium,
    ).toBe(73);
  });

  it("4 runes → 100 G base premium (no block — requires exactly 3); premium = 100 + 10 first + 5 = 115 G", () => {
    expect(
      runQuote(newcomer, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]).results[0].premium,
    ).toBe(115);
  });

  it("7 runes → 175 G base premium (no block forms from 7)", () => {
    // 7*25 = 175 base; first-ins = 7*2.5 = 17.5; total = 192.5, ceil 193 + 5 = 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runQuote(newcomer, items).results[0].premium).toBe(198);
  });

  // Alike components clarification
  it("2 runes + 1 moonstone → 75 G base premium (no block — different types)", () => {
    // base = 3*25 = 75; first-ins = 3*2.5 = 7.5; total 82.5, ceil 83 + 5 = 88
    expect(
      runQuote(newcomer, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]).results[0].premium,
    ).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // base = 60 + 60 = 120; first-ins = 6*2.5 = 15; total 135 + 5 fee = 140
    expect(
      runQuote(newcomer, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]).results[0].premium,
    ).toBe(140);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet, newcomer → cursed surcharge only on sword's base", () => {
    // sword: 100 + 50 cursed + 10 first = 160
    // amulet: 60 + 6 first = 66
    // total 226 + 5 fee = 231
    expect(
      runQuote(newcomer, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]).results[0].premium,
    ).toBe(231);
  });

  // Modifier thresholds
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword: base 100 + 10 first = 110; loyalty -20% of 100 = -20; total 90 + 5 = 95
    expect(
      runQuote({ yearsWithMHPCO: 2 }, [{ type: "sword" }]).results[0].premium,
    ).toBe(95);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // base 100 + high 30 + first 10 = 140 + 5 = 145
    expect(
      runQuote(newcomer, [{ type: "sword", enchantment: 5 }]).results[0].premium,
    ).toBe(145);
  });

  it("cursed sword with exactly enchantment 5 → both surcharges apply", () => {
    // 100 + 50 + 30 + 10 = 190 + 5 = 195
    expect(
      runQuote(newcomer, [
        { type: "sword", enchantment: 5, cursed: true },
      ]).results[0].premium,
    ).toBe(195);
  });

  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // base 100 + 10 first = 110 + 5 = 115
    expect(
      runQuote(newcomer, [{ type: "sword", enchantment: 4 }]).results[0].premium,
    ).toBe(115);
  });

  // Rounding in MHPCO's favor — premium
  it("premium that yields 197.5 G → final 198 G (rounded up)", () => {
    // 7 runes case: base 175 + first 17.5 = 192.5; need 197.5 for the spec example.
    // Use 7 runes + processing — actually 7 runes yields 192.5 + 5 = 197.5 → 198? No,
    // the spec line is "a premium calculation that yields 197.5 G → final premium 198 G".
    // 192.5 ceiled is 193; 193 + 5 = 198. So this is the same 7-runes scenario.
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runQuote(newcomer, items).results[0].premium).toBe(198);
  });

  // Integration examples
  it("Newcomer with cursed sword (steel, enchantment 3) → 165 G", () => {
    // 100 + 50 curse + 10 first = 160 + 5 = 165
    expect(
      runQuote(newcomer, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]).results[0].premium,
    ).toBe(165);
  });

  it("Long-standing customer's second contract: cursed sword enchantment 7 → 160 G", () => {
    // 3 years, second quote. First quote any item, then cursed sword e7.
    // 100 + 50 curse + 30 high + 10 first - 20 loyalty - 15 follow-up = 155 + 5 = 160
    const result = runScenario({
      customer: longstanding,
      steps: [
        quote([{ type: "potion" }]),
        quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ],
    }) as { results: { premium: number }[] };
    expect(result.results[1].premium).toBe(160);
  });

  // Edge — unknown item type at quote
  it("quote with unknown item type → throws", () => {
    expect(() =>
      runScenario({ customer: newcomer, steps: [quote([{ type: "broomstick" }])] }),
    ).toThrow();
  });

  // Claim — basics
  it("regular sword (steel, enchantment 3), damage 500 → payout 400", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 3 }]),
        claim(0, [{ itemType: "sword", amount: 500 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("damage to a rune (250 insurance), damage 200 → payout 100", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "rune" }]),
        claim(0, [{ itemType: "rune", amount: 200 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1].payout).toBe(100);
  });

  // Claim — enchantment threshold
  it("steel sword, enchantment 9, damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 9 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(400);
  });

  // Claim — dragon material
  it("dragon sword, enchantment 5, damage 800 → payout 700 (full minus deductible)", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 5 }]),
        claim(0, [{ itemType: "sword", amount: 800 }]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(700);
  });

  // Claim — enchantment vs dragon material
  it("dragon sword, enchantment 9, damage 1000 → payout 400 (50% wins)", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 9 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(400);
  });

  it("dragon sword, exactly enchantment 8, damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 8 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(400);
  });

  // Deductible per damage event (per damaged item)
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total 600
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet" },
        ]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(600);
  });

  // Multiple items of the same type
  it("two swords policy → insurance sum 2000, cap 4000", () => {
    // Verify via a claim that drains cap eventually.
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ]),
        claim(0, [{ itemType: "sword", amount: 200 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    // 200 - 100 = 100, remainingCap = 4000 - 100 = 3900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });

  it("two swords policy with two sword damage entries → each gets own deductible", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ],
    }) as { results: { payout?: number }[] };
    // (500-100) + (500-100) = 800
    expect(result.results[1].payout).toBe(800);
  });

  it("only one sword insured but two sword damage entries → throws", () => {
    expect(() =>
      runScenario({
        customer: newcomer,
        steps: [
          quote([{ type: "sword", material: "steel", enchantment: 3 }]),
          claim(0, [
            { itemType: "sword", amount: 100 },
            { itemType: "sword", amount: 100 },
          ]),
        ],
      }),
    ).toThrow();
  });

  // Cap exhaustion
  it("policy with sword and amulet → insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet" },
        ]),
        claim(0, [{ itemType: "sword", amount: 200 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    // payout 100; remaining 3200 - 100 = 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });

  it("cursed sword → cap 2000 (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", cursed: true, material: "steel", enchantment: 3 }]),
        claim(0, [{ itemType: "sword", amount: 200 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  it("sword + 3 runes (block) → insurance sum 1750 G; cap 3500 G; block discount only affects premium", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
        claim(0, [{ itemType: "sword", amount: 200 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    // remainingCap should be 3500 - 100 = 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  it("sword (cap 2000), two successive 1500 G claims → 1400, then 600", () => {
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 3 }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
      ],
    }) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Rounding — payout
  it("payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    // dragon sword enchant >=8 halves; damage 901 → 450.5; - 100 = 350.5 → floor 350
    const result = runScenario({
      customer: newcomer,
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 8 }]),
        claim(0, [{ itemType: "sword", amount: 901 }]),
      ],
    }) as { results: { payout?: number }[] };
    expect(result.results[1].payout).toBe(350);
  });

  // Claim errors
  it("claim references damage entry for item not in policy → throws", () => {
    expect(() =>
      runScenario({
        customer: newcomer,
        steps: [
          quote([{ type: "sword", material: "steel", enchantment: 3 }]),
          claim(0, [{ itemType: "amulet", amount: 100 }]),
        ],
      }),
    ).toThrow();
  });

  it("claim references damage with unknown item type → throws", () => {
    expect(() =>
      runScenario({
        customer: newcomer,
        steps: [
          quote([{ type: "sword", material: "steel", enchantment: 3 }]),
          claim(0, [{ itemType: "broomstick", amount: 100 }]),
        ],
      }),
    ).toThrow();
  });

  it("claim with damage amount -200 → throws", () => {
    expect(() =>
      runScenario({
        customer: newcomer,
        steps: [
          quote([{ type: "sword", material: "steel", enchantment: 3 }]),
          claim(0, [{ itemType: "sword", amount: -200 }]),
        ],
      }),
    ).toThrow();
  });
});
