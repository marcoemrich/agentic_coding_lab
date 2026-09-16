import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { type Customer, insuranceSum, Policy, policyBasePremium, quote } from "./claim-office.js";

const NEWCOMER: Customer = { yearsWithMHPCO: 0, previousContracts: 0 };

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

const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));

describe("MHPCO claim office", () => {
  // --- Quote: simplest case and the processing fee ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote(NEWCOMER, [])).toBe(5);
  });

  // --- Quote: base premium catalogue (each type has its own base premium) ---
  it("quotes a single sword -- base premium 100 G + 5 G fee = 105 G", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("quotes a single amulet -- base premium 60 G + 5 G fee = 65 G", () => {
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("quotes a single staff -- base premium 80 G + 5 G fee = 85 G", () => {
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("quotes a single potion -- base premium 40 G + 5 G fee = 45 G", () => {
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("quotes a single rune -- component base premium 25 G + 5 G fee = 30 G", () => {
    expect(policyBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("quotes a single moonstone -- component base premium 25 G + 5 G fee = 30 G", () => {
    expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
  });

  // --- Quote: component building block of 3 alike components ---
  it("quotes 2 runes -- base premium 50 G (no block)", () => {
    expect(policyBasePremium(runes(2))).toBe(50);
  });
  it("quotes 3 runes -- base premium 60 G (block applies)", () => {
    expect(policyBasePremium(runes(3))).toBe(60);
  });
  it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    expect(policyBasePremium(runes(4))).toBe(100);
  });
  it("quotes 7 runes -- base premium 175 G (no block at 7)", () => {
    expect(policyBasePremium(runes(7))).toBe(175);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: alike means same type)", () => {
    expect(policyBasePremium([...runes(2), { type: "moonstone" }])).toBe(75);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks by type)", () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(policyBasePremium([...runes(3), ...moonstones])).toBe(120);
  });

  // --- Quote: item-specific modifiers ---
  it("quotes a cursed sword -- 50 % curse surcharge on that item's base premium", () => {
    expect(quote(NEWCOMER, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("quotes a sword with enchantment 5 -- 30 % high-enchantment surcharge applies (threshold is inclusive)", () => {
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("quotes a sword with enchantment 4 -- no high-enchantment surcharge", () => {
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 -- both curse and high-enchantment surcharges apply", () => {
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("quotes a cursed sword and a plain amulet -- curse surcharge is 50 G (50 % of the cursed item only), 210 G before further modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    // 160 base + 50 curse = 210, + 16 first insurance (10 % of 160) + 5 fee
    expect(quote(NEWCOMER, items)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("quotes for a customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies on the policy base premium", () => {
    const loyal: Customer = { yearsWithMHPCO: 2, previousContracts: 0 };
    expect(quote(loyal, [{ type: "sword" }])).toBe(95);
  });
  it("quotes for a customer with 1 year with MHPCO -- no loyalty discount", () => {
    const newish: Customer = { yearsWithMHPCO: 1, previousContracts: 0 };
    expect(quote(newish, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a first insurance -- 10 % initial assessment surcharge on the policy base premium", () => {
    expect(quote(NEWCOMER, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a customer's second quote in the scenario -- additional 15 % follow-up contract discount", () => {
    const secondContract: Customer = { yearsWithMHPCO: 0, previousContracts: 1 };
    expect(quote(secondContract, [{ type: "sword" }])).toBe(100);
  });
  it("quotes a customer's third quote in the scenario -- follow-up contract discount applies again", () => {
    const thirdContract: Customer = { yearsWithMHPCO: 0, previousContracts: 2 };
    expect(quote(thirdContract, [{ type: "sword" }])).toBe(100);
  });

  // --- Quote: rounding in the MHPCO's favor ---
  it("rounds a fractional premium up, in the MHPCO's favor (171.25 G -> 172 G)", () => {
    const followUp: Customer = { yearsWithMHPCO: 0, previousContracts: 1 };
    // 175 base - 8.75 (10 % first insurance - 15 % follow-up) + 5 fee = 171.25
    expect(quote(followUp, runes(7))).toBe(172);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium (136.25 G -> 137 G)", () => {
    const loyalFollowUp: Customer = { yearsWithMHPCO: 5, previousContracts: 1 };
    // 175 base - 43.75 modifiers + 5 fee = 136.25; rounding the 43.75 first would give 136
    expect(quote(loyalFollowUp, runes(7))).toBe(137);
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) -- premium 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote(NEWCOMER, [sword])).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) -- premium 160 G", () => {
    const loyalSecond: Customer = { yearsWithMHPCO: 3, previousContracts: 1 };
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote(loyalSecond, [sword])).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote with an unknown item type (broomstick) -- CLI exits non-zero, error on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/broomstick/);
  });

  // --- Claim: insurance sum and cap per item type (values are independent of premiums) ---
  it("caps a sword policy at 2000 G (insurance value 1000 G x 2)", () => {
    expect(insuranceSum([{ type: "sword" }])).toBe(1000);
  });
  it("caps an amulet policy at 1200 G (insurance value 600 G x 2)", () => {
    expect(insuranceSum([{ type: "amulet" }])).toBe(600);
  });
  it("caps a staff policy at 1600 G (insurance value 800 G x 2)", () => {
    expect(insuranceSum([{ type: "staff" }])).toBe(800);
  });
  it("caps a potion policy at 800 G (insurance value 400 G x 2)", () => {
    expect(insuranceSum([{ type: "potion" }])).toBe(400);
  });
  it("caps a rune policy at 500 G (component insurance value 250 G x 2)", () => {
    expect(insuranceSum([{ type: "rune" }])).toBe(250);
  });
  it("caps a moonstone policy at 500 G (component insurance value 250 G x 2)", () => {
    expect(insuranceSum([{ type: "moonstone" }])).toBe(250);
  });
  it("caps a sword + amulet policy at 3200 G (insurance sum 1600 G)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("caps a sword + 3 runes policy at 3500 G (insurance sum 1750 G; the block discount affects the premium only)", () => {
    expect(insuranceSum([{ type: "sword" }, ...runes(3)])).toBe(1750);
  });
  it("caps a cursed sword policy at 2000 G -- premium modifiers do not raise the cap", () => {
    expect(insuranceSum([{ type: "sword", cursed: true }])).toBe(1000);
  });
  it("caps a two-sword policy at 4000 G (insurance sum 2000 G)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for 500 G damage to a regular steel sword with enchantment 3 (full reimbursement minus 100 G deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 100 G for 200 G damage to a rune (no enchantment level or material, so no special clause)", () => {
    const policy = new Policy([{ type: "rune" }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });
  it("pays out 0 G when the damage amount is below the 100 G deductible (no negative payout)", () => {
    const policy = new Policy([{ type: "sword" }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 50 }] });
    expect(result.payout).toBe(0);
  });
  it("pays out 600 G for a dragon attack damaging a sword (500 G) and an amulet (300 G) -- deductible applies once per damaged item", () => {
    const policy = new Policy([{ type: "sword" }, { type: "amulet" }]);
    const result = policy.settle({
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    });
    expect(result.payout).toBe(600);
  });
  it("treats two sword damage entries on a two-sword policy as separate damages, each with its own deductible", () => {
    const policy = new Policy([{ type: "sword" }, { type: "sword" }]);
    const result = policy.settle({
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }],
    });
    expect(result.payout).toBe(700);
  });

  // --- Claim: special clauses ---
  it("pays out 400 G for 1000 G damage to a steel sword with enchantment 9 (50 % clause first, then deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 700 G for 800 G damage to a dragon-material sword with enchantment 5 (full reimbursement, then deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = policy.settle({ cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
  it("pays out 400 G for 1000 G damage to a dragon-material sword with enchantment 9 (50 % rule wins over dragon material, then deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = policy.settle({ cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 400 G for 1000 G damage to a dragon-material sword with exactly enchantment 8 (threshold is inclusive)", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = policy.settle({ cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out 650 G for 750 G damage to a steel sword with enchantment 7 (below the 50 % threshold: full reimbursement, then deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 7 }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 750 }] });
    expect(result.payout).toBe(650);
  });

  // --- Claim: rounding in the MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    const policy = new Policy([{ type: "sword", enchantment: 9 }]);
    // 901 halved = 450.5, less the 100 G deductible = 350.5
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("reports the remaining cap after a claim -- 1500 G claim on a sword policy pays 1400 G, remaining cap 600 G", () => {
    const policy = new Policy([{ type: "sword" }]);
    const result = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap -- payout 600 G, remaining cap 0 G", () => {
    const policy = new Policy([{ type: "sword" }]);
    policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    const second = policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rejection ---
  it("rejects a claim for an item that is not part of the policy (amulet damaged when only a sword is insured) -- throws, which the CLI reports as a non-zero exit with an error on stderr", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() =>
      policy.settle({ cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim for a damage entry with an unknown item type -- throws, reported by the CLI as a non-zero exit", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() =>
      policy.settle({ cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws, reported by the CLI as a non-zero exit", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() =>
      policy.settle({
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }],
      }),
    ).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount (-200) -- throws, reported by the CLI as a non-zero exit", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() =>
      policy.settle({ cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200/);
  });

  // --- CLI adapter ---
  it("reads a scenario from stdin and writes a results array of the same length and order to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    // 60 base - 6 (10 % first insurance - 20 % loyalty) + 5 fee = 59
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }] });
  });
  it("resolves a claim step's policy field to the zero-based index of the earlier quote step", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
