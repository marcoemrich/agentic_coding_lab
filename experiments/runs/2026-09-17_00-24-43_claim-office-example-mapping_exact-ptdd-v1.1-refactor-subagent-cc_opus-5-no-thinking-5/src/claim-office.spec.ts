import { describe, expect, it } from "vitest";
import { policyBasePremium, quote } from "./quote.js";
import { claim, insuranceSum, openPolicy } from "./claim.js";
import { execFileSync } from "node:child_process";

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliRun {
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

describe("MHPCO quote -- base premiums", () => {
  it("empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("single plain sword -- base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("single plain amulet -- base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single plain staff -- base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single plain potion -- base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });
  it("single rune -- base 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("single moonstone -- base 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
});

describe("MHPCO quote -- component blocks", () => {
  it("2 runes -- base premium 50 G (no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -- base premium 60 G (block applies)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    expect(policyBasePremium(Array(4).fill({ type: "rune" }))).toBe(100);
  });
  it("7 runes -- base premium 175 G (no block; block requires exactly 3)", () => {
    expect(policyBasePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });
  it("2 runes + 1 moonstone -- base premium 75 G (no block: different types are not alike)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -- base premium 120 G (two separate blocks, one per type)", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(policyBasePremium(items)).toBe(120);
  });
});

describe("MHPCO quote -- item-specific modifiers", () => {
  it("cursed sword adds 50 % of that item's base premium -- 50 G surcharge", () => {
    // 100 base + 50 curse + 10 first insurance (10 % of the policy base 100) + 5 fee = 165
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0)).toBe(165);
  });
  it("sword with enchantment 5 adds 30 % high-enchantment surcharge -- 30 G", () => {
    // 100 base + 30 enchantment + 10 first insurance (10 % of the policy base 100) + 5 fee = 145
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword with enchantment 4 adds no high-enchantment surcharge -- premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply (50 G + 30 G)", () => {
    // 100 base + 50 curse + 30 enchantment = 180; first insurance is 10 % of the
    // policy base premium (100) = 10; + 5 fee = 195
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }], 0)).toBe(195);
  });
  it("cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (50 % of the cursed item only) = 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(policyBasePremium(items)).toBe(160);
    // 210 + first insurance (10 % of the policy base 160 = 16) + 5 fee = 231
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(231);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("customer with exactly 2 years -- 20 % loyalty discount on the policy base premium", () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("customer with 1 year -- no loyalty discount, premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("first quote of the scenario -- 10 % first insurance surcharge on the policy base premium", () => {
    // without the surcharge the plain sword would cost 100 + 5 = 105
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("second quote of the scenario -- 15 % follow-up contract discount applies", () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("first insurance surcharge still applies to the second quote (each quoted item is a first insurance)", () => {
    // 100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee = 80
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(80);
  });
  it("5 G processing fee is added at the very end, after all percentage modifiers", () => {
    // no items: the fee is charged alone, untouched by any percentage
    expect(quote({ yearsWithMHPCO: 3 }, [], 1)).toBe(5);
    // with items the fee is added after the modifiers, never included in their base:
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95, not (100 + 5) * 0.9 = 95 rounded
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "amulet" }], 0)).toBe(59);
  });
});

describe("MHPCO quote -- rounding", () => {
  it("premium of 197.5 G rounds up to 198 G (in the MHPCO's favor)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0)).toBe(198);
  });
  it("intermediate amounts stay fractional; only the final premium is rounded", () => {
    // 1 rune, 2 years: 25 base - 5 loyalty + 2.5 first insurance + 5 fee = 27.5 -> 28.
    // Rounding the 2.5 surcharge up first would give 28 as well, but rounding each
    // term would lose the fraction: the fractional 2.5 must survive to the final sum.
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }], 0)).toBe(28);
    // 3 moonstones (block 60) with loyalty: 60 - 12 + 6 + 5 = 59, exact throughout
    expect(quote({ yearsWithMHPCO: 2 }, Array(3).fill({ type: "moonstone" }), 0)).toBe(59);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("newcomer (0 years) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(165);
  });
  it("3-year customer, second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up = 155 + 5 fee = 160
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, items, 1)).toBe(160);
  });
});

describe("MHPCO quote -- rejections", () => {
  it("quote with an unknown item type (broomstick) throws an Error (adopted reading: unknown type is rejected; spec defines only non-zero CLI exit and stderr description)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(/broomstick/);
  });
});

describe("MHPCO claim -- standard reimbursement", () => {
  it("regular steel sword enchantment 3, damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }).payout).toBe(400);
  });
  it("rune (no enchantment, no material), damage 200 G -- payout 100 G (full minus 100 G deductible)", () => {
    const policy = openPolicy([{ type: "rune" }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] }).payout).toBe(100);
  });
  it("damage below the deductible -- payout 0 G, never negative", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 40 }] }).payout).toBe(0);
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % first, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("steel sword enchantment 8, damage 1000 G -- payout 400 G (threshold is enchantment >= 8)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 8 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("steel sword enchantment 7, damage 1000 G -- payout 900 G (no high-enchantment clause)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 7 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(900);
  });
  it("dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(claim(policy, { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] }).payout).toBe(700);
  });
  it("dragon-material sword enchantment 8, damage 1000 G -- payout 400 G (50 % rule wins over dragon material, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(claim(policy, { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (both clauses apply; 50 % rule wins)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(claim(policy, { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
});

describe("MHPCO claim -- deductible per damage event", () => {
  it("sword damage 500 G and amulet damage 300 G in one incident -- payout 600 G (100 G deductible per damaged item)", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "amulet" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("two sword damage entries on a policy covering two swords -- each entry gets its own deductible", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
});

describe("MHPCO claim -- insurance sum and cap", () => {
  it("policy covering a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(insuranceSum(policy)).toBe(1600);
    expect(policy.cap).toBe(3200);
  });
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(insuranceSum(policy)).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
  it("policy covering a sword and 3 runes -- insurance sum 1750 G, cap 3500 G (block discount affects premium only)", () => {
    const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
    const policy = openPolicy(items);
    expect(insuranceSum(policy)).toBe(1750);
    expect(policy.cap).toBe(3500);
    // the block still discounts the premium: 100 + 60 = 160 base, not 100 + 75
    expect(policyBasePremium(items)).toBe(160);
  });
  it("cursed sword with modified premium 165 G -- cap 2000 G (cap is based on the unmodified insurance value)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(165);
    const policy = openPolicy(items);
    expect(insuranceSum(policy)).toBe(1000);
    expect(policy.cap).toBe(2000);
  });
  it("sword policy (cap 2000 G), first claim of 1500 G -- payout 1400 G, remainingCap 600 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword policy, second successive claim of 1500 G -- payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(claim(policy, incident)).toEqual({ payout: 1400, remainingCap: 600 });
    expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO claim -- rounding", () => {
  it("payout of 350.5 G rounds down to 350 G (in the MHPCO's favor)", () => {
    // enchantment 8 halves 901 to 450.5, less the 100 G deductible = 350.5 -> 350
    const policy = openPolicy([{ type: "sword", enchantment: 8 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("damage to an item not covered by the policy (amulet damaged, only a sword insured) throws an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(/amulet/);
  });
  it("damage entry with an unknown item type throws an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(/broomstick/);
  });
  it("more damage entries of a type than the policy covers (two sword damages, one sword insured) throws an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(/sword/);
  });
  it("damage entry with a negative amount (-200) throws an Error", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200|negative/);
  });
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("schema example scenario (5-year customer, amulet quote then 200 G amulet claim) -- premium and payout/remainingCap results", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    // premium: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 2 x 600 = 1200, leaving 1100
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("claim step result contains both payout and remainingCap, and successive claims draw down the same policy", () => {
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("a second quote step in the scenario carries the 15 % follow-up contract discount", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(run.status).toBe(0);
    // first: 100 + 10 first insurance + 5 fee = 115
    // second: 100 + 10 first insurance - 15 follow-up + 5 fee = 100
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  it("exits non-zero and writes an error description to stderr, with no results on stdout, for an unknown quote item type", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/broomstick/);
    // an error description, not a crash report
    expect(run.stderr).not.toMatch(/at \w+ \(|node:internal/);
  });
  it("exits non-zero and writes an error description to stderr for a claim damage entry not covered by the policy", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/amulet/);
    expect(run.stderr).not.toMatch(/at \w+ \(|node:internal/);
  });
  it("exits non-zero and writes an error description to stderr for a claim damage entry with a negative amount", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/-200|negative/);
    expect(run.stderr).not.toMatch(/at \w+ \(|node:internal/);
  });
  it("exits non-zero and writes an error description to stderr when damage entries of a type exceed the insured count", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/sword/);
    expect(run.stderr).not.toMatch(/at \w+ \(|node:internal/);
  });
});
