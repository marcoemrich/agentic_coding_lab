import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { claim, openPolicy } from "./claim.js";
import { runScenario } from "./scenario.js";
import { basePremium, quote } from "./quote.js";

const components = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));

const runCli = (input: string) => {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

describe("MHPCO Claim Office", () => {
  // --- Simplest case: processing fee only ---
  it("quote with an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // --- Price list: base premium per main item type (each entry independently specified) ---
  it("quote for a single plain sword -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quote for a single plain amulet -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quote for a single plain staff -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quote for a single plain potion -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });

  // --- Price list: components at 25 G base premium each ---
  it("quote for a single rune -- premium 33 G (25 base + 2.5 first insurance = 27.5, rounded up + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quote for a single moonstone -- premium 33 G (25 base, same component price as a rune)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // --- Building block of 3 alike components (base-premium examples from the spec) ---
  it("base premium for 2 runes -- 50 G (no block)", () => {
    expect(basePremium(components("rune", 2))).toBe(50);
  });
  it("base premium for 3 runes -- 60 G (block applies)", () => {
    expect(basePremium(components("rune", 3))).toBe(60);
  });
  it("base premium for 4 runes -- 100 G (no block -- block requires exactly 3)", () => {
    expect(basePremium(components("rune", 4))).toBe(100);
  });
  it("base premium for 7 runes -- 175 G (no block at 7 components)", () => {
    expect(basePremium(components("rune", 7))).toBe(175);
  });

  // --- 'Alike' means same component type (clarifying question) ---
  it("base premium for 2 runes + 1 moonstone -- 75 G (no block: different types)", () => {
    expect(basePremium([...components("rune", 2), ...components("moonstone", 1)])).toBe(75);
  });
  it("base premium for 3 runes + 3 moonstones -- 120 G (two separate blocks)", () => {
    expect(basePremium([...components("rune", 3), ...components("moonstone", 3)])).toBe(120);
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds a 50 % surcharge on that item's base premium -- 100 -> 150 G base", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("sword with enchantment 5 adds the 30 % high-enchantment surcharge -- 100 -> 130 G base", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge -- base stays 100 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with enchantment 5 gets both surcharges -- 100 -> 180 G base", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });

  // --- Modifier scope on multi-item policies (clarifying question) ---
  it("cursed sword + plain amulet -- item surcharge is 50 G (50 % of the cursed item only), policy base 210 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(basePremium(items)).toBe(160);
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO receives the 20 % loyalty discount -- 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("customer with 1 year with MHPCO receives no loyalty discount -- 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("first insurance adds a 10 % surcharge on the policy base premium -- sword + amulet = 181 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
  });
  it("each contract after the customer's first receives a 15 % follow-up discount -- 80 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(80);
  });
  it("the customer's first quote in a scenario receives no follow-up discount -- 95 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("the first insurance surcharge applies to every quote regardless of customer history -- 3-year customer's 2nd quote of a fresh amulet is 50 G, not 44 G", () => {
    // 60 base - 12 loyalty - 9 follow-up + 6 first insurance + 5 fee = 50
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "amulet" }], 1)).toBe(50);
  });
  it("the 5 G processing fee is added at the very end -- a loyal customer's fee is not discounted", () => {
    expect(quote({ yearsWithMHPCO: 5 }, [], 3)).toBe(5);
  });

  // --- Rounding in the MHPCO's favour ---
  it("a fractional premium is rounded up in the MHPCO's favour -- 27.5 G becomes 28 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }])).toBe(28);
  });
  it("a payout of 350.5 G is rounded down to 350 G (in the MHPCO's favour)", () => {
    const policy = openPolicy([{ type: "sword", enchantment: 9 }]);
    // 901 x 50 % = 450.5, minus the 100 G deductible = 350.5
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] }).payout).toBe(350);
  });
  it("intermediate amounts stay fractional -- moonstone at 2 years on a follow-up contract is 24 G (23.75), not 25 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "moonstone" }], 1)).toBe(24);
  });

  // --- Integration examples from the spec ---
  it("newcomer (0 years, first contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(165);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(160);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claim on a regular steel sword enchantment 3 with damage 500 G -- payout 400 G", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }).payout).toBe(400);
  });
  it("claim on a rune (no enchantment, no material) with damage 200 G -- payout 100 G", () => {
    const policy = openPolicy([{ type: "rune" }]);
    expect(claim(policy, { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] }).payout).toBe(100);
  });
  it("damage to an amulet with damage 300 G -- payout 200 G (deductible applies to any item type)", () => {
    const policy = openPolicy([{ type: "amulet" }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] }).payout).toBe(200);
  });

  // --- Claim: special clauses ---
  it("steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % clause, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("sword enchantment 8 exactly triggers the 50 % clause -- dragon sword, damage 1000 G -> payout 400 G", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] }).payout).toBe(700);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (50 % clause wins, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("sword enchantment 7 (below threshold), steel, damage 1000 G -- payout 900 G (no special clause)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 7 }]);
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(900);
  });

  // --- Claim: deductible per damage event ---
  it("one incident damaging a sword (500 G) and an amulet (300 G) -- payout 600 G (deductible per damaged item)", () => {
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

  // --- Claim: insurance sum and cap ---
  it("policy over a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "amulet" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(3100);
  });
  it("policy over two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] });
    expect(result.remainingCap).toBe(3900);
  });
  it("policy over a sword and 3 runes -- insurance sum 1750 G (block discount affects the premium only)", () => {
    const items = [{ type: "sword" }, ...components("rune", 3)];
    expect(basePremium(items)).toBe(160); // block still discounts the premium
    const result = claim(openPolicy(items), { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.remainingCap).toBe(3400); // cap 3500 = 2 x 1750, minus 100 payout
  });
  it("cursed sword with premium modifiers -- cap stays 2000 G (based on the unmodified insurance value)", () => {
    const sword = { type: "sword", cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(165); // premium is raised
    const result = claim(openPolicy([sword]), { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] });
    expect(result.remainingCap).toBe(1900); // cap is not: 2000 - 100
  });
  it("insurance sum for a single staff -- cap 1600 G (staff insurance value 800 G)", () => {
    const result = claim(openPolicy([{ type: "staff" }]), { cause: "fire", damages: [{ itemType: "staff", amount: 200 }] });
    expect(result.remainingCap).toBe(1500);
  });
  it("insurance sum for a single potion -- cap 800 G (potion insurance value 400 G)", () => {
    const result = claim(openPolicy([{ type: "potion" }]), { cause: "fire", damages: [{ itemType: "potion", amount: 200 }] });
    expect(result.remainingCap).toBe(700);
  });
  it("insurance sum for a single moonstone -- cap 500 G (component insurance value 250 G)", () => {
    const result = claim(openPolicy([{ type: "moonstone" }]), { cause: "fire", damages: [{ itemType: "moonstone", amount: 200 }] });
    expect(result.remainingCap).toBe(400);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword policy (cap 2000 G), first claim of 1500 G -- payout 1400 G, remainingCap 600 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword policy, second successive claim of 1500 G -- payout 600 G, remainingCap 0 G (capped)", () => {
    const policy = openPolicy([{ type: "sword" }]);
    claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    const second = claim(policy, { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // --- Claim: two damages of the same item type ---
  it("two swords insured, incident damages both -- each damage entry gets its own deductible (800 G)", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(800);
  });

  // --- Error cases (observable contract: CLI exits non-zero and writes a description to stderr) ---
  it("quote with an unknown item type 'broomstick' -- rejected with an Error naming the unknown type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("claim naming an item not covered by the policy -- rejected with an Error naming the item type", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() => claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] })).toThrow(/amulet/);
  });
  it("claim naming an unknown item type in a damage entry -- rejected with an Error naming the type", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() => claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] })).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than insured -- rejected with an Error naming the item type", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(/sword/);
  });
  it("claim with a negative damage amount (-200) -- rejected with an Error describing the invalid amount", () => {
    const policy = openPolicy([{ type: "sword" }]);
    expect(() => claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] })).toThrow(/-200/);
  });

  // --- CLI adapter ---
  it("a scenario's steps are processed in order, each quote counting as a previous contract for the next", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
  it("CLI schema example: 5-year customer quotes an amulet then claims 200 G -- premium and payout/remainingCap results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).toBe(0);
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI rejects an unknown item type -- non-zero exit, description on stderr, no results on stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
});
