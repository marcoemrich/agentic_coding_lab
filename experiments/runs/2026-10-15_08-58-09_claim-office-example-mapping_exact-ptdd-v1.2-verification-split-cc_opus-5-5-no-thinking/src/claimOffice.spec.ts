import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type QuoteItem, type Scenario } from "./claimOffice.js";

const newcomer = { yearsWithMHPCO: 0 };
const rune = { type: "rune" };
const moonstone = { type: "moonstone" };
function claimFor(items: QuoteItem[], damages: { itemType: string; amount: number }[], customer = newcomer) {
  return runScenario({
    customer,
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  })[1];
}
const schemaExample: Scenario = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};
function runCli(input: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
}
const times = (count: number, item: QuoteItem): QuoteItem[] => Array.from({ length: count }, () => item);

function quoteFor(items: QuoteItem[], customer = newcomer): number {
  const [result] = runScenario({ customer, steps: [{ op: "quote", items }] });
  return (result as { premium: number }).premium;
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list for a newcomer -- premium 5 G (fee only)", () => {
    expect(runScenario({ customer: newcomer, steps: [{ op: "quote", items: [] }] })).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword for a newcomer's first contract -- 100 + 10 first insurance + 5 fee = 115 G", () => {
    expect(quoteFor([{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet for a newcomer -- 60 + 6 + 5 = 71 G", () => {
    expect(quoteFor([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff for a newcomer -- 80 + 8 + 5 = 93 G", () => {
    expect(quoteFor([{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion for a newcomer -- 40 + 4 + 5 = 49 G", () => {
    expect(quoteFor([{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes -- base 50 G -> 55 + 5 = 60 G", () => {
    expect(quoteFor(times(2, rune))).toBe(60);
  });
  it("quotes 3 runes as a block -- base 60 G -> 66 + 5 = 71 G", () => {
    expect(quoteFor(times(3, rune))).toBe(71);
  });
  it("quotes 7 runes -- base 175 G -> 197.5 G rounded up in MHPCO's favor to 198 G", () => {
    expect(quoteFor(times(7, rune))).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone without block (different types) -- base 75 G -> 87.5 rounded up to 88 G", () => {
    expect(quoteFor([...times(2, rune), moonstone])).toBe(88);
  });
  it("quotes a cursed steel sword (enchantment 3) for a newcomer -- 100 + 50 + 10 + 5 = 165 G", () => {
    expect(quoteFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet -- 160 + 50 + 16 + 5 = 231 G", () => {
    expect(quoteFor([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("adds the high-enchantment surcharge at exactly enchantment 5 -- 100 + 30 + 10 + 5 = 145 G", () => {
    expect(quoteFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("gives the loyalty discount at exactly 2 years -- sword 100 - 20 + 10 + 5 = 95 G", () => {
    expect(quoteFor([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("gives the follow-up discount on the second quote of the scenario -- sword quotes 115 G then 100 G", () => {
    const sword = { type: "sword" };
    expect(
      runScenario({
        customer: newcomer,
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("claims standard reimbursement for a steel sword (enchantment 3), damage 500 -- payout 400 G, remainingCap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims damage 200 on an insured rune (value 250) -- payout 100 G, remainingCap 400 G", () => {
    expect(claimFor([rune], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("runs the schema example: 5-year customer amulet quote 59 G, claim 200 -- payout 100 G, remainingCap 1100 G", () => {
    expect(runScenario(schemaExample)).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("claims damage 300 on an insured staff (value 800) -- payout 200 G, remainingCap 1400 G", () => {
    expect(claimFor([{ type: "staff" }], [{ itemType: "staff", amount: 300 }])).toEqual({ payout: 200, remainingCap: 1400 });
  });
  it("claims damage 300 on an insured potion (value 400) -- payout 200 G, remainingCap 600 G", () => {
    expect(claimFor([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual({ payout: 200, remainingCap: 600 });
  });
  it("claims damage 200 on an insured moonstone (value 250) -- payout 100 G, remainingCap 400 G", () => {
    expect(claimFor([moonstone], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the deductible per damaged item: sword 500 + amulet 300 -- payout 600 G, remainingCap 2600 G", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("reimburses 50 % for enchantment >= 8: steel sword enchantment 9, damage 1000 -- payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds payouts down in MHPCO's favor: enchantment 9 sword, damage 901 -> 350.5 -- payout 350 G", () => {
    const sword = { type: "sword", enchantment: 9 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("caps payouts at twice the insurance sum: two claims of 1500 on a sword -- 1400/600 then 600/0", () => {
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const results = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects a claim with more sword damages than insured swords -- runScenario throws an Error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ];
    expect(() => claimFor([{ type: "sword" }], damages)).toThrow(Error);
  });
  it("rejects a claim with a negative damage amount (-200) -- runScenario throws an Error", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
  it("rejects a quote with an unknown item type (broomstick) -- runScenario throws an Error naming the type", () => {
    expect(() => quoteFor([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("CLI reads the schema example from stdin and writes results JSON to stdout", () => {
    const run = runCli(schemaExample);
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI exits non-zero, writes stderr and no results for an unknown quote item type", () => {
    const run = runCli({ customer: newcomer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("broomstick");
    expect(run.stdout).not.toContain("results");
  });

  describe("verification", () => {
    it("quotes 4 runes without block (block requires exactly 3) -- base 100 G -> 115 G", () => {
      expect(quoteFor(times(4, rune))).toBe(115);
    });
    it("quotes 3 runes + 3 moonstones as two separate blocks -- base 120 G -> 137 G", () => {
      expect(quoteFor([...times(3, rune), ...times(3, moonstone)])).toBe(137);
    });
    it("stacks curse and high enchantment at exactly enchantment 5 -- 100 + 50 + 30 + 10 + 5 = 195 G", () => {
      expect(quoteFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("adds no high-enchantment surcharge at enchantment 4 -- 115 G", () => {
      expect(quoteFor([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("adds only the curse surcharge to a cursed sword with enchantment 4 -- 165 G", () => {
      expect(quoteFor([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("integration: 3-year customer's second quote, cursed steel sword enchantment 7 -- 160 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
    it("dragon-material sword enchantment 5, damage 800 -- payout 700 G (full reimbursement)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimFor([sword], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword enchantment 9, damage 1000 -- payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 -- payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rejects an amulet damage when only a sword is insured -- runScenario throws an Error", () => {
      expect(() => claimFor([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
    });
    it("rejects a damage with an unknown item type -- runScenario throws an Error", () => {
      expect(() => claimFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
    });
    it("two swords: insurance sum 2000, cap 4000; damages 500 and 300 each with deductible -- payout 600, remainingCap 3400", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(claimFor(times(2, { type: "sword" }), damages)).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("sword + amulet: cap 3200; sword damage 500 -- payout 400, remainingCap 2800", () => {
      const items = [{ type: "sword" }, { type: "amulet" }];
      expect(claimFor(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword cap stays 2000 (unmodified value); damage 500 -- payout 400, remainingCap 1600", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(claimFor([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes block: insurance sum 1750, cap 3500; sword damage 500 -- payout 400, remainingCap 3100", () => {
      const items = [{ type: "sword" }, ...times(3, rune)];
      expect(claimFor(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("keeps intermediate fractions: two enchantment-9 swords, damages 901 + 901 -- payout 701, remainingCap 3299", () => {
      const damages = [
        { itemType: "sword", amount: 901 },
        { itemType: "sword", amount: 901 },
      ];
      expect(claimFor(times(2, { type: "sword", enchantment: 9 }), damages)).toEqual({ payout: 701, remainingCap: 3299 });
    });
    it("CLI exits non-zero with stderr when a damaged item is not part of the policy", () => {
      const run = runCli({
        customer: newcomer,
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain("amulet");
      expect(run.stdout).not.toContain("results");
    });
    it("CLI exits non-zero with stderr for a negative damage amount", () => {
      const run = runCli({
        customer: newcomer,
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain("-200");
      expect(run.stdout).not.toContain("results");
    });
  });
});
