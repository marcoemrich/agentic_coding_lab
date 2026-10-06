import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { ClaimOffice } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliOutcome {
  try {
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return {
      status: failure.status,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and simplest case ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([])).toBe(5);
  });

  // --- Quote: price list base premiums (each entry is independent data) ---
  it("quotes a sword (base 100 G) for a newcomer as premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes an amulet (base 60 G) for a newcomer as premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a staff (base 80 G) for a newcomer as premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a potion (base 40 G) for a newcomer as premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes a rune component (base 25 G) for a newcomer as premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "rune" }])).toBe(33);
  });
  it("quotes a moonstone component (base 25 G) for a newcomer as premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "moonstone" }])).toBe(33);
  });
  it("rejects a quote item with an unknown type (e.g. broomstick) by throwing an Error -- chosen contract: thrown Error, surfaced by the CLI as non-zero exit plus stderr", () => {
    expect(() => new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "broomstick" }])).toThrow(/broomstick/);
  });

  // --- Quote: component building block of 3 alike ---
  it("prices 3 runes as base premium 60 G (block applies) -- newcomer premium 71 G", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote(threeRunes)).toBe(71);
  });
  it("prices 3 swords without a block discount -- the block applies to components only (base 300 G, newcomer premium 335 G)", () => {
    const threeSwords = [{ type: "sword" }, { type: "sword" }, { type: "sword" }];
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote(threeSwords)).toBe(335);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium (cursed sword, newcomer -> 165 G)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge for enchantment exactly 5 (sword e5, newcomer -> 145 G)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 0 }).quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO (sword, 2 years -> 95 G)", () => {
    expect(new ClaimOffice({ yearsWithMHPCO: 2 }).quote([{ type: "sword" }])).toBe(95);
  });
  it("applies a 15 % follow-up discount to each contract after the customer's first (second quote of a sword -> 100 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });

  // --- Quote: rounding in MHPCO's favour ---

  // --- Claim: payout basics ---
  it("pays a standard claim in full minus a 100 G deductible (steel sword e3, damage 500 G -> payout 400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = office.claim(0, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("reports the remaining cap after a claim (sword, cap 2000 G, damage 500 G -> remainingCap 1600 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.remainingCap).toBe(1600);
  });
  it("reimburses damage to an item with enchantment exactly 8 at 50 % before the deductible (steel sword e8, damage 1000 G -> payout 400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 8 }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("rounds a payout of 350.5 G down to 350 G (sword e8, damage 901 G: 450.5 - 100)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", enchantment: 8 }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });

  // --- Claim: cap ---
  it("caps the payout at twice the insurance sum across successive claims (sword, cap 2000 G; 1500 G -> 1400 G then 1500 G -> 600 G, remainingCap 0)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const first = office.claim(0, incident);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    expect(office.claim(0, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("insures a staff at 800 G -- cap 1600 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "staff" }]);
    expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(1600);
  });
  it("insures a potion at 400 G -- cap 800 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "potion" }]);
    expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(800);
  });
  it("insures a rune at 250 G -- cap 500 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "rune" }]);
    expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(500);
  });
  it("insures a moonstone at 250 G -- cap 500 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "moonstone" }]);
    expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(500);
  });
  it("sums insurance values across items for the cap (sword + amulet -> insurance sum 1600 G, cap 3200 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const result = office.claim(0, { cause: "flood", damages: [] });
    expect(result.remainingCap).toBe(3200);
  });
  it("rejects a claim with more damage entries of a type than the policy covers by throwing an Error (two sword damages, one sword insured)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount by throwing an Error (amount -200)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, {
        cause: "mischief",
        damages: [{ itemType: "sword", amount: -200 }],
      }),
    ).toThrow(/-200|negative/);
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes {results:[{premium}]} to stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("CLI writes a claim result as {payout, remainingCap}", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("CLI exits non-zero with an error description on stderr and no results on stdout for an unknown item type", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stdout).toBe("");
    expect(outcome.stderr).toMatch(/broomstick/);
  });

  describe("verification", () => {
    it("rejects a claim whose damage item is not part of the policy by throwing an Error (amulet damaged, only a sword insured)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword" }]);
      expect(() =>
        office.claim(0, {
          cause: "fire",
          damages: [{ itemType: "amulet", amount: 300 }],
        }),
      ).toThrow(/amulet/);
    });
    it("rejects a claim with an unknown damage item type by throwing an Error", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword" }]);
      expect(() =>
        office.claim(0, {
          cause: "fire",
          damages: [{ itemType: "broomstick", amount: 300 }],
        }),
      ).toThrow(/broomstick/);
    });
    it("treats two damage entries of the same item type as separate damages with their own deductible (two swords insured, two 500 G sword damages -> payout 800 G, cap 4000 -> 3200)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword" }, { type: "sword" }]);
      const result = office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      });
      expect(result).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("excludes the block discount from the insurance sum (sword + 3 runes -> insurance sum 1750 G, cap 3500 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([
        { type: "sword" },
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ]);
      expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(3500);
    });
    it("bases the cap on the unmodified insurance sum, not the modified premium (cursed sword -> cap 2000 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote([{ type: "sword", cursed: true }])).toBe(165);
      expect(office.claim(0, { cause: "flood", damages: [] }).remainingCap).toBe(2000);
    });
    it("pays a claim on a component with no enchantment or material (rune, damage 200 G -> payout 100 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "rune" }]);
      const result = office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      });
      expect(result.payout).toBe(100);
    });
    it("reimburses damage to an item with enchantment 9 at 50 % before the deductible (steel sword e9, damage 1000 G -> payout 400 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
      const result = office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("fully reimburses dragon-material damage, then the deductible (dragon sword e5, damage 800 G -> payout 700 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword", material: "dragon", enchantment: 5 }]);
      const result = office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 800 }],
      });
      expect(result.payout).toBe(700);
    });
    it("lets the 50 % enchantment rule win over dragon material (dragon sword e9, damage 1000 G -> payout 400 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword", material: "dragon", enchantment: 9 }]);
      const result = office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("applies the 100 G deductible once per damaged item (sword 500 G + amulet 300 G -> payout 600 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword" }, { type: "amulet" }]);
      const result = office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      });
      expect(result.payout).toBe(600);
    });
    it("rounds a premium of 197.5 G up to 198 G (7 runes, newcomer: 175 + 17.5 + 5)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    });
    it("applies no loyalty discount below 2 years with MHPCO (sword, 1 year -> 115 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 1 });
      expect(office.quote([{ type: "sword" }])).toBe(115);
    });
    it("applies item modifiers only to the affected item on a multi-item policy (cursed sword + plain amulet, newcomer -> policy base 160 G, curse adds 50 G -> 231 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
      expect(office.quote(items)).toBe(231);
    });
    it("adds no high-enchantment surcharge for enchantment 4 (sword e4, newcomer -> 115 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("prices 2 runes + 1 moonstone as base premium 75 G (no block: different types are not alike), newcomer premium 88 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
      expect(office.quote(items)).toBe(88);
    });
    it("prices 3 runes + 3 moonstones as base premium 120 G (two separate blocks, one per type), newcomer premium 137 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];
      expect(office.quote(items)).toBe(137);
    });
    it("prices 4 runes as base premium 100 G (no block -- block requires exactly 3), newcomer premium 115 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
    });
    it("prices 7 runes as base premium 175 G (no block at 7), newcomer premium 198 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    });
    it("prices 2 runes as base premium 50 G (no block) -- observed as a newcomer premium of 60 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("quote of a cursed staff applies the curse surcharge to the staff base premium (80 G base + 40 G curse, newcomer -> 133 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote([{ type: "staff", cursed: true }])).toBe(133);
    });
    it("cursed sword with enchantment exactly 5 gets both surcharges (newcomer -> 195 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      expect(office.quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
    });
    it("integration: newcomer with a cursed sword (steel, e3) -> premium 165 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(office.quote([sword])).toBe(165);
    });
    it("integration: long-standing customer's second contract, cursed sword (steel, e7) -> premium 160 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 3 });
      office.quote([{ type: "amulet" }]);
      const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      expect(office.quote([sword])).toBe(160);
    });
    it("dragon-material sword with enchantment exactly 8, damage 1000 G -> payout 400 G", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      office.quote([{ type: "sword", material: "dragon", enchantment: 8 }]);
      const result = office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("block pricing combined with a main item (sword + 3 runes, newcomer -> premium 181 G)", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 0 });
      const items = [
        { type: "sword" },
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ];
      expect(office.quote(items)).toBe(181);
    });
    it("multi-step scenario: quote then claim against that policy via its step index", () => {
      const office = new ClaimOffice({ yearsWithMHPCO: 5 });
      expect(office.quote([{ type: "amulet", material: "silver", enchantment: 2 }])).toBe(59);
      expect(office.claim(0, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      })).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("CLI processes a scenario of several steps in order, returning results of the same length and order", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(outcome.status).toBe(0);
      expect(JSON.parse(outcome.stdout)).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
          { premium: 80 },
        ],
      });
    });
  });
});
