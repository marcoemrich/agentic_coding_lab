import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, quote, type Item } from "./claim-office.js";
import { runScenario, type Scenario } from "./cli.js";

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Readings adopted where prompt.md leaves a contract open:
 * - "alike" components means exactly the same type (2 runes + 1 moonstone => no block).
 * - A block is exactly 3 alike components; 4 and 7 runes form no block.
 * - First-insurance surcharge applies to every quote, regardless of customer history.
 * - Rejections: the domain layer throws an Error; src/cli.ts maps that to a
 *   non-zero exit status plus a stderr description. The spec defines no message
 *   text, so tests assert only that an Error is thrown.
 */

describe("quote -- base premiums per item", () => {
  it("empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("single sword -- base premium 100 G (+10 % first insurance +5 G fee = 115 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("single amulet -- base premium 60 G (+10 % first insurance +5 G fee = 71 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }], 0),
    ).toBe(71);
  });
  it("single staff -- base premium 80 G (+10 % first insurance +5 G fee = 93 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "oak", enchantment: 1, cursed: false }], 0),
    ).toBe(93);
  });
  it("single potion -- base premium 40 G (+10 % first insurance +5 G fee = 49 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }], 0),
    ).toBe(49);
  });
  it("single rune (component) -- base premium 25 G (+10 % first insurance +5 G fee = 32.5 -> 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("single moonstone (component) -- base premium 25 G (+10 % first insurance +5 G fee = 32.5 -> 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
  it("unknown item type (broomstick) -- throws Error", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(Error);
  });
});

describe("quote -- component blocks of 3 alike", () => {
  it("2 runes -- base premium 50 G, no block (+10 % first insurance +5 G fee = 60 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes -- base premium 60 G, block applies (+10 % first insurance +5 G fee = 71 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(71);
  });
  it("4 runes -- base premium 100 G, no block: block requires exactly 3 (+10 % +5 G fee = 115 G)", () => {
    const fourRunes: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes, 0)).toBe(115);
  });
  it("7 runes -- base premium 175 G, no block (+10 % +5 G fee = 197.5 -> 198 G)", () => {
    const sevenRunes: Item[] = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("2 runes + 1 moonstone -- base premium 75 G, no block: different types (+10 % +5 G fee = 88 G)", () => {
    const mixed: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, mixed, 0)).toBe(88);
  });
  it("3 runes + 3 moonstones -- base premium 120 G, two separate blocks (+10 % +5 G fee = 137 G)", () => {
    const twoBlocks: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, twoBlocks, 0)).toBe(137);
  });
});

describe("quote -- item-specific modifiers", () => {
  it("cursed sword -- 50 % surcharge on that item's base premium (100 +50 +10 first +5 fee = 165 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("sword with enchantment 5 -- 30 % high-enchantment surcharge applies (100 +30 +10 +5 = 145 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: false }], 0),
    ).toBe(145);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge (100 +10 +5 = 115 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 4, cursed: false }], 0),
    ).toBe(115);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply (100 +50 +30 +10 +5 = 195 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: true }], 0),
    ).toBe(195);
  });
  it("cursed sword + plain amulet -- curse adds 50 G (50 % of the sword only): 160 +50 +16 first +5 fee = 231 G", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(231);
  });
});

describe("quote -- policy-wide modifiers", () => {
  it("customer with exactly 2 years -- 20 % loyalty discount applies (100 -20 +10 +5 = 95 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 2 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(95);
  });
  it("customer with 1 year -- no loyalty discount (100 +10 +5 = 115 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 1 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("first quote in scenario -- 10 % first-insurance surcharge applies (100 +10 +5 = 115 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("second quote in scenario -- 15 % follow-up contract discount applies (155 +5 fee = 160 G)", () => {
    const cursedSword: Item[] = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, cursedSword, 1)).toBe(160);
  });
  it("first-insurance surcharge still applies on a follow-up contract (the -15 G is the only difference)", () => {
    const cursedSword: Item[] = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    const customer = { yearsWithMHPCO: 3 };
    expect(quote(customer, cursedSword, 0)).toBe(175);
    expect(quote(customer, cursedSword, 1)).toBe(160);
  });
  it("processing fee of 5 G is added at the very end -- a flat 5 G, never scaled by any modifier", () => {
    const plainSword: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const cursedSword: Item[] = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    // 110 G before fee; a fee scaled by the 10 % first-insurance surcharge would give 116 G.
    expect(quote({ yearsWithMHPCO: 0 }, plainSword, 0)).toBe(115);
    // 155 G before fee, despite much larger modifiers -- the fee is still exactly 5 G.
    expect(quote({ yearsWithMHPCO: 3 }, cursedSword, 1)).toBe(160);
  });
});

describe("quote -- rounding in MHPCO's favor", () => {
  it("premium of 197.5 G -- rounded up to 198 G (MHPCO's favor)", () => {
    const sevenRunes: Item[] = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("intermediate amounts kept as fractions; only the final premium is rounded (136.25 -> 137 G)", () => {
    // 175 base +17.5 first insurance -35 loyalty -26.25 follow-up +5 fee = 136.25
    const sevenRunes: Item[] = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 5 }, sevenRunes, 1)).toBe(137);
  });
});

describe("quote -- integration examples", () => {
  it("newcomer with a cursed sword -- premium 165 G (100 base +50 curse +10 first +5 fee)", () => {
    const cursedSword: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword, 0)).toBe(165);
  });
  it("long-standing customer's second contract, cursed sword ench. 7 -- premium 160 G", () => {
    // 100 base +50 curse +30 high enchantment -20 loyalty +10 first insurance -15 follow-up +5 fee
    const cursedSword: Item[] = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, cursedSword, 1)).toBe(160);
  });
});

describe("claim -- standard reimbursement", () => {
  it("regular sword (steel, ench. 3), damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("rune (value 250 G), damage 200 G -- payout 100 G (no enchantment or material, so no clause)", () => {
    const policy: Item[] = [{ type: "rune" }];
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident).payout).toBe(100);
  });
  it("deductible of 100 G applies once per damaged item, not once per incident", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    // Per damaged item: (500-100) + (300-100) = 600. Once per incident would give 700.
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
});

describe("claim -- special clauses", () => {
  it("steel sword, enchantment 9, damage 1000 G -- payout 400 G (50 % first, then deductible)", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -- payout 700 G (full, then deductible)", () => {
    const policy: Item[] = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });
  it("dragon-material sword, enchantment 8, damage 1000 G -- payout 400 G (50 % rule wins at the threshold)", () => {
    const policy: Item[] = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -- payout 400 G (both apply, 50 % rule wins)", () => {
    const policy: Item[] = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
});

describe("claim -- insurance sum and cap", () => {
  it("sword + amulet -- insurance sum 1600 G (1000+600), cap 3200 G", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(3100);
  });
  it("cursed sword -- cap 2000 G, based on the unmodified insurance value", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1900);
  });
  it("sword + 3 runes -- insurance sum 1750 G (1000 + 3x250); the block discount affects the premium only", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(100);
    // cap = 2 x 1750 = 3500; the 60 G block premium never reduces the insurance sum.
    expect(result.remainingCap).toBe(3400);
  });
  it("two swords -- insurance sum 2000 G (2x1000), cap 4000 G", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(3900);
  });
  it("sword (cap 2000 G), first claim of 1500 G -- payout 1400 G, remaining cap 600 G", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword, second claim of 1500 G -- payout 600 G (reduced to the remaining cap), remaining cap 0 G", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident);
    const second = claim(policy, incident, first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("claim -- multiple items of the same type", () => {
  it("two sword damage entries against two insured swords -- each has its own deductible (600 G)", () => {
    const policy: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("more damage entries of a type than insured (two sword damages, one sword) -- throws Error", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(Error);
  });
});

describe("claim -- rounding and rejections", () => {
  it("payout of 350.5 G -- rounded down to 350 G (MHPCO's favor)", () => {
    // enchantment 9 halves the damage: 901/2 = 450.5, minus the 100 G deductible = 350.5
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(350);
    expect(result.remainingCap).toBe(1650);
  });
  it("damage to an item not part of the policy (amulet damaged, only a sword insured) -- throws Error", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow(Error);
  });
  it("damage entry with an unknown item type (broomstick) -- throws Error", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow(Error);
  });
  it("damage entry with amount -200 -- throws Error", () => {
    const policy: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow(Error);
  });
});

describe("cli -- scenario processing", () => {
  it("processes steps sequentially and returns one result per step", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    };
    // Second quote is a follow-up contract: 60 base +6 first insurance -9 follow-up +5 fee = 62.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 62 }] });
  });
  it("claim step refers to the policy created by an earlier quote via step index, carrying the cap", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    // Cap 2000: first claim pays 1400 (600 left), second is reduced to the remaining 600.
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("schema example scenario -- quote result then claim result, via the real CLI on stdin/stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    // 60 base -12 loyalty +6 first insurance +5 fee = 59; payout 200-100=100, cap 1200-100=1100.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("invalid scenario (unknown item type) -- exits non-zero, writes to stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
});
