import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { basePremium, quote } from "./quote.js";
import { insuranceSum, payoutCap } from "./policy.js";
import { claim } from "./claim.js";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return failure;
  }
}

const repeat = (type: string, count: number) =>
  Array.from({ length: count }, () => ({ type }));
const runes = (count: number) => repeat("rune", count);
const moonstones = (count: number) => repeat("moonstone", count);

const payoutFor = (items: { type: string; material?: string; enchantment?: number }[], itemType: string, amount: number) =>
  claim(items, { cause: "dragon attack", damages: [{ itemType, amount }] }, payoutCap(items)).payout;

const claimOn = (items: { type: string }[], damages: { itemType: string; amount: number }[]) =>
  () => claim(items, { cause: "dragon attack", damages }, payoutCap(items));

describe("MHPCO Claim Office", () => {
  // --- Premium: simplest cases -------------------------------------------
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("prices a single plain sword at base premium 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("prices a single plain amulet at base premium 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("prices a single plain staff at base premium 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("prices a single plain potion at base premium 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("prices a single plain rune at base premium 25 G", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("prices a single plain moonstone at base premium 25 G", () => {
    expect(basePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("prices a plain sword and a plain amulet at base premium 160 G", () => {
    expect(basePremium([{ type: "sword" }, { type: "amulet" }])).toBe(160);
  });

  // --- Component building blocks -----------------------------------------
  it("prices 2 runes at base premium 50 G (no block)", () => {
    expect(basePremium(runes(2))).toBe(50);
  });
  it("prices 3 runes at base premium 60 G (block applies)", () => {
    expect(basePremium(runes(3))).toBe(60);
  });
  it("prices 4 runes at base premium 100 G (no block -- block requires exactly 3)", () => {
    expect(basePremium(runes(4))).toBe(100);
  });
  it("prices 7 runes at base premium 175 G (no block)", () => {
    expect(basePremium(runes(7))).toBe(175);
  });
  it("prices 2 runes + 1 moonstone at base premium 75 G (no block: alike means same type)", () => {
    expect(basePremium([...runes(2), { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes + 3 moonstones at base premium 120 G (two separate blocks)", () => {
    expect(basePremium([...runes(3), ...moonstones(3)])).toBe(120);
  });

  // --- Item-specific modifiers -------------------------------------------
  it("adds a 50 % curse surcharge to a cursed item -- cursed sword base premium 150 G", () => {
    expect(basePremium([{ type: "sword", cursed: true }])).toBe(150);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 -- sword base premium 130 G", () => {
    expect(basePremium([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- sword base premium 100 G", () => {
    expect(basePremium([{ type: "sword", enchantment: 4 }])).toBe(100);
  });
  it("applies both surcharges to a cursed sword with enchantment 5 -- base premium 180 G", () => {
    expect(basePremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("applies item surcharges only to the affected item -- cursed sword + plain amulet = 210 G", () => {
    expect(
      basePremium([{ type: "sword", cursed: true }, { type: "amulet" }]),
    ).toBe(210);
  });

  // --- Policy-wide modifiers ---------------------------------------------
  it("applies the 20 % loyalty discount at exactly 2 years -- sword premium 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("applies no loyalty discount at 1 year -- sword premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge -- sword premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies the 15 % follow-up discount to a second quote -- sword premium 100 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies the first-insurance surcharge again on a follow-up contract -- cursed sword ench 7, 3 years, second quote = 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });

  // --- Rounding ----------------------------------------------------------
  it("rounds a fractional premium up (MHPCO's favor) -- 117.5 G becomes 118 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }, ...runes(2)], 1),
    ).toBe(118);
  });
  it("keeps intermediate amounts fractional and rounds only the final premium -- cursed rune, 1 year, first quote = 45 G (staged rounding would give 46 G)", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "rune", cursed: true }], 0)).toBe(45);
  });

  // --- Integration examples ----------------------------------------------
  it("quotes the newcomer's cursed sword (0 years, steel, ench 3) as 165 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
      ),
    ).toBe(165);
  });
  it("quotes the long-standing customer's second contract (3 years, cursed sword ench 7) as 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });

  // --- Quote errors ------------------------------------------------------
  it("rejects an unknown item type even when three alike ones would form a block", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, repeat("broomstick", 3), 0),
    ).toThrow(/broomstick/);
  });
  it("rejects a quote containing an unknown item type -- throws an Error naming the type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(
      /broomstick/,
    );
  });

  // --- Insurance sum and cap ---------------------------------------------
  it("derives insurance sum 1600 G and cap 3200 G for a sword and an amulet", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(payoutCap(items)).toBe(3200);
  });
  it("derives insurance sum 2000 G and cap 4000 G for two swords", () => {
    expect(insuranceSum(repeat("sword", 2))).toBe(2000);
    expect(payoutCap(repeat("sword", 2))).toBe(4000);
  });
  it("derives insurance sum 1750 G for a sword + 3 runes (block affects premium only)", () => {
    const items = [{ type: "sword" }, ...runes(3)];
    expect(insuranceSum(items)).toBe(1750);
    expect(payoutCap(items)).toBe(3500);
  });
  it("bases the cap on the unmodified insurance value -- cursed sword has cap 2000 G", () => {
    expect(payoutCap([{ type: "sword", cursed: true }])).toBe(2000);
  });

  // --- Claim: standard reimbursement -------------------------------------
  it("pays 400 G for a steel sword (ench 3) with 500 G damage -- minus 100 G deductible", () => {
    expect(
      payoutFor([{ type: "sword", material: "steel", enchantment: 3 }], "sword", 500),
    ).toBe(400);
  });
  it("pays 100 G for a damaged rune (200 G damage) -- no enchantment or material", () => {
    expect(payoutFor([{ type: "rune" }], "rune", 200)).toBe(100);
  });
  it("reports the remaining cap -- sword policy cap 2000 G, payout 400 G, remainingCap 1600 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const result = claim(
      items,
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      payoutCap(items),
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: special clauses --------------------------------------------
  it("reimburses 50 % at enchantment exactly 8 -- dragon sword, 1000 G damage, payout 400 G", () => {
    expect(
      payoutFor([{ type: "sword", material: "dragon", enchantment: 8 }], "sword", 1000),
    ).toBe(400);
  });
  it("fully reimburses a dragon-material item -- dragon sword ench 5, 800 G damage, payout 700 G", () => {
    expect(
      payoutFor([{ type: "sword", material: "dragon", enchantment: 5 }], "sword", 800),
    ).toBe(700);
  });
  it("applies the 50 % rule when both clauses apply -- dragon sword ench 9, 1000 G damage, payout 400 G", () => {
    expect(
      payoutFor([{ type: "sword", material: "dragon", enchantment: 9 }], "sword", 1000),
    ).toBe(400);
  });
  it("applies only the high-enchantment clause to a steel sword ench 9 -- 1000 G damage, payout 400 G", () => {
    expect(
      payoutFor([{ type: "sword", material: "steel", enchantment: 9 }], "sword", 1000),
    ).toBe(400);
  });

  // --- Claim: deductible per damage event --------------------------------
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G, payout 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const result = claim(
      items,
      {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
      payoutCap(items),
    );
    expect(result.payout).toBe(600);
  });
  it("treats two damage entries of the same type as separate damages -- two swords, 500 G each, payout 800 G", () => {
    const items = repeat("sword", 2);
    const result = claim(
      items,
      {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      },
      payoutCap(items),
    );
    expect(result.payout).toBe(800);
  });
  it("floors a per-damage reimbursement at 0 G -- sword 500 G + amulet 50 G damage, payout 400 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const result = claim(
      items,
      {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 50 },
        ],
      },
      payoutCap(items),
    );
    expect(result.payout).toBe(400);
  });

  // --- Claim: cap exhaustion ---------------------------------------------
  it("pays 1400 G and leaves 600 G cap for a first 1500 G claim (cap 2000 G)", () => {
    const items = [{ type: "sword" }];
    expect(
      claim(items, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }, payoutCap(items)),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap -- payout 600 G, remainingCap 0 G", () => {
    const items = [{ type: "sword" }];
    expect(
      claim(items, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }, 600),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding ---------------------------------------------------
  it("rounds a fractional payout down (MHPCO's favor) -- 300.5 G becomes 300 G", () => {
    expect(
      payoutFor([{ type: "sword", material: "steel", enchantment: 9 }], "sword", 801),
    ).toBe(300);
  });

  // --- Claim errors ------------------------------------------------------
  it("rejects a claim whose damaged item is not insured -- amulet damaged, only sword insured", () => {
    expect(claimOn([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(
      /amulet/,
    );
  });
  it("rejects a claim referencing an unknown item type", () => {
    expect(
      claimOn([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
    ).toThrow(/broomstick/);
  });
  it("rejects more damage entries of a type than the policy covers -- two sword damages, one sword insured", () => {
    expect(
      claimOn(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ],
      ),
    ).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount (-200)", () => {
    expect(claimOn([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(
      /-200|negative/,
    );
  });

  // --- CLI ---------------------------------------------------------------
  it("CLI reads a scenario from stdin and writes results in step order", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }],
    });
  });
  it("CLI processes the schema example -- amulet quote then 200 G amulet claim", () => {
    const result = runCli({
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI resolves a claim's policy field to the zero-based index of its quote step", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).results[2]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("CLI exits non-zero with a stderr message and no stdout results on an invalid scenario", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
});
