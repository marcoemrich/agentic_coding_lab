import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { policyBasePremium, quote } from "./claim-office.js";
import { policyCap, settleClaim } from "./claim-settlement.js";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));
const execFileAsync = promisify(execFile);

interface CliResult {
  status: number;
  stdout: string;
  stderr: string;
}

async function runCli(scenario: unknown): Promise<CliResult> {
  const child = execFileAsync("npx", ["tsx", CLI]);
  child.child.stdin?.end(JSON.stringify(scenario));
  try {
    const { stdout, stderr } = await child;
    return { status: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string };
    return {
      status: failure.code ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("MHPCO claim office", () => {
  // --- Base premiums per item type (spec price list) ---
  it("prices an empty item list as base premium 0 G", () => {
    expect(policyBasePremium([])).toBe(0);
  });
  it("prices a single sword as base premium 100 G", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("prices a single amulet as base premium 60 G", () => {
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("prices a single staff as base premium 80 G", () => {
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("prices a single potion as base premium 40 G", () => {
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("prices a single rune as base premium 25 G", () => {
    expect(policyBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("prices a single moonstone as base premium 25 G", () => {
    expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("prices a sword and an amulet as policy base premium 160 G", () => {
    expect(policyBasePremium([{ type: "sword" }, { type: "amulet" }])).toBe(160);
  });

  // --- Building block of 3 alike components ---
  it("prices 2 runes as base premium 50 G (no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices 3 runes as base premium 60 G (block applies)", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(60);
  });
  it("prices 4 runes as base premium 100 G (no block; block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(100);
  });
  it("prices 7 runes as base premium 175 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(175);
  });
  it("prices 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(policyBasePremium(items)).toBe(75);
  });
  it("prices 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(policyBasePremium(items)).toBe(120);
  });

  // --- Quote assembly ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge on the cursed item's base premium: cursed sword, 0 years, no prior contract -- premium 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5: sword enchantment 5 -- premium 145 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4: sword enchantment 4 -- premium 115 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- premium 195 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet -- base 160 G, curse adds 50 G -- 210 G before further modifiers, premium 231 G", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO -- sword premium 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge to each item in a quote regardless of customer history -- plain sword 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up-contract discount to each contract after the customer's first quote in the scenario -- second quote of a plain sword, 0 years, premium 100 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies no follow-up-contract discount to the customer's first quote in the scenario -- plain sword premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });

  // --- Rounding in the MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favor)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "rune", enchantment: 5, cursed: false },
      { type: "rune", enchantment: 5, cursed: true },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(198);
  });
  it("keeps intermediate premium amounts as fractions and rounds only the final premium -- 3 runes, one cursed, premium 84 G not 85 G", () => {
    // Base 60 (block of 3) + curse surcharge 12.5 (50 % of the rune's own
    // 25 G basis) + first insurance 6 = 78.5 + 5 fee = 83.5 -> 84 G.
    // Rounding the 12.5 surcharge up first would wrongly yield 85 G.
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune", cursed: true },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(84);
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, no prior contract) as premium 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) as premium 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(160);
  });

  // --- Insurance sum and cap ---
  it("caps a policy covering a sword at 2000 G (2 x insurance sum 1000 G)", () => {
    expect(policyCap([{ type: "sword" }])).toBe(2000);
  });
  it("caps a policy covering a sword and an amulet at 3200 G (2 x insurance sum 1600 G)", () => {
    expect(policyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
  });
  it("caps a policy covering two swords at 4000 G (2 x insurance sum 2000 G)", () => {
    expect(policyCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("caps a policy covering a sword and 3 runes at 3500 G (insurance sum 1750 G; block discount affects premium only)", () => {
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(policyCap(items)).toBe(3500);
  });
  it("caps a cursed sword policy at 2000 G based on the unmodified insurance value, though its premium is 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
    expect(policyCap([cursedSword])).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword (enchantment 3) damaged by 500 G (full reimbursement minus 100 G deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(400);
  });
  it("pays out 100 G for a rune damaged by 200 G (no enchantment level or material, so no special clause)", () => {
    const rune = { type: "rune" };
    const damages = [{ itemType: "rune", amount: 200 }];
    expect(settleClaim([rune], damages, policyCap([rune])).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -- payout 600 G", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(settleClaim(items, damages, policyCap(items)).payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses damage at 50 % for enchantment exactly 8: dragon sword, damage 1000 G -- payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8, cursed: false };
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(400);
  });
  it("reimburses steel sword enchantment 9 damaged by 1000 G at 50 % then deductible -- payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(400);
  });
  it("reimburses dragon-material sword enchantment 5 damaged by 800 G fully then deductible -- payout 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5, cursed: false };
    const damages = [{ itemType: "sword", amount: 800 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(700);
  });
  it("lets the 50 % rule win for dragon-material sword enchantment 9 damaged by 1000 G -- payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9, cursed: false };
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(400);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays out 1400 G and reports remainingCap 600 G for a first 1500 G claim on a sword policy (cap 2000 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damages = [{ itemType: "sword", amount: 1500 }];
    expect(settleClaim([sword], damages, policyCap([sword]))).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const damages = [{ itemType: "sword", amount: 1500 }];
    const first = settleClaim([sword], damages, policyCap([sword]));
    expect(settleClaim([sword], damages, first.remainingCap)).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- Claim: multiple items of the same type ---
  it("treats each damage entry of the same item type as a separate damage with its own deductible: two sword damages of 500 G on a two-sword policy -- payout 800 G", () => {
    const swords = Array.from({ length: 2 }, () => ({
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    }));
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(settleClaim(swords, damages, policyCap(swords)).payout).toBe(800);
  });

  // --- Rounding of payouts ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    // 50 % of 901 G = 450.5 G, less the 100 G deductible = 350.5 G.
    const sword = { type: "sword", material: "steel", enchantment: 8, cursed: false };
    const damages = [{ itemType: "sword", amount: 901 }];
    expect(settleClaim([sword], damages, policyCap([sword])).payout).toBe(350);
  });

  // --- CLI contract: success ---
  it("CLI reads a scenario from stdin and writes results in step order to stdout, exiting with status 0", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    };
    const { status, stdout } = await runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout).results).toHaveLength(2);
  });
  it("CLI writes a quote result as {premium} and a claim result as {payout, remainingCap}", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout } = await runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  // --- CLI contract: rejections (non-zero exit, error description on stderr, no results on stdout) ---
  it("CLI exits non-zero and writes an error to stderr when a quote item has an unknown type (e.g. broomstick), writing no results to stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { status, stdout, stderr } = await runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("CLI exits non-zero and writes an error to stderr when a claim damages an item not covered by the policy (e.g. amulet damaged when only a sword is insured)", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout, stderr } = await runCli(scenario);
    expect(status).not.toBe(0);
    // The office refuses the claim; it does not crash on it.
    expect(stderr).toContain("amulet");
    expect(stderr).not.toContain("TypeError");
    expect(stdout).toBe("");
  });
  it("CLI exits non-zero and writes an error to stderr when a claim damages an item with an unknown type", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };
    const { status, stdout, stderr } = await runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stderr).not.toContain("TypeError");
    expect(stdout).toBe("");
  });
  it("CLI exits non-zero and writes an error to stderr when a claim has more damage entries of a type than the policy covers (two sword damages, one sword insured)", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    const { status, stdout, stderr } = await runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).toContain("sword");
    expect(stdout).toBe("");
  });
  it("CLI exits non-zero and writes an error to stderr when a claim damage entry has a negative amount (-200)", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const { status, stdout, stderr } = await runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
});
