import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { type InsuredItem, runScenario } from "./claim-office";

function premiumFor(items: InsuredItem[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return results[0].premium as number;
}

function premiumsForSuccessiveQuotes(items: InsuredItem[], yearsWithMHPCO: number): number[] {
  const quoteStep = { op: "quote" as const, items };
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [quoteStep, quoteStep] });
  return results.map((result) => result.premium as number);
}

type ReportedDamage = { itemType: string; amount: number };

// `policy` is the zero-based step index of the quote step that created the policy.
function claimAgainstPolicy(policy: number, damages: ReportedDamage[]) {
  return { op: "claim" as const, policy, incident: { cause: "dragon attack", damages } };
}

function claimAgainst(insuredItems: InsuredItem[], damages: ReportedDamage[]) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items: insuredItems }, claimAgainstPolicy(0, damages)],
  });
  return results[1];
}

function payoutForDamagedSword(sword: Omit<InsuredItem, "type">, amount: number): number {
  return claimAgainst([{ type: "sword", ...sword }], [{ itemType: "sword", amount }]).payout as number;
}

function alikeComponents(type: string, count: number): InsuredItem[] {
  return Array.from({ length: count }, () => ({ type }));
}

describe("claim office quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("plain sword for newcomer -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet for newcomer -> 60 base + 6 first insurance + 5 fee = 71 G", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff for newcomer -> 80 base + 8 first insurance + 5 fee = 93 G", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("plain potion for newcomer -> 40 base + 4 first insurance + 5 fee = 49 G", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });
  it("2 runes -> 50 G base premium -> 55 + 5 = 60 G", () => {
    expect(premiumFor(alikeComponents("rune", 2))).toBe(60);
  });
  it("1 moonstone -> 25 G base premium -> 27.5 + 5 = 32.5 -> 33 G (rounded up)", () => {
    expect(premiumFor([{ type: "moonstone" }])).toBe(33);
  });
  it("3 runes -> 60 G base premium (block) -> 66 + 5 = 71 G", () => {
    expect(premiumFor(alikeComponents("rune", 3))).toBe(71);
  });
  it("4 runes -> 100 G base premium (no block) -> 110 + 5 = 115 G", () => {
    expect(premiumFor(alikeComponents("rune", 4))).toBe(115);
  });
  it("7 runes -> 175 G base premium -> 192.5 + 5 = 197.5 -> 198 G", () => {
    expect(premiumFor(alikeComponents("rune", 7))).toBe(198);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (different types, no block) -> 82.5 + 5 -> 88 G", () => {
    expect(premiumFor([...alikeComponents("rune", 2), { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two blocks) -> 132 + 5 = 137 G", () => {
    expect(premiumFor([...alikeComponents("rune", 3), ...alikeComponents("moonstone", 3)])).toBe(137);
  });
  it("newcomer with a cursed sword (steel, enchantment 3) -> 165 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("cursed sword + plain amulet -> 160 base + 50 curse on sword only + 16 first insurance + 5 fee = 231 G", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> 115 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> 30 % surcharge -> 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges -> 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("customer with exactly 2 years -> loyalty discount -> 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount -> 115 G", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("second quote in the scenario -> 15 % follow-up discount -> 100 + 10 - 15 + 5 = 100 G", () => {
    expect(premiumsForSuccessiveQuotes([{ type: "sword" }], 0)).toEqual([115, 100]);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 -> 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(premiumsForSuccessiveQuotes([cursedSword], 3)[1]).toBe(160);
  });
  it("cursed sword + 2 runes on second quote -> 197.5 G -> 198 G (rounded up in MHPCO's favor)", () => {
    const premiums = premiumsForSuccessiveQuotes([{ type: "sword", cursed: true }, ...alikeComponents("rune", 2)], 0);
    expect(premiums[1]).toBe(198);
  });
  it("quote with unknown item type broomstick -> runScenario throws an Error", () => {
    expect(() => premiumFor([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("claim office claim", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remaining cap 1600", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimAgainst([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100, remaining cap 400", () => {
    expect(claimAgainst([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("amulet schema example, damage 200 -> payout 100, remaining cap 1100", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(claimAgainst([amulet], [{ itemType: "amulet", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("staff insurance value 800 -> damage 200 -> payout 100, remaining cap 1500", () => {
    expect(claimAgainst([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("potion insurance value 400 -> damage 200 -> payout 100, remaining cap 700", () => {
    expect(claimAgainst([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % then deductible)", () => {
    expect(payoutForDamagedSword({ material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    expect(payoutForDamagedSword({ material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    expect(payoutForDamagedSword({ material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 -> payout 400", () => {
    expect(payoutForDamagedSword({ material: "dragon", enchantment: 8 }, 1000)).toBe(400);
  });
  it("steel sword enchantment 9, damage 901 -> 350.5 -> payout 350 (rounded down)", () => {
    expect(payoutForDamagedSword({ material: "steel", enchantment: 9 }, 901)).toBe(350);
  });
  it("dragon attack damages sword 500 and amulet 300 -> payout 600 (deductible per damaged item)", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("damage below deductible, sword damage 50 -> payout 0 (payout never negative)", () => {
    expect(claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("two swords insured -> cap 4000; both damaged 1000 each -> payout 1800, remaining cap 2200", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 1000 },
        { itemType: "sword", amount: 1000 },
      ],
    );
    expect(result).toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it("two swords, first plain second enchantment 9 -> damages consume items in order -> 900 + 400 = 1300", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "sword", enchantment: 9 }],
      [
        { itemType: "sword", amount: 1000 },
        { itemType: "sword", amount: 1000 },
      ],
    );
    expect(result.payout).toBe(1300);
  });
  it("sword + amulet -> cap 3200; damage 2000 + 1500 -> payout 3200 capped, remaining cap 0", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 2000 },
        { itemType: "amulet", amount: 1500 },
      ],
    );
    expect(result).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword -> cap 2000 based on unmodified insurance value; damage 2500 -> payout 2000, remaining 0", () => {
    const result = claimAgainst([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 2500 }]);
    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes block -> insurance sum 1750, cap 3500; sword damage 1100 -> payout 1000, remaining 2500", () => {
    const result = claimAgainst([{ type: "sword" }, ...alikeComponents("rune", 3)], [{ itemType: "sword", amount: 1100 }]);
    expect(result).toEqual({ payout: 1000, remainingCap: 2500 });
  });
  it("sword, two successive claims of 1500 -> 1400 remaining 600, then 600 remaining 0", () => {
    const claimStep = claimAgainstPolicy(0, [{ itemType: "sword", amount: 1500 }]);
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep, claimStep],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claims on separate policies keep separate caps", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        claimAgainstPolicy(0, [{ itemType: "sword", amount: 2500 }]),
        claimAgainstPolicy(1, [{ itemType: "amulet", amount: 300 }]),
      ],
    });
    expect(results.slice(2)).toEqual([
      { payout: 2000, remainingCap: 0 },
      { payout: 200, remainingCap: 1000 },
    ]);
  });
  it("two sword damages with only one sword insured -> runScenario throws an Error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimAgainst([{ type: "sword" }], damages)).toThrow(/sword/);
  });
  it("amulet damaged when only a sword is insured -> runScenario throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
  });
  it("damage for unknown item type broomstick -> runScenario throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
  });
  it("damage with amount -200 -> runScenario throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
  });
});

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

// The schema example: a silver amulet is insured, then a fire causes the reported damages.
const amuletPolicyThenFireClaim = (damages: ReportedDamage[]) => [
  { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
  { op: "claim", policy: 0, incident: { cause: "fire", damages } },
];

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes results JSON to stdout with exit code 0", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 5 }, steps: amuletPolicyThenFireClaim([{ itemType: "amulet", amount: 200 }]) });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("unknown quote item type -> non-zero exit, error on stderr, nothing on stdout", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick/);
    expect(cli.stdout).toBe("");
  });
  it("claim damage for an uninsured item -> non-zero exit, error on stderr", () => {
    const steps = amuletPolicyThenFireClaim([{ itemType: "sword", amount: 200 }]);
    const cli = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/sword/);
  });
  it("negative damage amount -> non-zero exit, error on stderr", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 5 }, steps: amuletPolicyThenFireClaim([{ itemType: "amulet", amount: -200 }]) });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/-200/);
  });
  it.todo("more damages of a type than insured -> non-zero exit, whole claim rejected");
});
