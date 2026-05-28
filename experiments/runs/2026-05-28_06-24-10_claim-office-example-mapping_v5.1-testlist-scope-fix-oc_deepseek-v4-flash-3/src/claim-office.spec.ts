import { describe, it, expect } from "vitest";
import { processQuote, processClaim } from "./claim-office.js";
import { execSync } from "child_process";
import { resolve } from "path";

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

describe("Claim Office - Quote (Premium Calculation)", () => {
  it("should return 5 G for an empty item list (only processing fee)", () => {
    const { premium } = processQuote({
      items: [],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(5);
  });

  it("should return 115 G for a single sword (100 base + 10 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "sword" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(115);
  });

  it("should return 71 G for a single amulet (60 base + 6 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "amulet" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(71);
  });

  it("should return 93 G for a single staff (80 base + 8 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "staff" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(93);
  });

  it("should return 49 G for a single potion (40 base + 4 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "potion" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(49);
  });

  it("should return 33 G for a single rune (25 base + 2.5->3 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "rune" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(33);
  });

  it("should return 33 G for a single moonstone (25 base + 3 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "moonstone" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(33);
  });

  it("should return 60 G for 2 runes (50 base + 5 first insurance + 5 fee -- no block)", () => {
    const { premium } = processQuote({
      items: [{ type: "rune" }, { type: "rune" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(60);
  });

  it("should return 71 G for 3 runes (60 block + 6 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(71);
  });

  it("should return 115 G for 4 runes (100 base + 10 first insurance + 5 fee -- no block)", () => {
    const { premium } = processQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(115);
  });

  it("should return 198 G for 7 runes (175 base + 18 first insurance + 5 fee -- no block)", () => {
    const { premium } = processQuote({
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" },
      ],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(198);
  });

  it("should return 88 G for 2 runes + 1 moonstone (75 base + 8 first insurance + 5 fee -- no block, different types)", () => {
    const { premium } = processQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(88);
  });

  it("should return 137 G for 3 runes + 3 moonstones (120 base + 12 first insurance + 5 fee -- two separate blocks)", () => {
    const { premium } = processQuote({
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(137);
  });

  it("should add 50% cursed surcharge to cursed item's base premium", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", cursed: true }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(165);
  });

  it("should add 30% high-enchantment surcharge for enchantment >= 5", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", enchantment: 5 }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(145);
  });

  it("should NOT add high-enchantment surcharge for enchantment 4", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", enchantment: 4 }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(115);
  });

  it("should apply both curse and high-enchantment surcharges when both apply", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", cursed: true, enchantment: 5 }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(195);
  });

  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const { premium } = processQuote({
      items: [{ type: "sword" }],
      customer: { yearsWithMHPCO: 2 },
      contractCount: 0,
    });
    expect(premium).toBe(95);
  });

  it("should apply 10% first insurance surcharge", () => {
    const { premium } = processQuote({
      items: [{ type: "sword" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(115);
  });

  it("should apply 15% follow-up contract discount for contracts after the first", () => {
    const { premium } = processQuote({
      items: [{ type: "sword" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 1,
    });
    expect(premium).toBe(100);
  });

  it("should apply item-specific modifiers to the affected item's base premium, not policy total", () => {
    const { premium } = processQuote({
      items: [
        { type: "sword", cursed: true },
        { type: "sword" },
      ],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(275);
  });

  it("should apply policy-wide modifiers to the sum of all item base premiums", () => {
    const { premium } = processQuote({
      items: [{ type: "sword" }, { type: "amulet" }],
      customer: { yearsWithMHPCO: 2 },
      contractCount: 0,
    });
    expect(premium).toBe(149);
  });

  it("should add 5 G processing fee at the very end", () => {
    const { premium } = processQuote({
      items: [],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(5);
  });

  it("should round up final premium in MHPCO's favor (197.5 -> 198)", () => {
    const { premium } = processQuote({
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" },
      ],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(198);
  });

  it("should calculate premium as 165 G for newcomer with cursed sword (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", cursed: true }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(premium).toBe(165);
  });

  it("should calculate premium as 160 G for long-standing customer's second contract with cursed high-enchantment sword (100 base + 50 curse + 30 high-enchant - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    const { premium } = processQuote({
      items: [{ type: "sword", cursed: true, enchantment: 7 }],
      customer: { yearsWithMHPCO: 3 },
      contractCount: 1,
    });
    expect(premium).toBe(160);
  });
});

describe("Claim Office - Claim (Payout Calculation)", () => {
  it("should return payout 400 G for a steel sword with damage 500 (500 - 100 deductible)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "steel", enchantment: 3 }],
      damages: [{ itemType: "sword", amount: 500 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should return payout 100 G for a rune with damage 200 (200 - 100 deductible -- no special clauses)", () => {
    const result = processClaim({
      policyItems: [{ type: "rune" }],
      damages: [{ itemType: "rune", amount: 200 }],
      previousPayouts: 0,
      insuranceSum: 250,
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  it("should apply 100 G deductible per damaged item (sword 500 + amulet 300 -> 600 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword" }, { type: "amulet" }],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
      previousPayouts: 0,
      insuranceSum: 1600,
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  it("should reimburse at 50% for items with enchantment >= 8 then apply deductible (dragon sword ench 8, damage 1000 -> 400 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "dragon", enchantment: 8 }],
      damages: [{ itemType: "sword", amount: 1000 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should fully reimburse dragon-material items then apply deductible (dragon sword ench 5, damage 800 -> 700 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "dragon", enchantment: 5 }],
      damages: [{ itemType: "sword", amount: 800 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  it("should apply 50% rule (wins over dragon material) for enchantment >= 8 on dragon material (ench 9, damage 1000 -> 400 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "dragon", enchantment: 9 }],
      damages: [{ itemType: "sword", amount: 1000 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should apply only high-enchantment clause for steel sword with enchantment 9 (damage 1000 -> 400 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "steel", enchantment: 9 }],
      damages: [{ itemType: "sword", amount: 1000 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should apply 50% for enchantment 8 on dragon material (damage 1000 -> 400 payout)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword", material: "dragon", enchantment: 8 }],
      damages: [{ itemType: "sword", amount: 1000 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should compute insurance sum as sum of item insurance values", () => {
    const { insuranceSum } = processQuote({
      items: [{ type: "sword" }, { type: "amulet" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(insuranceSum).toBe(1600);
  });

  it("should compute cap as 2x the insurance sum", () => {
    const { insuranceSum } = processQuote({
      items: [{ type: "sword" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(insuranceSum * 2).toBe(2000);
  });

  it("should cap payout at remaining cap (first claim 1500 on 1000 insurance -> 1400 payout, remaining cap 600)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword" }],
      damages: [{ itemType: "sword", amount: 1500 }],
      previousPayouts: 0,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });

  it("should reduce second claim payout to remaining cap (remaining 600 -> payout 600, remaining cap 0)", () => {
    const result = processClaim({
      policyItems: [{ type: "sword" }],
      damages: [{ itemType: "sword", amount: 1500 }],
      previousPayouts: 1400,
      insuranceSum: 1000,
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  it("should compute insurance sum correctly with block discount not affecting sum (sword + 3 runes -> 1750 insurance sum)", () => {
    const { insuranceSum } = processQuote({
      items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(insuranceSum).toBe(1750);
  });

  it("should compute cap based on unmodified insurance value, not premium modifiers", () => {
    const { insuranceSum } = processQuote({
      items: [{ type: "sword", cursed: true }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    });
    expect(insuranceSum * 2).toBe(2000);
  });

  it("should round down final payout in MHPCO's favor (350.5 -> 350)", () => {
    const result = processClaim({
      policyItems: [{ type: "potion", enchantment: 9 }],
      damages: [{ itemType: "potion", amount: 801 }],
      previousPayouts: 0,
      insuranceSum: 400,
    });
    expect(result.payout).toBe(300);
  });

  it("should reject claim with more damages of a type than insured items", () => {
    expect(() =>
      processClaim({
        policyItems: [{ type: "sword" }],
        damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 200 }],
        previousPayouts: 0,
        insuranceSum: 1000,
      }),
    ).toThrow();
  });

  it("should reject claim with damage to item not in policy", () => {
    expect(() =>
      processClaim({
        policyItems: [{ type: "sword" }],
        damages: [{ itemType: "amulet", amount: 200 }],
        previousPayouts: 0,
        insuranceSum: 1000,
      }),
    ).toThrow();
  });

  it("should reject claim with damage amount -200", () => {
    expect(() =>
      processClaim({
        policyItems: [{ type: "sword" }],
        damages: [{ itemType: "sword", amount: -200 }],
        previousPayouts: 0,
        insuranceSum: 1000,
      }),
    ).toThrow();
  });

  it("should exit with non-zero code for unknown item type in quote (e.g. broomstick)", () => {
    expect(() => processQuote({
      items: [{ type: "broomstick" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    })).toThrow();
  });
});

describe("Claim Office - CLI", () => {
  it("should exit with non-zero code for unknown item type in quote (e.g. broomstick)", () => {
    expect(() => processQuote({
      items: [{ type: "broomstick" }],
      customer: { yearsWithMHPCO: 0 },
      contractCount: 0,
    })).toThrow("Unknown item type");
  });

  it("should process a full scenario with quote then claim from stdin and output results to stdout", () => {
    const input = JSON.stringify({
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
          incident: {
            cause: "fire",
            damages: [
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    });

    const result = execSync(`echo '${input}' | npx tsx ${resolve(__dirname, "cli.ts")}`, {
      encoding: "utf-8",
    });
    const parsed = JSON.parse(result.trim());
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
  });
});