import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type Item, type StepResult } from "./claimOffice.js";

const newcomer = { yearsWithMHPCO: 0 };

function quote(items: Item[], customer = newcomer): number | undefined {
  return runScenario({ customer, steps: [{ op: "quote", items }] }).results[0].premium;
}

function runCli(scenario: object): { status: number | null; stdout: string; stderr: string } {
  const { status, stdout, stderr } = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status, stdout, stderr };
}

function claim(items: Item[], ...damages: Damage[]): StepResult {
  return runScenario({
    customer: newcomer,
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];
}

function claimViaCli(insuredItems: Item[], ...damages: Damage[]): { status: number | null; stdout: string; stderr: string } {
  return runCli({
    customer: newcomer,
    steps: [
      { op: "quote", items: insuredItems },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
}

function runes(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: "rune" }));
}

describe("MHPCO claim office", () => {
  // quote: premium = item base premiums (+ item surcharges) + policy-wide modifiers + 5 G fee
  it("quote with empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
  it("quote for a plain sword, newcomer -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quote for a plain amulet, newcomer -> 60 + 6 + 5 = 71 G", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quote for a plain staff, newcomer -> 80 + 8 + 5 = 93 G", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quote for a plain potion, newcomer -> 40 + 4 + 5 = 49 G", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quote for 2 runes -> 50 G base premium -> 50 + 5 + 5 = 60 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quote for 3 runes -> block 60 G base premium -> 60 + 6 + 5 = 71 G", () => {
    expect(quote(runes(3))).toBe(71);
  });
  it("quote for 7 runes -> 175 G base -> 197.5 G rounded up in MHPCO's favor to 198 G", () => {
    expect(quote(runes(7))).toBe(198);
  });
  it("quote for 2 runes + 1 moonstone -> no block (different types), 75 G base -> 87.5 rounded up to 88 G", () => {
    expect(quote([...runes(2), { type: "moonstone" }])).toBe(88);
  });
  it("quote for a cursed steel sword (enchantment 3), newcomer -> 100 + 50 curse + 10 first = 160 + 5 = 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quote for a cursed sword + plain amulet -> 160 base + 50 curse (sword only) + 16 first + 5 = 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("quote for a sword with exactly enchantment 5 -> 100 + 30 high enchantment + 10 + 5 = 145 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("quote for a sword, customer with exactly 2 years -> 100 - 20 loyalty + 10 + 5 = 95 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("second quote in a scenario for a sword, newcomer -> 100 + 10 first - 15 follow-up + 5 = 100 G", () => {
    const sword = { op: "quote" as const, items: [{ type: "sword" }] };
    const { results } = runScenario({ customer: newcomer, steps: [sword, sword] });
    expect(results[1].premium).toBe(100);
  });
  it("CLI: schema example on stdin -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI: quote with unknown item type broomstick -> non-zero exit, error on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: newcomer,
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  // claim: per damage (reimbursement - 100 deductible), total capped at remaining 2x insurance sum
  it("claim on a steel sword (enchantment 3), damage 500 G -> payout 400 G, remainingCap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claim([sword], { itemType: "sword", amount: 500 })).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune, damage 200 G -> payout 100 G, remainingCap 400 G (cap 2 x 250)", () => {
    expect(claim([{ type: "rune" }], { itemType: "rune", amount: 200 })).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim on a plain staff, damage 200 G -> payout 100 G, remainingCap 1500 G (cap 2 x 800)", () => {
    expect(claim([{ type: "staff" }], { itemType: "staff", amount: 200 })).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("claim on a plain potion, damage 200 G -> payout 100 G, remainingCap 700 G (cap 2 x 400)", () => {
    expect(claim([{ type: "potion" }], { itemType: "potion", amount: 200 })).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("claim on a moonstone, damage 200 G -> payout 100 G, remainingCap 400 G (cap 2 x 250)", () => {
    expect(claim([{ type: "moonstone" }], { itemType: "moonstone", amount: 200 })).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim: dragon attack on insured sword 500 G and amulet 300 G -> payout 600 G (deductible per item), remainingCap 2600 G", () => {
    expect(
      claim([{ type: "sword" }, { type: "amulet" }], { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claim on a steel sword with enchantment 9, damage 1000 G -> payout 400 G (50 % then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claim([sword], { itemType: "sword", amount: 1000 }).payout).toBe(400);
  });
  it("claim on a steel sword with enchantment 9, damage 901 G -> 350.5 G rounded down in MHPCO's favor to 350 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claim([sword], { itemType: "sword", amount: 901 }).payout).toBe(350);
  });
  it("claim with damage 50 G on a sword -> payout 0 G (reading: the deductible never makes a payout negative)", () => {
    expect(claim([{ type: "sword" }], { itemType: "sword", amount: 50 }).payout).toBe(0);
  });
  it("two successive 1500 G claims on a sword -> first payout 1400 G remainingCap 600 G, second payout 600 G remainingCap 0 G", () => {
    const swordClaim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const { results } = runScenario({
      customer: newcomer,
      steps: [{ op: "quote", items: [{ type: "sword" }] }, swordClaim, swordClaim],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("CLI: claim with two sword damages but only one sword insured -> non-zero exit, error on stderr, whole claim rejected", () => {
    const { status, stdout, stderr } = claimViaCli(
      [{ type: "sword" }],
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    );
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("CLI: claim with damage amount -200 -> non-zero exit, error on stderr", () => {
    const { status, stdout, stderr } = claimViaCli([{ type: "sword" }], { itemType: "sword", amount: -200 });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });

  describe("verification", () => {
    it("claim on a plain amulet, damage 200 G -> payout 100 G, remainingCap 1100 G (cap 2 x 600) -- amulet value forced by CLI schema example (test 16)", () => {
      expect(claim([{ type: "amulet" }], { itemType: "amulet", amount: 200 })).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("quote for 4 runes -> no block, 100 G base premium -> 100 + 10 + 5 = 115 G -- block requires exactly 3 (tests 6, 7)", () => {
      expect(quote(runes(4))).toBe(115);
    });
    it("quote for 3 runes + 3 moonstones -> two separate blocks, 120 G base -> 132 + 5 = 137 G -- per-type grouping, block", () => {
      expect(quote([...runes(3), { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(137);
    });
    it("quote for a sword with enchantment 4 -> no high-enchantment surcharge -> 115 G -- enchantment 5 threshold", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("quote for a cursed sword with enchantment 4 -> only curse surcharge -> 165 G -- curse, enchantment threshold", () => {
      expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("quote for a cursed sword with exactly enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G -- curse, enchantment", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("quote for a sword, customer with 1 year -> no loyalty discount -> 115 G -- loyalty threshold", () => {
      expect(quote([{ type: "sword" }], { yearsWithMHPCO: 1 })).toBe(115);
    });
    it("quote for sword + amulet, customer with 2 years -> loyalty on policy base: 160 - 32 + 16 + 5 = 149 G -- loyalty, multi-item", () => {
      expect(quote([{ type: "sword" }, { type: "amulet" }], { yearsWithMHPCO: 2 })).toBe(149);
    });
    it("integration: 3-year customer's second quote, cursed steel sword enchantment 7 -> 160 G -- all modifiers", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(results[1].premium).toBe(160);
    });
    it("claim on a dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G -- enchantment clause", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claim([sword], { itemType: "sword", amount: 1000 }).payout).toBe(400);
    });
    it("claim on a dragon-material sword with enchantment 9, damage 1000 G -> payout 400 G (50 % wins) -- enchantment clause", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claim([sword], { itemType: "sword", amount: 1000 }).payout).toBe(400);
    });
    it("claim on a dragon-material sword with enchantment 5, damage 800 G -> payout 700 G (full reimbursement) -- standard reimbursement", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claim([sword], { itemType: "sword", amount: 800 }).payout).toBe(700);
    });
    it("claim on a policy with two swords, both damaged 500 G and 300 G -> payout 600 G, remainingCap 3400 G (cap 4000) -- per-item deductible, insurance sum", () => {
      expect(
      claim([{ type: "sword" }, { type: "sword" }], { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }),
    ).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("claim on a cursed sword, damage 500 G -> payout 400 G, remainingCap 1600 G (cap from unmodified value 2000) -- cap", () => {
      expect(claim([{ type: "sword", cursed: true }], { itemType: "sword", amount: 500 })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("claim on sword + 3 runes, sword damage 500 G -> payout 400 G, remainingCap 3100 G (insurance sum 1750, cap 3500) -- rune value, sum", () => {
      expect(claim([{ type: "sword" }, ...runes(3)], { itemType: "sword", amount: 500 })).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("CLI: claim with amulet damage when only a sword is insured -> non-zero exit, error on stderr -- damage matching", () => {
      const { status, stdout, stderr } = claimViaCli([{ type: "sword" }], { itemType: "amulet", amount: 200 });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
    });
    it("CLI: claim with unknown damage item type -> non-zero exit, error on stderr -- damage matching", () => {
      const { status, stdout, stderr } = claimViaCli([{ type: "sword" }], { itemType: "broomstick", amount: 200 });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
    });
  });
});
