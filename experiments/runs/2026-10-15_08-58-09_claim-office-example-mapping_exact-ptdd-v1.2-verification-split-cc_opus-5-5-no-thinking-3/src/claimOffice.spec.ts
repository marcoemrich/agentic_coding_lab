import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claimOffice.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number => {
  const output = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (output.results[0] as { premium: number }).premium;
};

type Damage = { itemType: string; amount: number };

const claimStep = (damages: Damage[], policy = 0) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "dragon attack", damages },
});

const claimResults = (items: Item[], ...claims: Damage[][]) => {
  const steps = [{ op: "quote" as const, items }, ...claims.map((damages) => claimStep(damages))];
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1);
};

const runCli = (scenario: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

describe("claim office", () => {
  it("quote with empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("newcomer quotes a plain sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }])).toBe(115);
  });
  it("newcomer quotes a plain amulet -> premium 71 G (60 + 6 + 5)", () => {
    expect(quotePremium([{ type: "amulet" }])).toBe(71);
  });
  it("newcomer quotes a plain staff -> premium 93 G (80 + 8 + 5)", () => {
    expect(quotePremium([{ type: "staff" }])).toBe(93);
  });
  it("newcomer quotes a plain potion -> premium 49 G (40 + 4 + 5)", () => {
    expect(quotePremium([{ type: "potion" }])).toBe(49);
  });
  it("newcomer quotes one rune -> premium 33 G (25 + 2.5 + 5 = 32.5 rounded up)", () => {
    expect(quotePremium([{ type: "rune" }])).toBe(33);
  });
  it("newcomer quotes 3 runes -> premium 71 G (block base 60 + 6 + 5)", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("newcomer quotes 2 runes and 1 moonstone -> premium 88 G (base 75, no block, 87.5 rounded up)", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("newcomer quotes a cursed sword -> premium 165 G (100 + 50 curse + 10 first + 5)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("newcomer quotes a sword with exactly enchantment 5 -> premium 145 G (100 + 30 + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("customer with exactly 2 years quotes a plain sword -> premium 95 G (100 - 20 loyalty + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
  });
  it("second quote in a scenario gets follow-up discount -> premiums 115 G then 100 G (100 + 10 - 15 + 5)", () => {
    const sword = { op: "quote" as const, items: [{ type: "sword" }] };
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword] });
    expect(output.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("claim on steel sword enchantment 3, damage 500 G -> payout 400 G, remainingCap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("claim on rune, damage 200 G -> payout 100 G, remainingCap 400 G (insurance value 250)", () => {
    expect(claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("policy with sword and amulet, sword damaged 500 G -> payout 400 G, remainingCap 2800 G (cap 3200)", () => {
    expect(claimResults([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 2800 },
    ]);
  });
  it("claim on staff, damage 300 G -> payout 200 G, remainingCap 1400 G (insurance value 800)", () => {
    expect(claimResults([{ type: "staff" }], [{ itemType: "staff", amount: 300 }])).toEqual([
      { payout: 200, remainingCap: 1400 },
    ]);
  });
  it("claim on potion, damage 300 G -> payout 200 G, remainingCap 600 G (insurance value 400)", () => {
    expect(claimResults([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual([
      { payout: 200, remainingCap: 600 },
    ]);
  });
  it("claim on moonstone, damage 300 G -> payout 200 G, remainingCap 300 G (insurance value 250)", () => {
    expect(claimResults([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 300 }])).toEqual([
      { payout: 200, remainingCap: 300 },
    ]);
  });
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G, remainingCap 1600 G (50 % then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("steel sword enchantment 9, damage 901 G -> payout 350 G (350.5 rounded down), remainingCap 1650 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 901 }])).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it("two successive 1500 G claims on a sword -> payout 1400 G / remainingCap 600 G, then payout 600 G / remainingCap 0 G", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    expect(claimResults([{ type: "sword" }], damage, damage)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("CLI runs the schema example -> exit 0 and stdout results [{premium 59}, {payout 100, remainingCap 1100}]", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        claimStep([{ itemType: "amulet", amount: 200 }]),
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI quote with unknown item type broomstick -> non-zero exit, error naming broomstick on stderr, no results on stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).not.toContain("results");
  });
  it("CLI claim damaging an amulet when only a sword is insured -> non-zero exit, error naming amulet on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep([{ itemType: "amulet", amount: 200 }])],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
  });
  it("CLI claim with two sword damages but only one sword insured -> non-zero exit, whole claim rejected", () => {
    const damage = { itemType: "sword", amount: 500 };
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep([damage, damage])],
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).not.toContain("results");
  });
  it("CLI claim with damage amount -200 -> non-zero exit, error naming -200 on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep([{ itemType: "sword", amount: -200 }])],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("-200");
  });

  describe("verification", () => {
    it("dragon attack damages sword 500 G and amulet 300 G -> payout 600 G, remainingCap 2600 G (deductible per item)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(claimResults([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
    it("newcomer quotes a cursed sword and a plain amulet -> premium 231 G (curse 50 on sword only: 210 + 16 + 5)", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
    it("newcomer quotes a sword and an amulet -> premium 181 G (policy base 160 + 16 + 5)", () => {
      expect(quotePremium([{ type: "sword" }, { type: "amulet" }])).toBe(181);
    });
    it("newcomer quotes 2 runes -> premium 60 G (base 50) -- per-component price, item sum", () => {
      expect(quotePremium(runes(2))).toBe(60);
    });
    it("newcomer quotes 4 runes -> premium 115 G (base 100, block requires exactly 3) -- block rule", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("newcomer quotes 7 runes -> premium 198 G (base 175, 197.5 rounded up) -- block rule, rounding up", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("newcomer quotes 3 runes and 3 moonstones -> premium 137 G (base 120, two blocks) -- per-type grouping", () => {
      const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quotePremium([...runes(3), ...moonstones])).toBe(137);
    });
    it("newcomer quotes a sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge) -- threshold", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("newcomer quotes a cursed sword with enchantment 5 -> premium 195 G (both surcharges) -- curse, enchantment", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("newcomer quotes a cursed sword with enchantment 4 -> premium 165 G (curse only) -- curse, threshold", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("customer with 1 year quotes a plain sword -> premium 115 G (no loyalty) -- loyalty threshold", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("3-year customer's second quote of a cursed sword enchantment 7 -> premium 160 G -- all modifiers", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(output.results).toEqual([{ premium: 59 }, { premium: 160 }]);
    });
    it("third quote in a scenario also gets follow-up discount -> premiums 115, 100, 100 G -- follow-up rule", () => {
      const sword = { op: "quote" as const, items: [{ type: "sword" }] };
      const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword, sword] });
      expect(output.results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
    });
    it("policy with two swords, both damaged 500 G -> payout 800 G, remainingCap 3200 G (cap 4000) -- per-damage deductible", () => {
      const damage = { itemType: "sword", amount: 500 };
      expect(claimResults([{ type: "sword" }, { type: "sword" }], [damage, damage])).toEqual([
        { payout: 800, remainingCap: 3200 },
      ]);
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G -> payout 400 G -- enchantment clause", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G -- 50 % rule wins", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G, remainingCap 1300 G -- full reimbursement", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimResults([sword], [{ itemType: "sword", amount: 800 }])).toEqual([{ payout: 700, remainingCap: 1300 }]);
    });
    it("cursed sword policy, damage 500 G -> payout 400 G, remainingCap 1600 G (cap from unmodified value) -- cap", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(claimResults([sword], [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("policy with sword and 3 runes, sword damaged 500 G -> payout 400 G, remainingCap 3100 G (sum 1750) -- cap", () => {
      expect(claimResults([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }])).toEqual([
        { payout: 400, remainingCap: 3100 },
      ]);
    });
    it("two enchantment-9 swords damaged 901 G each -> payout 701 G, remainingCap 3299 G (only final payout rounded)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      const damage = { itemType: "sword", amount: 901 };
      expect(claimResults([sword, sword], [damage, damage])).toEqual([{ payout: 701, remainingCap: 3299 }]);
    });
    it("claims against two separate sword policies keep separate caps -> each 1500 G claim pays 1400 G, remainingCap 600 G", () => {
      const sword = { op: "quote" as const, items: [{ type: "sword" }] };
      const damages = [{ itemType: "sword", amount: 1500 }];
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [sword, sword, claimStep(damages, 0), claimStep(damages, 1)],
      });
      expect(output.results.slice(2)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 1400, remainingCap: 600 },
      ]);
    });
    it("CLI claim damaging an unknown item type -> non-zero exit, error on stderr -- not-in-policy check", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep([{ itemType: "broomstick", amount: 200 }])],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("broomstick");
    });
  });
});
