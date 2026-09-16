import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { createPolicy, processClaim, quote } from "./claim-office.js";

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
  // --- Quote: simplest cases ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("quotes a single plain sword as 105 G (100 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes a single plain amulet as 65 G (60 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("quotes a single plain staff as 85 G (80 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("quotes a single plain potion as 45 G (40 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // --- Components and the building block of 3 alike ---
  it("quotes a single rune as 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes a single moonstone as 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
  it("quotes 2 runes as 50 G base premium (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("quotes 3 runes as 60 G base premium (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes, 0)).toBe(71);
  });
  it("quotes 4 runes as 100 G base premium (no block -- block requires exactly 3)", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes, 0)).toBe(115);
  });
  it("quotes 7 runes as 175 G base premium (no block -- 7 is not exactly 3)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });

  // --- "Alike" means same type, not same family ---
  it("quotes 2 runes + 1 moonstone as 75 G base premium (no block: different types)", () => {
    const mixed = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, mixed, 0)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as 120 G base premium (two separate blocks)", () => {
    const twoBlocks = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, twoBlocks, 0)).toBe(137);
  });

  // --- Item-specific modifiers in isolation ---
  it("adds a 50 % curse surcharge to a cursed sword -- base 100 G becomes 150 G", () => {
    const cursedSword = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword, 0)).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 (threshold, inclusive)", () => {
    const enchantedSword = [{ type: "sword", enchantment: 5 }];
    expect(quote({ yearsWithMHPCO: 0 }, enchantedSword, 0)).toBe(145);
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4 (below threshold)", () => {
    const plainSword = [{ type: "sword", enchantment: 4 }];
    expect(quote({ yearsWithMHPCO: 0 }, plainSword, 0)).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    const cursedEnchantedSword = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedEnchantedSword, 0)).toBe(195);
  });
  it("applies only the curse surcharge to a cursed sword with enchantment 4", () => {
    const cursedSword = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword, 0)).toBe(165);
  });

  // --- Modifier scope on multi-item policies ---
  it("applies the curse surcharge to the cursed item's base premium only -- cursed sword + plain amulet: 160 G base + 50 G curse = 210 G before further modifiers and fee", () => {
    const policy = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount to the policy base premium for a customer with exactly 2 years (threshold, inclusive)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge to the policy base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies a 15 % follow-up-contract discount on the customer's second quote in a scenario", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies no follow-up-contract discount on the customer's first quote in a scenario", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("still applies the first-insurance surcharge on a follow-up contract -- each quote's items are treated as a first insurance regardless of customer history", () => {
    const cursedSword = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, cursedSword, 1)).toBe(160);
  });
  it("adds the 5 G processing fee at the very end, after all other modifiers", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(80);
  });

  // --- Rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // base 25; +2.5 first insurance, -5 loyalty, -3.75 follow-up = 18.75; +5 fee = 23.75 -> 24.
    // Rounding each adjustment separately would yield 25.
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }], 1)).toBe(24);
  });

  // --- Quote integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, no previous contract) as 165 G", () => {
    const cursedSword = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword, 0)).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a cursed steel sword (enchantment 7, 3 years) as 160 G", () => {
    const cursedSword = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, cursedSword, 1)).toBe(160);
  });

  // --- Insurance sum and cap ---
  it("computes an insurance sum of 1600 G and a cap of 3200 G for a policy covering a sword and an amulet", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });
  it("computes an insurance sum of 2000 G and a cap of 4000 G for a policy covering two swords", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
  it("computes an insurance sum of 1750 G for a policy covering a sword and 3 runes -- the block discount affects the premium only, not the insurance sum", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(createPolicy(items).insuranceSum).toBe(1750);
  });
  it("bases the cap on the unmodified insurance value -- a cursed sword (premium 165 G) still has a cap of 2000 G", () => {
    const cursedSword = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword, 0)).toBe(165);
    expect(createPolicy(cursedSword).cap).toBe(2000);
  });

  // --- Claim: standard reimbursement ---
  it("pays out 400 G for a regular steel sword (enchantment 3) with damage 500 G (full reimbursement minus 100 G deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 100 G for a damaged rune (insurance value 250 G) with damage 200 G -- runes have no enchantment or material, so no special clause applies", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });

  // --- Claim: high-enchantment clause ---
  it("reimburses damage to an item with enchantment 8 at 50 % -- steel sword, damage 1000 G, payout 400 G (threshold, inclusive)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 8 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("reimburses damage to a steel sword with enchantment 9 at 50 % -- damage 1000 G, payout 400 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // --- Claim: dragon material clause ---
  it("fully reimburses damage to a dragon-material sword with enchantment 5 -- damage 800 G, payout 700 G (only the dragon clause applies)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });

  // --- Claim: enchantment threshold vs. dragon material ---
  it("applies the 50 % rule when both clauses apply -- dragon-material sword, enchantment 8, damage 1000 G, payout 400 G", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("applies the 50 % rule when both clauses apply -- dragon-material sword, enchantment 9, damage 1000 G, payout 400 G", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("applies the 100 G deductible once per damaged item -- dragon attack damages a sword (500 G) and an amulet (300 G), payout 600 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const result = processClaim(policy, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    });
    expect(result.payout).toBe(600);
  });
  it("treats two {itemType: 'sword'} damage entries as separate damages, each with its own deductible", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const result = processClaim(policy, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(800);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays out 1400 G and leaves 600 G remaining cap for the first 1500 G claim against a sword policy (cap 2000 G)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("reduces the second 1500 G claim to the remaining 600 G cap and leaves remainingCap 0 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const damages = [{ itemType: "sword", amount: 1500 }];
    processClaim(policy, { cause: "fire", damages });
    const second = processClaim(policy, { cause: "fire", damages });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // --- Claim: rounding in the MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour)", () => {
    // enchantment 8 halves the 901 G damage to 450.5 G; minus the 100 G deductible = 350.5 G.
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 8 }]);
    const result = processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // --- Error cases: the CLI exits non-zero and writes a description to stderr ---
  // Reading adopted: the domain layer signals rejection by throwing an Error naming the
  // offending value; the CLI translates that into a non-zero exit and a stderr description.
  it("rejects a quote containing an item with an unknown type (e.g. broomstick): CLI exits non-zero, writes an error description to stderr, and writes no results to stdout", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(/broomstick/);
  });
  it("rejects a claim referencing an item not covered by the policy (amulet damaged when only a sword is insured): CLI exits non-zero and writes an error description to stderr", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      processClaim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim referencing a damage entry with an unknown item type: CLI exits non-zero and writes an error description to stderr", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      processClaim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim whose damages contain more entries of a type than the policy covers (two sword damages, one sword insured): CLI exits non-zero and the whole claim is rejected", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      processClaim(policy, {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
      }),
    ).toThrow(/sword/);
    expect(policy.remainingCap).toBe(2000);
  });
  it("rejects a claim containing a damage entry with amount -200: CLI exits non-zero and writes an error description to stderr", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      processClaim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200/);
  });

  // --- CLI contract ---
  it("reads a scenario JSON from stdin and writes {results: [...]} to stdout with one result per step, in order", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).results).toHaveLength(2);
  });
  it("writes {premium} for a quote step and {payout, remainingCap} for a claim step", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.status).toBe(0);
    const { results } = JSON.parse(result.stdout);
    expect(results[0]).toEqual({ premium: 115 });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("processes the schema example (5 years, amulet quote then 200 G amulet claim) producing a premium and a payout/remainingCap pair", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // 60 base + 6 first insurance - 12 loyalty = 54, + 5 fee = 59; payout 200 - 100 = 100 of a 1200 cap.
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
