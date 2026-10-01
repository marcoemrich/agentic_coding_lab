import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, quote, runScenario } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliOutcome {
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

const NEWCOMER = { yearsWithMHPCO: 0 };
const FIRST_CONTRACT = 0;

// A run of alike components, the quantity the block offer is stated in terms of.
function alike(count: number, type: string) {
  return Array.from({ length: count }, () => ({ type }));
}

function runes(count: number) {
  return alike(count, "rune");
}

function moonstones(count: number) {
  return alike(count, "moonstone");
}

describe("MHPCO quote -- base premiums", () => {
  it("charges only the 5 G processing fee for an empty item list -- premium 5 G", () => {
    expect(quote(NEWCOMER, [], FIRST_CONTRACT)).toBe(5);
  });
  it("charges a sword at base premium 100 G -- premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "sword" }], FIRST_CONTRACT)).toBe(115);
  });
  it("charges an amulet at base premium 60 G -- premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "amulet" }], FIRST_CONTRACT)).toBe(71);
  });
  it("charges a staff at base premium 80 G -- premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "staff" }], FIRST_CONTRACT)).toBe(93);
  });
  it("charges a potion at base premium 40 G -- premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "potion" }], FIRST_CONTRACT)).toBe(49);
  });
  it("charges a rune at base premium 25 G -- premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up from 32.5)", () => {
    expect(quote(NEWCOMER, [{ type: "rune" }], FIRST_CONTRACT)).toBe(33);
  });
  it("charges a moonstone at base premium 25 G -- premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up from 32.5)", () => {
    expect(quote(NEWCOMER, [{ type: "moonstone" }], FIRST_CONTRACT)).toBe(33);
  });
});

describe("MHPCO quote -- component building blocks", () => {
  it("charges 2 runes at base premium 50 G (no block) -- premium 60 G", () => {
    expect(quote(NEWCOMER, runes(2), FIRST_CONTRACT)).toBe(60);
  });
  it("charges 3 runes at base premium 60 G (block applies) -- premium 71 G", () => {
    expect(quote(NEWCOMER, runes(3), FIRST_CONTRACT)).toBe(71);
  });
  it("charges 4 runes at base premium 100 G (no block -- block requires exactly 3) -- premium 115 G", () => {
    expect(quote(NEWCOMER, runes(4), FIRST_CONTRACT)).toBe(115);
  });
  it("charges 7 runes at base premium 175 G (no block -- block requires exactly 3) -- premium 198 G", () => {
    expect(quote(NEWCOMER, runes(7), FIRST_CONTRACT)).toBe(198);
  });
  it("charges 2 runes + 1 moonstone at base premium 75 G (no block: alike means same type) -- premium 88 G", () => {
    expect(quote(NEWCOMER, [...runes(2), { type: "moonstone" }], FIRST_CONTRACT)).toBe(88);
  });
  it("charges 3 runes + 3 moonstones at base premium 120 G (two separate blocks) -- premium 137 G", () => {
    expect(quote(NEWCOMER, [...runes(3), ...moonstones(3)], FIRST_CONTRACT)).toBe(137);
  });
});

describe("MHPCO quote -- item modifiers", () => {
  it("adds a 50 % curse surcharge to the cursed item's base premium -- cursed sword base 100 G -> 150 G, premium 165 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword", cursed: true }], FIRST_CONTRACT)).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at exactly enchantment 5 -- sword base 100 G -> 130 G, premium 145 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 5 }], FIRST_CONTRACT)).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- sword base premium stays 100 G, premium 115 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 4 }], FIRST_CONTRACT)).toBe(115);
  });
  it("adds both surcharges for a cursed sword with enchantment 5 -- base 100 G -> 180 G, premium 195 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword", cursed: true, enchantment: 5 }], FIRST_CONTRACT)).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item -- cursed sword + plain amulet -> 210 G before policy modifiers and fee, premium 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote(NEWCOMER, items, FIRST_CONTRACT)).toBe(231);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO -- sword premium 95 G (100 + 10 first insurance - 20 loyalty + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], FIRST_CONTRACT)).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], FIRST_CONTRACT)).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge to the policy base premium of every quote -- amulet for a 5-year customer: premium 59 G (60 + 6 first insurance - 12 loyalty + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 5 }, [{ type: "amulet" }], FIRST_CONTRACT)).toBe(59);
  });
  it("applies a 15 % follow-up discount to each contract after the customer's first quote -- sword on a second contract: premium 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies no follow-up discount to the customer's first quote -- sword premium 115 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword" }], FIRST_CONTRACT)).toBe(115);
  });
  it("adds the 5 G processing fee at the very end, after all percentage modifiers -- 3-year customer's second contract for a plain sword: premium 80 G (100 + 10 - 20 - 15 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(80);
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favor", () => {
  it("rounds a premium of 197.5 G up to 198 G -- 7 runes: 175 base + 17.5 first insurance + 5 fee", () => {
    expect(quote(NEWCOMER, runes(7), FIRST_CONTRACT)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 2 runes on a second contract: 50 + 5 - 7.5 + 5 = 52.5 -> 53 G (not 52, which per-term rounding would give)", () => {
    expect(quote(NEWCOMER, runes(2), 1)).toBe(53);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("quotes 165 G for a newcomer's cursed steel sword at enchantment 3 (0 years, first contract)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote(NEWCOMER, [sword], FIRST_CONTRACT)).toBe(165);
  });
  it("quotes 160 G for a 3-year customer's second contract covering a cursed sword at enchantment 7 -- first insurance still applies on a follow-up contract", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(160);
  });
});

describe("MHPCO quote -- rejections", () => {
  it("rejects a quote containing an unknown item type (e.g. broomstick) by throwing an Error", () => {
    expect(() => quote(NEWCOMER, [{ type: "broomstick" }], FIRST_CONTRACT)).toThrow(/broomstick/);
  });
});

describe("MHPCO claim -- standard reimbursement and deductible", () => {
  it("pays 400 G for a regular steel sword at enchantment 3 with damage 500 G (500 - 100 deductible)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("pays 100 G for a damaged rune with damage 200 G (no enchantment or material, 200 - 100)", () => {
    const incident = { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim([{ type: "rune" }], incident).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G -> payout 600 G", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("pays 0 G rather than a negative payout when damage is below the 100 G deductible -- damage 50 G -> payout 0 G", () => {
    const incident = { cause: "clumsiness", damages: [{ itemType: "sword", amount: 50 }] };
    expect(claim([{ type: "sword" }], incident).payout).toBe(0);
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("reimburses 50 % for damage to an item with exactly enchantment 8 -- steel sword, damage 1000 G -> payout 400 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 8 }];
    const incident = { cause: "curse backfire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("reimburses 50 % for damage at enchantment 9 -- steel sword, damage 1000 G -> payout 400 G (only the high-enchantment clause applies)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = { cause: "curse backfire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("fully reimburses dragon-material damage -- dragon sword at enchantment 5, damage 800 G -> payout 700 G (only the dragon clause applies, then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = { cause: "rockfall", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });
  it("lets the 50 % enchantment rule win over dragon material -- dragon sword at enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("applies the 50 % enchantment rule at exactly enchantment 8 on dragon material -- damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
});

describe("MHPCO claim -- insurance sum and cap", () => {
  it("caps a sword policy at 2000 G (2 x insurance sum 1000 G) -- after a 200 G damage paying 100 G, remainingCap is 1900 G", () => {
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    expect(claim([{ type: "sword" }], incident).remainingCap).toBe(1900);
  });
  it("sums insurance values across items -- sword + amulet -> insurance sum 1600 G, cap 3200 G (a 200 G sword damage pays 100 G, leaving 3100 G)", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values -- cursed sword (premium 165 G) -> cap 2000 G, not raised by premium modifiers", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    expect(quote(NEWCOMER, policy, FIRST_CONTRACT)).toBe(165);
    expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("excludes the block discount from the insurance sum -- sword + 3 runes -> insurance sum 1750 G (= 1000 + 3x250), cap 3500 G; the block discount affects the premium only", () => {
    const policy = [{ type: "sword" }, ...runes(3)];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("counts each item of a repeated type -- two swords -> insurance sum 2000 G (= 2x1000), cap 4000 G", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] };
    expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("reports remainingCap after a claim -- sword policy (cap 2000 G), claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(claim([{ type: "sword" }], incident)).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later payout to the remaining cap -- second claim of 1500 G after 1400 G already paid -> payout 600 G, remainingCap 0 G", () => {
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(claim([{ type: "sword" }], incident, 1400)).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO claim -- repeated item types", () => {
  it("treats two sword damage entries on a two-sword policy as separate damages with their own deductibles -- 500 G each -> payout 800 G, remainingCap 3200 G", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(claim(policy, incident)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error", () => {
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => claim([{ type: "sword" }], incident)).toThrow(/sword/);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("rejects a damage entry whose item is not part of the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim([{ type: "sword" }], incident)).toThrow(/amulet/);
  });
  it("rejects a damage entry with an unknown item type by throwing an Error", () => {
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] };
    expect(() => claim([{ type: "sword" }], incident)).toThrow(/broomstick/);
  });
  it("rejects a damage entry with a negative amount (-200) by throwing an Error", () => {
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim([{ type: "sword" }], incident)).toThrow(/-200/);
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favor", () => {
  it("rounds a payout of 350.5 G down to 350 G -- enchantment 8 sword, damage 901 G: 450.5 - 100 deductible", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 8 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident).payout).toBe(350);
  });
});

describe("MHPCO scenario runner", () => {
  it("returns one result per step in input order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "amulet" }] },
      ],
    };
    // The second quote is a follow-up contract: 60 + 6 first insurance - 9 follow-up + 5 fee.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 62 }] });
  });
  it("lets a claim step reference the policy created by an earlier quote step via its zero-based index", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("runs the schema example scenario -- amulet quote for a 5-year customer, then a 200 G fire claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("rejects a claim step referencing a step index that is not a quote by throwing an Error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "claim" as const,
          policy: 4,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/policy/);
  });
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} as JSON to stdout with exit code 0", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("exits non-zero and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).toBeGreaterThan(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).toBe("");
  });
  it.todo("exits non-zero and writes an error description to stderr for a damage entry outside the policy");
  it.todo("exits non-zero and writes an error description to stderr for a negative damage amount");
});
