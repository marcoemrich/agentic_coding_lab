import { describe, expect, it } from "vitest";
import { quote } from "./quote.js";
import { claim, openPolicy } from "./claim.js";
import { runScenario, type Scenario } from "./scenario.js";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile("npx", ["tsx", CLI_PATH], (error, stdout, stderr) => {
      resolve({ exitCode: error === null ? 0 : (error.code as number), stdout, stderr });
    });
    child.stdin?.end(JSON.stringify(scenario));
  });
}

/**
 * Adopted readings where the specification leaves a contract open:
 *
 * - "alike" components means exactly the same item type (2 runes + 1 moonstone
 *   gives no block), per the clarifying question in the specification.
 * - the special component block price applies only to a count of exactly 3 of
 *   one component type (4 runes -> 100 G, 7 runes -> 175 G).
 * - the first-insurance surcharge is a policy-wide modifier applied to every
 *   quote, per the "Long-standing customer's second contract" example.
 * - the follow-up discount applies to every quote after the customer's first
 *   quote within a scenario.
 * - rejections are observable as a thrown Error from the domain operation; the
 *   CLI translates that into a non-zero exit code plus a stderr description.
 *   The specification fixes neither an error class nor a message, so tests
 *   assert only that an Error is thrown / that the CLI exits non-zero.
 */

describe("MHPCO claim office", () => {
  // --- quote: base premiums per item type ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("quotes a plain sword as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes a plain amulet as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("quotes a plain staff as 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("quotes a plain potion as 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });
  it("quotes a single rune as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes a single moonstone as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
  it("throws for a quote item with an unknown type such as broomstick", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });

  // --- quote: component building blocks ---
  it("quotes 2 runes with a base premium of 50 G (no block) -- 60 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("quotes 3 runes with a base premium of 60 G (block applies) -- 71 G total", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes, 0)).toBe(71);
  });
  it("quotes 4 runes with a base premium of 100 G (block requires exactly 3) -- 115 G total", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes, 0)).toBe(115);
  });
  it("quotes 7 runes with a base premium of 175 G (block requires exactly 3) -- 198 G total", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone with a base premium of 75 G (different types, no block) -- 88 G total", () => {
    const mixed = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, mixed, 0)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones with a base premium of 120 G (two separate blocks) -- 137 G total", () => {
    const twoBlocks = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, twoBlocks, 0)).toBe(137);
  });
  it("quotes 3 moonstones with a base premium of 60 G (block applies per component type) -- 71 G total", () => {
    const threeMoonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quote({ yearsWithMHPCO: 0 }, threeMoonstones, 0)).toBe(71);
  });

  // --- quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the affected item's base premium -- cursed sword 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("adds a 30 % surcharge for an item with enchantment exactly 5 -- sword 145 G", () => {
    const enchantedSword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [enchantedSword], 0)).toBe(145);
  });
  it("adds no high-enchantment surcharge for an item with enchantment 4 -- sword 115 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- 195 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item on a multi-item policy -- cursed sword + plain amulet: base 160 G + 50 G curse + 16 G first insurance + 5 G fee = 231 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(231);
  });

  // --- quote: policy-wide modifiers ---
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO -- sword 95 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 2 }, [sword], 0)).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword 115 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 1 }, [sword], 0)).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge to the policy base premium -- sword + amulet: 160 G base + 16 G + 5 G fee = 181 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(181);
  });
  it("applies the 15 % follow-up discount to every quote after the customer's first quote -- 3-year customer's second contract for a cursed sword (enchantment 7) = 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [cursedSword], 1)).toBe(160);
  });
  it("applies no follow-up discount to the customer's first quote -- sword at 3 years = 95 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 0)).toBe(95);
  });

  // --- quote: rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favour) -- 7 runes", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 1 rune: 25 + 2.5 + 5 = 32.5 -> 33 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });

  // --- quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3) as 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [cursedSword], 1)).toBe(160);
  });

  // --- claim: standard reimbursement ---
  it("pays out 400 G for a steel sword (enchantment 3) with 500 G damage (full minus 100 G deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 100 G for a rune with 200 G damage (no enchantment or material, so no special clause)", () => {
    const policy = openPolicy([{ type: "rune" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });
  it("reports the remaining cap after a claim (sword policy, cap 2000 G, payout 400 G -> 1600 G remaining)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.remainingCap).toBe(1600);
  });

  // --- claim: special clauses ---
  it("pays out 400 G for a steel sword with enchantment 9 and 1000 G damage (50 % clause, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 400 G for a dragon-material sword with enchantment exactly 8 and 1000 G damage", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 8, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 700 G for a dragon-material sword with enchantment 5 and 800 G damage (full reimbursement, then deductible)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 5, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
  it("pays out 400 G for a dragon-material sword with enchantment 9 and 1000 G damage (50 % rule wins)", () => {
    const policy = openPolicy([{ type: "sword", material: "dragon", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // --- claim: deductible per damage event ---
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G -> payout 600 G", () => {
    const policy = openPolicy([
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

  // --- claim: rounding ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favour) -- enchantment 9 sword, 901 G damage", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // --- claim: insurance sum and cap ---
  it("caps a policy at twice its insurance sum -- sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy = openPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    expect(policy.remainingCap).toBe(3200);
  });
  it("bases the cap on unmodified insurance values -- cursed sword -> cap 2000 G despite a 165 G premium", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
    expect(openPolicy([cursedSword]).remainingCap).toBe(2000);
  });
  it("bases the insurance sum on undiscounted component values -- sword + 3 runes -> insurance sum 1750 G, cap 3500 G", () => {
    const policy = openPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ]);
    expect(policy.remainingCap).toBe(3500);
  });
  it("carries the cap across successive claims -- 1500 G claim -> payout 1400 G, remaining cap 600 G", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("reduces a later claim to the remaining cap -- second 1500 G claim -> payout 600 G, remaining cap 0 G", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident);
    const second = claim({ ...policy, remainingCap: first.remainingCap }, incident);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // --- claim: multiple items of the same type ---
  it("insures two swords with an insurance sum of 2000 G and a cap of 4000 G", () => {
    const twoSwords = Array.from({ length: 2 }, () => ({
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    }));
    expect(openPolicy(twoSwords).remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate damages, each with its own deductible -- 500 G each -> 800 G", () => {
    const twoSwords = Array.from({ length: 2 }, () => ({
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    }));
    const result = claim(openPolicy(twoSwords), {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });
  it("throws when the damages contain more entries of a type than the policy covers -- two sword damages, one sword insured", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow();
  });
  it("throws when a damage entry refers to an item type not covered by the policy -- amulet damaged, only a sword insured", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow();
  });
  it("throws when a damage entry has an unknown item type", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow();
  });
  it("throws when a damage entry has a negative amount such as -200", () => {
    const policy = openPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow();
  });

  // --- CLI adapter ---
  it("runs a scenario and returns one result per step, in order", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(runScenario(scenario).results).toHaveLength(2);
  });
  it("writes quote results as { premium } and claim results as { payout, remainingCap }", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("resolves a claim's policy field to the quote step at that zero-based index", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    };
    expect(runScenario(scenario).results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
  it("exits non-zero and writes to stderr for an unknown item type, writing no results to stdout", async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.exitCode).not.toBe(0);
    expect(run.stderr).not.toBe("");
    expect(run.stdout).toBe("");
  });
  it("exits non-zero and writes to stderr for a claim damage not covered by the policy", async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.exitCode).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
  it("exits non-zero and writes to stderr for a negative damage amount", async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(run.exitCode).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
});
