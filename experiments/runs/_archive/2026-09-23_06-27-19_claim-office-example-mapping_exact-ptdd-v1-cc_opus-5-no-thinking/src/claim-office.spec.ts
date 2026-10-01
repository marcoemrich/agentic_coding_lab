import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, openPolicy, quote } from "./claim-office.js";

function runCli(scenario: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // --- Quote: base premiums per main item type (price list catalogue) ---
  it("quotes a single plain sword (base 100 G) for a 0-year customer as premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet (base 60 G) for a 0-year customer as premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff (base 80 G) for a 0-year customer as premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion (base 40 G) for a 0-year customer as premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });

  // --- Quote: component base premiums and the building block of 3 alike ---
  it("quotes 1 rune (component base 25 G) for a 0-year customer as premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up from 32.5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes 1 moonstone (component base 25 G) for a 0-year customer as premium 33 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("quotes 2 runes as base premium 50 G -> premium 60 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes as base premium 60 G -> premium 71 G (block applies)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(71);
  });
  it("quotes 4 runes as base premium 100 G -> premium 115 G (no block -- block requires exactly 3)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(4).fill({ type: "rune" }))).toBe(115);
  });
  it("quotes 7 runes as base premium 175 G -> premium 198 G (no block -- block requires exactly 3)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G -> premium 88 G (no block: alike means same type)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G -> premium 137 G (two separate blocks, one per type)", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });
  it("quotes 3 moonstones as base premium 60 G -> premium 71 G (block applies to moonstones too)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(3).fill({ type: "moonstone" }))).toBe(71);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium: cursed sword -> premium 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge for enchantment exactly 5: sword -> premium 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge for enchantment 4: sword -> premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment exactly 5 -> premium 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(
      195,
    );
  });
  it("applies the curse surcharge only to the cursed item, not the policy total: cursed sword + plain amulet -> base 160 G, curse adds 50 G, first insurance 16 G, fee 5 G -> premium 231 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }]),
    ).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO: plain sword -> premium 95 G (100 + 10 first insurance - 20 loyalty + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO: plain sword -> premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge on the policy base premium of every quote: plain staff for a 0-year customer -> premium 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("applies a 15 % follow-up-contract discount to the customer's second quote in the scenario: plain sword -> premium 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies no follow-up-contract discount to the customer's first quote: plain sword -> premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("adds the 5 G processing fee at the very end of the premium calculation: empty policy -> 5 G, plain potion -> 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });

  // --- Quote: rounding in MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (rounding in the MHPCO's favour): 7 runes for a 0-year customer", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium: 1 rune for a 2-year customer -> 22.5 + 5 = 27.5 -> premium 28 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }])).toBe(28);
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as premium 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]),
    ).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) as premium 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an item of unknown type (broomstick) by throwing an Error naming the unknown type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrowError(
      /broomstick/,
    );
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword (enchantment 3) with 500 G damage (full reimbursement minus 100 G deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] })).toEqual(
      { payout: 400, remainingCap: 1600 },
    );
  });
  it("pays out 100 G for a damaged rune (insurance value 250 G) with 200 G damage (no enchantment or material, so no special clause)", () => {
    const policy = openPolicy([{ type: "rune" }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] })).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G in one incident -> payout 600 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment >= 8 at 50 %: steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses damage to a dragon-material item: dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] })).toEqual(
      { payout: 700, remainingCap: 1300 },
    );
  });
  it("lets the 50 % rule win when both clauses apply: dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the high-enchantment clause at exactly enchantment 8: dragon sword, damage 1000 G -> payout 400 G", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: cap ---
  it("caps the payout at twice the insurance sum: sword (sum 1000 G, cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later claim to the remaining cap: second claim of 1500 G on the same sword policy -> payout 600 G, remainingCap 0 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(
      claim(policy, { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] }),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("derives the insurance sum from all covered items: sword + amulet -> sum 1600 G, cap 3200 G", () => {
    expect(openPolicy([{ type: "sword" }, { type: "amulet" }]).remainingCap).toBe(3200);
  });
  it("bases the cap on unmodified insurance values: cursed sword (premium 165 G with modifiers) -> cap 2000 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
    expect(openPolicy([cursedSword]).remainingCap).toBe(2000);
  });
  it("excludes the block discount from the insurance sum: sword + 3 runes -> sum 1750 G, cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
    expect(openPolicy(items).remainingCap).toBe(3500);
  });

  // --- Claim: multiple items of the same type ---
  it("insures two swords as insurance sum 2000 G with cap 4000 G", () => {
    expect(openPolicy([{ type: "sword" }, { type: "sword" }]).remainingCap).toBe(4000);
  });
  it("treats each of two sword damage entries as a separate damage with its own deductible when two swords are insured: 500 G + 300 G -> payout 600 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toThrowError(/sword/);
  });

  // --- Claim: rounding and rejection ---
  it("rounds a payout of 350.5 G down to 350 G (rounding in the MHPCO's favour): sword enchantment 9, damage 901 G -> 450.5 - 100 = 350.5 -> payout 350 G", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] })).toEqual(
      { payout: 350, remainingCap: 1650 },
    );
  });
  it("rejects a claim referencing an item not part of the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrowError(/amulet/);
  });
  it("rejects a claim referencing a damaged item of unknown type by throwing an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrowError(/broomstick/);
  });
  it("rejects a claim containing a damage entry with amount -200 by throwing an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrowError(/-200|negative/);
  });

  // --- CLI end-to-end ---
  it("reads a scenario from stdin and writes a results array of the same length and order to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).results).toHaveLength(2);
  });
  it("returns premium for quote results and payout plus remainingCap for claim results, as integers", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("resolves a claim's zero-based policy step index to the policy created by that earlier quote step", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("exits non-zero and writes an error description to stderr when a quote item has an unknown type", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toMatch(/results/);
  });
});
