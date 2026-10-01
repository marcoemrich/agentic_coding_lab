import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, createPolicy, quote } from "./claim-office.js";

function runCli(scenario: unknown): { stdout: string; status: number } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout, status: 0 };
  } catch (error) {
    const failure = error as { stdout?: string; status?: number };
    return { stdout: failure.stdout ?? "", status: failure.status ?? 1 };
  }
}

describe("MHPCO Claim Office -- quote: base premiums per item type", () => {
  it("empty item list -> premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("single sword (steel, enchantment 3, not cursed), new customer -> base premium 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("single amulet -> base premium 60 G", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [amulet], 0)).toBe(71);
  });
  it("single staff -> base premium 80 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion -> base premium 40 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });
  it("single rune (component) -> base premium 25 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("single moonstone (component) -> base premium 25 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
});

describe("MHPCO Claim Office -- quote: component building block of 3 alike", () => {
  it("2 runes -> base premium 50 G (no block)", () => {
    const runes = [{ type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(60);
  });
  it("3 runes -> base premium 60 G (block applies)", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(71);
  });
  it("4 runes -> base premium 100 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(115);
  });
  it("7 runes -> base premium 175 G (no block; 7 is not a multiple-of-3 block)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: alike means same type)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(88);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });
});

describe("MHPCO Claim Office -- quote: item-specific modifiers", () => {
  it("cursed sword -> 50 % curse surcharge on that item's base premium (100 -> 150)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("sword with enchantment 5 -> 30 % high-enchantment surcharge applies (threshold is >= 5)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply (100 + 50 + 30)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(195);
  });
  it("cursed sword + plain amulet -> policy base 160 G, curse adds 50 G (50 % of the cursed item only) -> 210 G before policy modifiers and fee", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(231);
  });
});

describe("MHPCO Claim Office -- quote: policy-wide modifiers", () => {
  it("customer with exactly 2 years with MHPCO -> 20 % loyalty discount applies on the policy base premium", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 2 }, [sword], 0)).toBe(95);
  });
  it("customer with 1 year with MHPCO -> no loyalty discount", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 1 }, [sword], 0)).toBe(115);
  });
  it("every item in a quote carries a 10 % first-insurance surcharge on its base premium regardless of customer history", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 5 }, items, 0)).toBe(149);
  });
  it("second quote in a scenario -> 15 % follow-up contract discount on the policy base premium", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 1)).toBe(100);
  });
  it("first quote in a scenario -> no follow-up contract discount", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("5 G processing fee is added at the very end of every premium", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(80);
  });
});

describe("MHPCO Claim Office -- quote: rounding in MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("intermediate amounts stay fractional; only the final premium is rounded", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(143);
  });
});

describe("MHPCO Claim Office -- quote: integration examples", () => {
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 -> premium 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("customer with 3 years, second quote, cursed steel sword enchantment 7 -> premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [cursedSword], 1)).toBe(160);
  });
});

describe("MHPCO Claim Office -- quote: rejection", () => {
  it("quote with an unknown item type (e.g. broomstick) -> quote rejected (throws Error, surfaced by the CLI as a non-zero exit and stderr, no results on stdout)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(Error);
  });
});

describe("MHPCO Claim Office -- claim: standard reimbursement and deductible", () => {
  it("regular steel sword enchantment 3, damage 500 G -> payout 400 G (full minus 100 G deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G (full minus deductible)", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });
  it("damage below the deductible -> payout 0 G (never negative)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] });
    expect(result.payout).toBe(0);
  });
  it("dragon attack damaging an insured sword (500 G) and amulet (300 G) -> payout 600 G (deductible once per damaged item)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
});

describe("MHPCO Claim Office -- claim: special clauses", () => {
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % high-enchantment clause, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (enchantment threshold >= 8 applies, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins over full reimbursement, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
});

describe("MHPCO Claim Office -- claim: insurance sum and cap", () => {
  it("policy covering a sword and an amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(3200);
  });
  it("policy covering a cursed sword -> cap 2000 G (unmodified insurance value; premium modifiers do not raise the cap)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(2000);
  });
  it("policy covering a sword and 3 runes -> insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(3500);
  });
  it("policy covering two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const policy = createPolicy([{ ...sword }, { ...sword }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(result.remainingCap).toBe(4000);
  });
  it("sword policy (cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword policy (cap 2000 G), second successive claim of 1500 G -> payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    claim(policy, incident);
    const second = claim(policy, incident);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO Claim Office -- claim: multiple items of the same type", () => {
  it("two swords insured, dragon attack damages both -> each damages entry is a separate damage with its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const policy = createPolicy([{ ...sword }, { ...sword }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
  it("more damage entries of a type than the policy covers (two sword damages, one sword insured) -> claim rejected (throws Error, surfaced by the CLI as a non-zero exit)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toThrow(Error);
  });
});

describe("MHPCO Claim Office -- claim: rounding in MHPCO's favor", () => {
  it("payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office -- claim: rejection", () => {
  it("damage entry for an item not part of the policy (amulet damaged, only a sword insured) -> claim rejected (throws Error, surfaced by the CLI as a non-zero exit and stderr)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(Error);
  });
  it("damage entry with an unknown item type -> claim rejected (throws Error, surfaced by the CLI as a non-zero exit and stderr)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(Error);
  });
  it("damage entry with a negative amount (-200) -> claim rejected (throws Error, surfaced by the CLI as a non-zero exit and stderr)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(Error);
  });
});

describe("MHPCO Claim Office -- CLI end-to-end", () => {
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "quote", items: [] },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }, { premium: 5 }] });
  });
  it("schema example: 5-year customer, amulet quote then amulet claim of 200 G -> premium and payout/remainingCap results", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("a claim step refers to the policy created by an earlier quote step via its zero-based step index", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(status).toBe(0);
    const results = JSON.parse(stdout).results;
    expect(results[2]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it("an unknown item type in a quote makes the CLI exit non-zero with no results on stdout", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
  });
});
