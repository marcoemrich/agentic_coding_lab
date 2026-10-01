import { describe, expect, it } from "vitest";
import { quote } from "./quote.js";
import { capOf, insuranceSumOf } from "./policy.js";
import { claim } from "./claim.js";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): string {
  return execFileSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

function runCliExpectingRefusal(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  return spawnSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // --- Quote: base premiums per main item type ---
  it("quotes a single sword as 100 G base premium (+10 G first insurance, +5 G fee = 115 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes a single amulet as 60 G base premium (+6 G first insurance, +5 G fee = 71 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("quotes a single staff as 80 G base premium (+8 G first insurance, +5 G fee = 93 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("quotes a single potion as 40 G base premium (+4 G first insurance, +5 G fee = 49 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });
  it("quotes a single rune as 25 G base premium (+2.5 G first insurance, +5 G fee = 33 G after rounding up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes a single moonstone as 25 G base premium (+2.5 G first insurance, +5 G fee = 33 G after rounding up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });

  // --- Quote: component building block of 3 alike components ---
  it("quotes 2 runes as 50 G base premium (no block)", () => {
    // 50 G base + 5 G first insurance + 5 G fee = 60 G
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0),
    ).toBe(60);
  });
  it("quotes 3 runes as 60 G base premium (block applies)", () => {
    // 60 G base + 6 G first insurance + 5 G fee = 71 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        0,
      ),
    ).toBe(71);
  });
  it("quotes 4 runes as 100 G base premium (no block -- block requires exactly 3)", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(115);
  });
  it("quotes 7 runes as 175 G base premium (no block -- 7 is not a multiple forming exactly 3)", () => {
    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G -> 198 G
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone as 75 G base premium (no block: alike means same type)", () => {
    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G -> 88 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        0,
      ),
    ).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as 120 G base premium (two separate blocks)", () => {
    // 120 G base + 12 G first insurance + 5 G fee = 137 G
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50% curse surcharge to the cursed item's base premium (cursed sword: 100 G base + 50 G curse)", () => {
    // 100 G base + 50 G curse + 10 G first insurance (10% of the policy
    // base premium, per the spec's integration example) + 5 G fee = 165 G
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0),
    ).toBe(165);
  });
  it("adds a 30% high-enchantment surcharge at enchantment exactly 5 (sword: 100 G base + 30 G)", () => {
    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0),
    ).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (sword: 100 G base only)", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0),
    ).toBe(115);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment exactly 5 (100 G + 50 G + 30 G)", () => {
    // 180 G base+surcharges + 10 G first insurance + 5 G fee = 195 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", enchantment: 5, cursed: true }],
        0,
      ),
    ).toBe(195);
  });
  it("applies item-specific curse surcharge only to the cursed item, not the policy total: cursed sword + plain amulet -> 160 G base + 50 G curse = 210 G before further modifiers and fee", () => {
    // 210 G + 16 G first insurance (10% of the 160 G policy base) + 5 G fee = 231 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
        0,
      ),
    ).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20% loyalty discount at exactly 2 years with MHPCO", () => {
    // 100 G base + 10 G first insurance - 20 G loyalty + 5 G fee = 95 G
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies a 10% first-insurance surcharge on the policy base premium", () => {
    // sword + amulet: 160 G base + 16 G first insurance + 5 G fee = 181 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "amulet" }],
        0,
      ),
    ).toBe(181);
  });
  it("applies a 15% follow-up discount on every contract after the customer's first quote in the scenario", () => {
    // second quote: 100 G base + 10 G first insurance - 15 G follow-up + 5 G fee = 100 G
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies the first-insurance surcharge on a follow-up contract too (each quoted item is a first insurance)", () => {
    // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    // + 10 G first insurance - 15 G follow-up = 155 G + 5 G fee = 160 G
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });
  it("adds the 5 G processing fee at the very end of every quote", () => {
    // a long-standing customer's loyalty discount must not reduce the fee:
    // empty policy still costs exactly the 5 G fee
    expect(quote({ yearsWithMHPCO: 2 }, [], 0)).toBe(5);
  });

  // --- Quote: rounding in MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G", () => {
    // 7 runes: 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("keeps intermediate amounts fractional and rounds only the final premium", () => {
    // 1 rune on a follow-up contract: 25 G base + 2.5 G first insurance
    // - 3.75 G follow-up + 5 G fee = 28.75 G -> 29 G
    // (rounding each intermediate amount up instead would yield 30 G)
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 1)).toBe(29);
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, no previous contract) as 165 G", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
      ),
    ).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) as 160 G", () => {
    // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    // + 10 G first insurance - 15 G follow-up = 155 G + 5 G fee = 160 G
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });

  // --- Quote: errors ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick) by throwing an Error", () => {
    // The spec fixes the observable contract at the CLI (non-zero exit plus a
    // stderr description) without naming a type or message for the domain
    // layer; the adopted reading is that the domain throws an Error.
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0),
    ).toThrow();
  });

  // --- Insurance sum and cap ---
  it("computes insurance sum 1600 G and cap 3200 G for a policy covering a sword and an amulet", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSumOf(items)).toBe(1600);
    expect(capOf(items)).toBe(3200);
  });
  it("computes insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSumOf(items)).toBe(2000);
    expect(capOf(items)).toBe(4000);
  });
  it("computes insurance sum 1750 G and cap 3500 G for a sword and 3 runes (block affects premium only)", () => {
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(insuranceSumOf(items)).toBe(1750);
    expect(capOf(items)).toBe(3500);
  });
  it("bases the cap on the unmodified insurance value: a cursed sword has cap 2000 G even though its premium is 165 G", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(165);
    expect(insuranceSumOf(items)).toBe(1000);
    expect(capOf(items)).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays 400 G for 500 G damage to a regular steel sword with enchantment 3 (full reimbursement minus 100 G deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    expect(
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune (no enchantment level or material, so no special clause)", () => {
    const items = [{ type: "rune" }];
    // insurance sum 250 G -> cap 500 G
    expect(
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      }),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G damage -> payout 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    // insurance sum 1600 G -> cap 3200 G
    expect(
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment exactly 8 at 50%: dragon sword, damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    // 50% of 1000 G = 500 G, minus the 100 G deductible = 400 G
    expect(
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses dragon-material damage fully: dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    // full reimbursement, then the 100 G deductible: 800 - 100 = 700 G
    expect(
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 800 }],
      }),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50% high-enchantment rule win over full dragon reimbursement: dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    // both clauses apply; the 50% rule wins, then the deductible: 500 - 100
    expect(
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 50% high-enchantment rule to a steel sword with enchantment 9: damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    // only the high-enchantment clause applies: 50% first, then deductible
    expect(
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: multiple items of the same type ---
  it("treats each damage entry of the same item type as a separate damage with its own deductible (two swords damaged)", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    // insurance sum 2000 G -> cap 4000 G; each 500 G damage pays 400 G
    expect(
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers by throwing an Error", () => {
    const items = [{ type: "sword" }];
    expect(() =>
      claim(items, capOf(items), {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow();
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays 1400 G and leaves 600 G remaining cap for a 1500 G claim on a sword policy (cap 2000 G)", () => {
    const items = [{ type: "sword" }];
    expect(
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      }),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remaining cap 0 G", () => {
    const items = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const firstClaim = claim(items, capOf(items), incident);
    expect(claim(items, firstClaim.remainingCap, incident)).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- Claim: rounding in MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G", () => {
    const items = [{ type: "sword", enchantment: 8 }];
    // 50% of 901 G = 450.5 G, minus the 100 G deductible = 350.5 G -> 350 G
    expect(
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 901 }],
      }),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: errors ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
    const items = [{ type: "sword" }];
    expect(() =>
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      }),
    ).toThrow();
  });
  it("rejects a claim whose damaged item has an unknown type by throwing an Error", () => {
    const items = [{ type: "sword" }];
    expect(() =>
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "broomstick", amount: 200 }],
      }),
    ).toThrow();
  });
  it("rejects a claim containing a damage entry with a negative amount (-200) by throwing an Error", () => {
    const items = [{ type: "sword" }];
    expect(() =>
      claim(items, capOf(items), {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      }),
    ).toThrow();
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout for the schema example", () => {
    const stdout = runCli({
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    // amulet: 60 G base + 6 G first insurance - 12 G loyalty + 5 G fee = 59 G
    // claim: 200 G - 100 G deductible = 100 G; cap 1200 G -> 1100 G remaining
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI resolves a claim's policy field as the zero-based index of the earlier quote step", () => {
    const stdout = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // the claim settles against the sword policy of step 0 (cap 2000 G),
    // not against the staff policy of step 1
    expect(JSON.parse(stdout)).toEqual({
      results: [
        { premium: 115 },
        { premium: 81 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const { status, stdout, stderr } = runCliExpectingRefusal({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("broomstick");
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for a claim against an uninsured item", () => {
    const { status, stderr } = runCliExpectingRefusal({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toContain("amulet");
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for a negative damage amount", () => {
    const { status, stdout, stderr } = runCliExpectingRefusal({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("-200");
  });
});
