import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

// Premiums are observed as final quote results. Unless stated otherwise the
// customer has 0 years with MHPCO and the quote is the scenario's first, so
// the 10 % first-insurance surcharge and the 5 G fee apply.
// Rejections are observed at the CLI: non-zero exit status, an error
// description on stderr and no results on stdout.
type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const premiumsFor = (yearsWithMHPCO: number, ...quotes: Item[][]) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: quotes.map((items) => ({ op: "quote" as const, items })),
  }).results;

const newcomerPremium = (items: Item[]) => premiumsFor(0, items)[0];

type Damage = { itemType: string; amount: number };

const claimResultsFor = (items: Item[], ...claims: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

const runCli = (scenario: unknown) => {
  const { status, stdout, stderr } = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status, stdout, stderr };
};

// An error description on stderr names the offending input.
const expectRejection = (scenario: unknown, offendingInput: string) => {
  const { status, stdout, stderr } = runCli(scenario);
  expect(status).not.toBe(0);
  expect(stdout).toBe("");
  expect(stderr).toContain(offendingInput);
};

const claimScenario = (items: Item[], damages: Damage[]) => ({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
  ],
});

const many = (count: number, type: string): Item[] => Array.from({ length: count }, () => ({ type }));

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(newcomerPremium([])).toEqual({ premium: 5 });
  });
  it("quotes a plain sword at 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(newcomerPremium([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes a plain amulet at 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(newcomerPremium([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes a plain staff at 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(newcomerPremium([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes a plain potion at 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(newcomerPremium([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes 2 runes at 60 G (50 base, no block)", () => {
    expect(newcomerPremium([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes 3 runes at 71 G (block base premium 60)", () => {
    expect(newcomerPremium(many(3, "rune"))).toEqual({ premium: 71 });
  });
  it("rounds a premium of 197.5 G up to 198 G (7 runes, base 175, no block)", () => {
    expect(newcomerPremium(many(7, "rune"))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes + 1 moonstone at 88 G (base 75: different types form no block; 87.5 rounded up)", () => {
    expect(newcomerPremium([...many(2, "rune"), { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("quotes a newcomer's cursed steel sword (enchantment 3) at 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(
      newcomerPremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    ).toEqual({ premium: 165 });
  });
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet at 231 G (160 base + 50 curse + 16 first + 5 fee)", () => {
    expect(newcomerPremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("adds the high-enchantment surcharge at exactly enchantment 5: sword at 145 G (100 + 30 + 10 + 5 fee)", () => {
    expect(newcomerPremium([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("grants the loyalty discount at exactly 2 years: plain sword at 95 G (100 − 20 + 10 + 5 fee)", () => {
    expect(premiumsFor(2, [{ type: "sword" }])).toEqual([{ premium: 95 }]);
  });
  it("grants the 15 % follow-up discount on the customer's second quote: plain sword at 100 G (100 + 10 − 15 + 5 fee)", () => {
    expect(premiumsFor(0, [{ type: "sword" }], [{ type: "sword" }])).toEqual([
      { premium: 115 },
      { premium: 100 },
    ]);
  });
  it("pays 400 G for 500 G damage to a regular steel sword (enchantment 3), remaining cap 1600 G", () => {
    expect(
      claimResultsFor([{ type: "sword", material: "steel", enchantment: 3 }], [
        { itemType: "sword", amount: 500 },
      ]),
    ).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("uses the amulet's 600 G insurance value: 200 G amulet damage pays 100 G, remaining cap 1100 G", () => {
    expect(claimResultsFor([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("uses the staff's 800 G insurance value: 300 G staff damage pays 200 G, remaining cap 1400 G", () => {
    expect(claimResultsFor([{ type: "staff" }], [{ itemType: "staff", amount: 300 }])).toEqual([
      { payout: 200, remainingCap: 1400 },
    ]);
  });
  it("uses the potion's 400 G insurance value: 300 G potion damage pays 200 G, remaining cap 600 G", () => {
    expect(claimResultsFor([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual([
      { payout: 200, remainingCap: 600 },
    ]);
  });
  it("uses a rune's 250 G insurance value: 200 G rune damage pays 100 G, remaining cap 400 G", () => {
    expect(claimResultsFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("reimburses 50 % for enchantment ≥ 8: steel sword enchantment 9, damage 1000 G pays 400 G", () => {
    expect(
      claimResultsFor([{ type: "sword", material: "steel", enchantment: 9 }], [
        { itemType: "sword", amount: 1000 },
      ]),
    ).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("rounds a payout of 350.5 G down to 350 G (steel sword enchantment 9, damage 901 G)", () => {
    expect(
      claimResultsFor([{ type: "sword", material: "steel", enchantment: 9 }], [
        { itemType: "sword", amount: 901 },
      ]),
    ).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it("applies the deductible per damaged item: sword 500 G + amulet 300 G pays 600 G, remaining cap 2600 G", () => {
    expect(
      claimResultsFor([{ type: "sword" }, { type: "amulet" }], [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]),
    ).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it("limits successive claims to the remaining cap: two 1500 G sword claims pay 1400 G (cap left 600 G) then 600 G (cap left 0 G)", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimResultsFor([{ type: "sword" }], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("CLI writes the schema example results to stdout: premium 59 G, payout 100 G, remaining cap 1100 G", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect({ status, results: JSON.parse(stdout || "{}").results }).toEqual({
      status: 0,
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI rejects a quote with unknown item type 'broomstick': non-zero exit, stderr message, empty stdout", () => {
    expectRejection(
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] },
      "broomstick",
    );
  });
  it("CLI rejects a claim damaging an amulet when only a sword is insured: non-zero exit, stderr message, empty stdout", () => {
    expectRejection(claimScenario([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]), "amulet");
  });
  it("CLI rejects a claim with two sword damages when only one sword is insured: non-zero exit, stderr message, empty stdout", () => {
    expectRejection(
      claimScenario([{ type: "sword" }], [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
      "sword",
    );
  });
  it("CLI rejects a claim with a damage amount of -200: non-zero exit, stderr message, empty stdout", () => {
    expectRejection(claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]), "-200");
  });

  describe("verification", () => {
    it("quotes 4 runes at 115 G (base 100: block requires exactly 3)", () => {
      expect(newcomerPremium(many(4, "rune"))).toEqual({ premium: 115 });
    });
    it("quotes 3 runes + 3 moonstones at 137 G (base 120: two separate blocks)", () => {
      expect(newcomerPremium([...many(3, "rune"), ...many(3, "moonstone")])).toEqual({ premium: 137 });
    });
    it("quotes a single moonstone at 33 G (base 25, 32.5 rounded up)", () => {
      expect(newcomerPremium([{ type: "moonstone" }])).toEqual({ premium: 33 });
    });
    it("adds no high-enchantment surcharge at enchantment 4: sword at 115 G", () => {
      expect(newcomerPremium([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
    });
    it("adds both surcharges for a cursed sword at enchantment 5: 195 G", () => {
      expect(newcomerPremium([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    });
    it("adds only the curse surcharge for a cursed sword at enchantment 4: 165 G", () => {
      expect(newcomerPremium([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
    });
    it("grants no loyalty discount below 2 years (1 year): plain sword at 115 G", () => {
      expect(premiumsFor(1, [{ type: "sword" }])).toEqual([{ premium: 115 }]);
    });
    it("quotes a long-standing customer's second contract, cursed sword enchantment 7, at 160 G", () => {
      expect(
        premiumsFor(3, [{ type: "amulet" }], [{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ).toEqual([{ premium: 59 }, { premium: 160 }]);
    });
    it("grants the follow-up discount on every later contract: third quote plain sword at 100 G", () => {
      expect(premiumsFor(0, [{ type: "sword" }], [{ type: "sword" }], [{ type: "sword" }])).toEqual([
        { premium: 115 },
        { premium: 100 },
        { premium: 100 },
      ]);
    });
    it("uses a moonstone's 250 G insurance value: 200 G moonstone damage pays 100 G, remaining cap 400 G", () => {
      expect(claimResultsFor([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual([
        { payout: 100, remainingCap: 400 },
      ]);
    });
    it("pays 400 G for a dragon-material sword at exactly enchantment 8 with damage 1000 G", () => {
      expect(
        claimResultsFor([{ type: "sword", material: "dragon", enchantment: 8 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("lets the 50 % rule win over dragon material: dragon sword enchantment 9, damage 1000 G pays 400 G", () => {
      expect(
        claimResultsFor([{ type: "sword", material: "dragon", enchantment: 9 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("fully reimburses dragon material below enchantment 8: dragon sword enchantment 5, damage 800 G pays 700 G", () => {
      expect(
        claimResultsFor([{ type: "sword", material: "dragon", enchantment: 5 }], [
          { itemType: "sword", amount: 800 },
        ]),
      ).toEqual([{ payout: 700, remainingCap: 1300 }]);
    });
    it("treats two sword damages on a two-sword policy separately: 500 G + 500 G pays 800 G, remaining cap 3200 G (cap 4000)", () => {
      const damage = { itemType: "sword", amount: 500 };
      expect(claimResultsFor(many(2, "sword"), [damage, damage])).toEqual([
        { payout: 800, remainingCap: 3200 },
      ]);
    });
    it("bases the cap on unmodified insurance value: cursed sword, 500 G damage pays 400 G, remaining cap 1600 G (cap 2000)", () => {
      expect(claimResultsFor([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("keeps the block out of the insurance sum: sword + 3 runes, 200 G rune damage pays 100 G, remaining cap 3400 G (cap 3500)", () => {
      expect(
        claimResultsFor([{ type: "sword" }, ...many(3, "rune")], [{ itemType: "rune", amount: 200 }]),
      ).toEqual([{ payout: 100, remainingCap: 3400 }]);
    });
    it("keeps separate caps per policy: a claim on step 1's policy leaves step 0's policy untouched", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 1, incident },
          { op: "claim", policy: 0, incident },
        ],
      });
      expect(results.slice(2)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 1400, remainingCap: 600 },
      ]);
    });
    it("CLI rejects a claim damaging an unknown item type: non-zero exit, stderr message, empty stdout", () => {
      expectRejection(claimScenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]), "broomstick");
    });
  });
});
