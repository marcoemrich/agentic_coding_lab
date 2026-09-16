import { describe, expect, it } from "vitest";

import { execFileSync } from "node:child_process";

import { claim, createPolicy } from "./claim.js";
import { quote } from "./quote.js";

describe("MHPCO quote -- base premiums per item type", () => {
  it("charges only the 5 G processing fee for an empty item list -- premium 5 G", () => {
    expect(quote([])).toBe(5);
  });
  it("charges a sword at base premium 100 G -- premium 115 G for a new customer", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("charges an amulet at base premium 60 G -- premium 71 G for a new customer", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("charges a staff at base premium 80 G -- premium 93 G for a new customer", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("charges a potion at base premium 40 G -- premium 49 G for a new customer", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("charges a rune at base premium 25 G -- premium 33 G for a new customer", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("charges a moonstone at base premium 25 G -- premium 33 G for a new customer", () => {
    expect(quote([{ type: "moonstone" }])).toBe(33);
  });
  it("rejects an unknown item type with an Error -- quote of {type: 'broomstick'} throws", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("MHPCO quote -- component building block of 3 alike components", () => {
  it("charges 2 runes at 50 G base premium (no block)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("charges 3 runes at 60 G base premium (block applies)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("charges 4 runes at 100 G base premium (no block -- block requires exactly 3)", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("charges 7 runes at 175 G base premium (no block -- block requires exactly 3)", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("charges 2 runes + 1 moonstone at 75 G base premium (no block -- different types)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("charges 3 runes + 3 moonstones at 120 G base premium (two separate blocks)", () => {
    expect(quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toBe(137);
  });
});

describe("MHPCO quote -- item-specific premium modifiers", () => {
  it("adds a 50 % curse surcharge to a cursed sword -- base 100 G becomes 150 G", () => {
    expect(quote([{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % surcharge to a sword with enchantment exactly 5 -- base 100 G becomes 130 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4 -- base stays 100 G", () => {
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("adds both surcharges to a cursed sword with enchantment exactly 5 -- base 100 G becomes 180 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item on a multi-item policy -- cursed sword + plain amulet base 160 G becomes 210 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
});

describe("MHPCO quote -- policy-wide premium modifiers", () => {
  it("grants a 20 % loyalty discount at exactly 2 years with MHPCO -- sword base 100 G becomes 80 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
  });
  it("grants no loyalty discount at 1 year with MHPCO -- sword base stays 100 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 1, previousContracts: 0 })).toBe(115);
  });
  it("adds a 10 % first insurance surcharge on the first quote -- sword base 100 G becomes 110 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(115);
  });
  it("grants a 15 % follow-up discount on the second quote of a scenario -- sword base 100 G reduced by 15 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, previousContracts: 1 })).toBe(100);
  });
  it("applies the first insurance surcharge to every quote, even a follow-up contract", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 3, previousContracts: 1 })).toBe(80);
  });
  it("applies policy-wide modifiers to the policy base premium, not to the running total", () => {
    expect(quote([{ type: "sword", cursed: true }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(145);
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favour", () => {
  it("rounds a premium of 197.5 G up to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    expect(quote([{ type: "rune", cursed: true }])).toBe(45);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("quotes a newcomer's cursed sword at 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(165);
  });
  it("quotes a long-standing customer's second contract cursed enchanted sword at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], { yearsWithMHPCO: 3, previousContracts: 1 })).toBe(160);
  });
});

describe("MHPCO claim -- standard reimbursement and deductible", () => {
  it("reimburses a regular steel sword with enchantment 3 damaged 500 G at 400 G (damage minus 100 G deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("reimburses a damaged rune (no enchantment, no material) damaged 200 G at 100 G", () => {
    const result = claim(createPolicy([{ type: "rune" }]), { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G yields payout 600 G", () => {
    const result = claim(createPolicy([{ type: "sword" }, { type: "amulet" }]), { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] });
    expect(result.payout).toBe(600);
  });
});

describe("MHPCO claim -- special reimbursement clauses", () => {
  it("reimburses damage to an item with enchantment exactly 8 at 50 % -- dragon sword damaged 1000 G yields 400 G", () => {
    const result = claim(createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]), { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("reimburses dragon-material damage in full -- dragon sword enchantment 5 damaged 800 G yields 700 G", () => {
    const result = claim(createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]), { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
  it("lets the 50 % high-enchantment rule win over dragon material -- dragon sword enchantment 9 damaged 1000 G yields 400 G", () => {
    const result = claim(createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]), { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("applies only the high-enchantment clause to a steel sword enchantment 9 damaged 1000 G -- payout 400 G", () => {
    const result = claim(createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]), { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
});

describe("MHPCO claim -- insurance sum and payout cap", () => {
  it("caps a policy of a sword and an amulet at twice the insurance sum 1600 G -- cap 3200 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.remainingCap).toBe(3200);
  });
  it("bases the cap on the unmodified insurance value -- cursed sword premium 165 G still has cap 2000 G", () => {
    const policy = createPolicy([{ type: "sword", cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });
  it("counts a component block at full insurance value -- sword + 3 runes insurance sum 1750 G", () => {
    const policy = createPolicy([
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ]);
    expect(policy.remainingCap).toBe(3500);
  });
  it("reports the remaining cap after a claim -- sword cap 2000 G, claim 1500 G yields payout 1400 G and remaining cap 600 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("reduces a later payout to the remaining cap -- second claim of 1500 G yields payout 600 G and remaining cap 0 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    const second = claim(policy, { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("MHPCO claim -- multiple items of the same type", () => {
  it("insures two swords at insurance sum 2000 G with cap 4000 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate damages, each with its own deductible", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
  it("rejects with an Error a claim with more damage entries of a type than the policy covers", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toThrow(/sword/);
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favour", () => {
  it("rounds a payout of 350.5 G down to 350 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("rejects with an Error a damage to an item type not covered by the policy -- amulet damaged, only a sword insured", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(/amulet/);
  });
  it("rejects with an Error a damage entry with an unknown item type", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(/broomstick/);
  });
  it("rejects with an Error a damage entry with a negative amount -- amount: -200", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200|negative/);
  });
});

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results} to stdout in step order", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout).results).toEqual([{ premium: 165 }, { premium: 62 }]);
  });
  it("writes a quote result as {premium} and a claim result as {payout, remainingCap}", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout).results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("resolves a claim's policy field as the zero-based index of the quote step", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 500 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    const results = JSON.parse(outcome.stdout).results as { payout: number; remainingCap: number }[];
    expect(results[2]).toEqual({ payout: 400, remainingCap: 1200 });
  });
  it("exits non-zero and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).not.toMatch(/results/);
  });
  it("exits non-zero and writes an error description to stderr for a damage outside the policy", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/amulet/);
  });
  it("exits non-zero and writes an error description to stderr for a negative damage amount", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/-200|negative/);
  });
});
