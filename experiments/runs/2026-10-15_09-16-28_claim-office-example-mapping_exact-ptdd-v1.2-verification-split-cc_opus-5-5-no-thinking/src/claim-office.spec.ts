import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));

const quote = (items: Item[]) => ({ op: "quote" as const, items });

type Damage = { itemType: string; amount: number };

const claim = (policy: number, ...damages: Damage[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "dragon attack", damages },
});

function claimResultsFor(insuredItems: Item[], ...claims: Damage[][]) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [quote(insuredItems), ...claims.map((damages) => claim(0, ...damages))],
  });
  return results.slice(1);
}

function runCli(scenario: unknown) {
  return spawnSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

function premiumsFor(yearsWithMHPCO: number, ...quotes: Item[][]): number[] {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: quotes.map(quote) });
  return results.map((result) => (result as { premium: number }).premium);
}

describe("MHPCO Claim Office", () => {
  // quote
  it("quote with empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumsFor(0, [])).toEqual([5]);
  });
  it("newcomer quotes a plain sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumsFor(0, [{ type: "sword" }])).toEqual([115]);
  });
  it("newcomer quotes a plain amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumsFor(0, [{ type: "amulet" }])).toEqual([71]);
  });
  it("newcomer quotes a plain staff -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumsFor(0, [{ type: "staff" }])).toEqual([93]);
  });
  it("newcomer quotes a plain potion -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumsFor(0, [{ type: "potion" }])).toEqual([49]);
  });
  it("2 runes -> 50 G base premium -> premium 60 G", () => {
    expect(premiumsFor(0, runes(2))).toEqual([60]);
  });
  it("3 runes -> 60 G block base premium -> premium 71 G", () => {
    expect(premiumsFor(0, runes(3))).toEqual([71]);
  });
  it("7 runes -> 175 G base premium, 197.5 G rounded up in MHPCO's favor -> premium 198 G", () => {
    expect(premiumsFor(0, runes(7))).toEqual([198]);
  });
  it("2 runes + 1 moonstone -> 75 G base premium, no block (different types) -> premium 88 G (87.5 rounded up)", () => {
    expect(premiumsFor(0, [...runes(2), ...moonstones(1)])).toEqual([88]);
  });
  it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G", () => {
    expect(premiumsFor(0, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual([165]);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 G", () => {
    expect(premiumsFor(0, [{ type: "sword", enchantment: 5 }])).toEqual([145]);
  });
  it("customer with exactly 2 years with MHPCO quotes a plain sword -> loyalty discount applies -> premium 95 G", () => {
    expect(premiumsFor(2, [{ type: "sword" }])).toEqual([95]);
  });
  it("second quote in the scenario gets 15 % follow-up discount -> plain sword premiums 115 G then 100 G", () => {
    expect(premiumsFor(0, [{ type: "sword" }], [{ type: "sword" }])).toEqual([115, 100]);
  });
  it("quote with an unknown item type (broomstick) -> scenario is rejected with an Error", () => {
    expect(() => premiumsFor(0, [{ type: "broomstick" }])).toThrow(Error);
  });

  // claim
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    const regularSword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimResultsFor([regularSword], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResultsFor([steelSword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("payout yielding 350.5 G (steel sword enchantment 9, damage 901 G) -> payout 350 G (rounded down)", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResultsFor([steelSword], [{ itemType: "sword", amount: 901 }])).toEqual([
      { payout: 350, remainingCap: 1650 },
    ]);
  });
  it("dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (deductible per item), remaining cap 2600 G", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResultsFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResultsFor(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("damage to a staff (insurance value 800 G), damage 500 G -> payout 400 G, remaining cap 1200 G", () => {
    expect(claimResultsFor([{ type: "staff" }], [{ itemType: "staff", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1200 },
    ]);
  });
  it("damage to a potion (insurance value 400 G), damage 500 G -> payout 400 G, remaining cap 400 G", () => {
    expect(claimResultsFor([{ type: "potion" }], [{ itemType: "potion", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 400 },
    ]);
  });
  it("sword insured, two successive claims of 1500 G -> payouts 1400 G / 600 G, remaining caps 600 G / 0 G", () => {
    const swordDamage = { itemType: "sword", amount: 1500 };
    expect(claimResultsFor([{ type: "sword" }], [swordDamage], [swordDamage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claim damages an amulet when only a sword is insured -> scenario is rejected with an Error", () => {
    expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(Error);
  });
  it("claim with damage amount -200 -> scenario is rejected with an Error", () => {
    expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
  it("two sword damages but only one sword insured -> whole claim is rejected with an Error", () => {
    const swordDamage = { itemType: "sword", amount: 500 };
    expect(() => claimResultsFor([{ type: "sword" }], [swordDamage, swordDamage])).toThrow(Error);
  });

  // CLI
  it("CLI reads the scenario from stdin and writes {results} JSON to stdout with exit code 0 (schema example: premium 59 G, payout 100 G, remaining cap 1100 G)", () => {
    const schemaExample = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout } = runCli(schemaExample);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI with an unknown quote item type -> non-zero exit code, error description on stderr, nothing on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).toBe("");
  });

  describe("verification", () => {
    it("claim references the policy by zero-based quote step index -> amulet of policy 1 damaged 300 G -> payout 200 G, remaining cap 1000 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [quote([{ type: "sword" }]), quote([{ type: "amulet" }]), claim(1, { itemType: "amulet", amount: 300 })],
      });
      expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("cursed sword + plain amulet -> curse adds 50 G of the sword's base only (210 G) -> premium 231 G", () => {
      expect(premiumsFor(0, [{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual([231]);
    });
    it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks) -> premium 137 G", () => {
      expect(premiumsFor(0, [...runes(3), ...moonstones(3)])).toEqual([137]);
    });
    it("4 runes -> 100 G base premium, no block (block requires exactly 3) -> premium 115 G", () => {
      expect(premiumsFor(0, runes(4))).toEqual([115]);
    });
    it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
      expect(premiumsFor(0, [{ type: "sword", enchantment: 4 }])).toEqual([115]);
    });
    it("cursed sword with enchantment 4 -> only curse surcharge -> premium 165 G", () => {
      expect(premiumsFor(0, [{ type: "sword", enchantment: 4, cursed: true }])).toEqual([165]);
    });
    it("cursed sword with exactly enchantment 5 -> both surcharges -> premium 195 G", () => {
      expect(premiumsFor(0, [{ type: "sword", enchantment: 5, cursed: true }])).toEqual([195]);
    });
    it("cursed amulet -> curse applies to the amulet's base premium -> premium 101 G", () => {
      expect(premiumsFor(0, [{ type: "amulet", cursed: true }])).toEqual([101]);
    });
    it("staff with enchantment 6 -> high-enchantment surcharge on staff base -> premium 117 G", () => {
      expect(premiumsFor(0, [{ type: "staff", enchantment: 6 }])).toEqual([117]);
    });
    it("3 moonstones -> 60 G block base premium -> premium 71 G", () => {
      expect(premiumsFor(0, moonstones(3))).toEqual([71]);
    });
    it("customer with 1 year with MHPCO -> no loyalty discount -> plain sword premium 115 G", () => {
      expect(premiumsFor(1, [{ type: "sword" }])).toEqual([115]);
    });
    it("long-standing customer's second contract: 3 years, second quote, cursed sword enchantment 7 -> premium 160 G", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      expect(premiumsFor(3, [{ type: "sword" }], [cursedSword])).toEqual([95, 160]);
    });
    it("third quote in the scenario also gets the follow-up discount -> plain sword premium 100 G", () => {
      const sword = { type: "sword" };
      expect(premiumsFor(0, [sword], [sword], [sword])).toEqual([115, 100, 100]);
    });
    it("damage to a moonstone 200 G -> payout 100 G, remaining cap 400 G (components insured at 250 G)", () => {
      expect(claimResultsFor(moonstones(1), [{ itemType: "moonstone", amount: 200 }])).toEqual([
        { payout: 100, remainingCap: 400 },
      ]);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimResultsFor([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimResultsFor([dragonSword], [{ itemType: "sword", amount: 800 }])).toEqual([
        { payout: 700, remainingCap: 1300 },
      ]);
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimResultsFor([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("sword + amulet, cap 3200 G: damages 2000 G and 1500 G -> payout 3200 G (capped), remaining cap 0 G", () => {
      const damages = [
        { itemType: "sword", amount: 2000 },
        { itemType: "amulet", amount: 1500 },
      ];
      expect(claimResultsFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
        { payout: 3200, remainingCap: 0 },
      ]);
    });
    it("cursed sword cap is 2000 G (unmodified insurance value): damage 3000 G -> payout 2000 G, remaining cap 0 G", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(claimResultsFor([cursedSword], [{ itemType: "sword", amount: 3000 }])).toEqual([
        { payout: 2000, remainingCap: 0 },
      ]);
    });
    it("sword + 3 runes insurance sum 1750 G, cap 3500 G: sword damage 3000 G -> payout 2900 G, remaining cap 600 G", () => {
      expect(claimResultsFor([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 3000 }])).toEqual([
        { payout: 2900, remainingCap: 600 },
      ]);
    });
    it("two swords insured (cap 4000 G), both damaged 500 G -> payout 800 G, remaining cap 3200 G", () => {
      const swordDamage = { itemType: "sword", amount: 500 };
      expect(claimResultsFor([{ type: "sword" }, { type: "sword" }], [swordDamage, swordDamage])).toEqual([
        { payout: 800, remainingCap: 3200 },
      ]);
    });
    it("two swords insured (cap 4000 G), one sword damaged 5000 G -> payout 4000 G, remaining cap 0 G", () => {
      expect(claimResultsFor([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 5000 }])).toEqual([
        { payout: 4000, remainingCap: 0 },
      ]);
    });
    it("claim damages an item with an unknown type -> scenario is rejected with an Error", () => {
      expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(Error);
    });
    it("CLI with a claim referencing an item not in the policy -> non-zero exit code, error description on stderr", () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [quote([{ type: "sword" }]), claim(0, { itemType: "amulet", amount: 300 })],
      });
      expect(status).not.toBe(0);
      expect(stderr).toContain("amulet");
      expect(stdout).toBe("");
    });
    it("CLI with a claim damage amount -200 -> non-zero exit code, error description on stderr", () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [quote([{ type: "sword" }]), claim(0, { itemType: "sword", amount: -200 })],
      });
      expect(status).not.toBe(0);
      expect(stderr).not.toBe("");
      expect(stdout).toBe("");
    });
  });
});
