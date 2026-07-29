import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import {
  processScenario,
  type QuoteItem,
  type Damage,
} from "./claim-office.js";

const premiumFor = (items: QuoteItem[], yearsWithMHPCO = 0): number => {
  const output = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (output.results[0] as { premium: number }).premium;
};

const claimFor = (
  policyItems: QuoteItem[],
  damages: Damage[],
  yearsWithMHPCO = 0,
): { payout: number; remainingCap: number } => {
  const output = processScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items: policyItems },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return output.results[1] as { payout: number; remainingCap: number };
};

const runCli = (input: unknown) =>
  spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });

describe("MHPCO Claim Office", () => {
  // --- Base premiums & processing fee ---
  it("should return premium 5 for an empty item list (only the processing fee)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("should return premium 115 for a single sword (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("should return premium 71 for a single amulet (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("should return premium 93 for a single staff (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("should return premium 49 for a single potion (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });

  // --- Components & building blocks ---
  it("should return premium 33 for a single rune (25 base + 2.50 first insurance rounded up + 5 fee)", () => {
    expect(premiumFor([{ type: "rune" }])).toBe(33);
  });
  it("should return premium 60 for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("should return premium 71 for 3 runes (building block: 60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("should return premium 115 for 4 runes (no block -- block requires exactly 3)", () => {
    expect(
      premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(115);
  });
  it("should return premium 198 for 7 runes (197.5 rounded up in the MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(premiumFor(sevenRunes)).toBe(198);
  });
  it("should return premium 88 for 2 runes + 1 moonstone (no block: different types; 87.5 rounded up)", () => {
    expect(
      premiumFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });
  it("should return premium 137 for 3 runes + 3 moonstones (two separate blocks: 120 base)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(premiumFor(items)).toBe(137);
  });

  // --- Item modifiers ---
  it("should return premium 165 for a cursed sword (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    ).toBe(165);
  });
  it("should return premium 145 for a sword with enchantment exactly 5 (high-enchantment surcharge applies)", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 5 }])).toBe(145);
  });
  it("should return premium 115 for a sword with enchantment 4 (no high-enchantment surcharge)", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 4 }])).toBe(115);
  });
  it("should return premium 195 for a cursed sword with enchantment 5 (both item surcharges stack)", () => {
    expect(
      premiumFor([{ type: "sword", material: "steel", enchantment: 5, cursed: true }]),
    ).toBe(195);
  });

  // --- Policy modifiers ---
  it("should apply the 20% loyalty discount for a customer with exactly 2 years (sword -> 95)", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("should not apply the loyalty discount below 2 years (1 year, sword -> 115)", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("should apply the cursed surcharge only to the cursed item (cursed sword + plain amulet -> 231)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(premiumFor(items)).toBe(231);
  });
  it("should give a 15% follow-up discount on the second quote (two sword quotes -> 115 then 100)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(output.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("should combine all modifiers for a long-standing customer's second contract (cursed sword enchantment 7 -> 160)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1 }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(output.results).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  // --- Claims ---
  it("should pay 400 for a regular sword (steel, enchantment 3) with damage 500, remainingCap 1600", () => {
    const result = claimFor(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("should pay 100 for a rune with damage 200 (components have no special clause), remainingCap 400");
  it.todo("should pay 400 for a dragon sword with enchantment exactly 8 and damage 1000 (50% rule, then deductible)");
  it.todo("should pay 400 for a dragon sword with enchantment 9 and damage 1000 (the 50% rule beats the dragon clause)");
  it.todo("should pay 700 for a dragon sword with enchantment 5 and damage 800 (dragon clause: full reimbursement)");
  it.todo("should pay 400 for a steel sword with enchantment 9 and damage 1000 (high-enchantment clause only)");
  it.todo("should apply the deductible per damaged item (sword 500 + amulet 300 -> payout 600, remainingCap 2600)");
  it.todo("should treat two sword damage entries as separate damages on a two-sword policy (sum 2000, cap 4000)");
  it.todo("should base the cap on the unmodified insurance value (cursed sword, damage 2500 -> payout 2000, remaining 0)");
  it.todo("should not let the block discount reduce the insurance sum (sword + 3 runes -> sum 1750, cap 3500)");
  it.todo("should reduce later payouts to the remaining cap (two 1500 claims -> 1400/600 then 600/0)");
  it.todo("should round payouts down in the MHPCO's favor (damage 901 on an enchantment-8 sword -> 350)");

  // --- CLI contract & error cases ---
  it.todo("CLI should process the schema example end-to-end (premium 59; payout 100, remainingCap 1100)");
  it.todo("CLI should exit non-zero with stderr and no stdout results for an unknown item type in a quote");
  it.todo("CLI should exit non-zero with stderr when a claim damages an item not covered by the policy");
  it.todo("CLI should exit non-zero with stderr when a claim damages an item of unknown type");
  it.todo("CLI should exit non-zero with stderr when a claim has more damages of a type than the policy covers");
  it.todo("CLI should exit non-zero with stderr for a negative damage amount");
});
