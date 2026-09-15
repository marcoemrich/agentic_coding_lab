import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes Sword, Amulet, Staff, and Potion base premiums as 100, 60, 80, and 40 G before modifiers", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0]);
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes one component at 25 G base premium and insures it for 250 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 2 runes at 50 G base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the special 60 G base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G base premium because a block requires exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base premium because only an exact group of 3 is a block", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 75 G base premium because alike means the same type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones at 120 G base premium as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the affected item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both 50% curse and 30% high-enchantment surcharges at enchantment exactly 5", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply the high-enchantment surcharge at enchantment 4, while still applying curse when present", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer's first cursed sword contract at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract for a cursed enchantment-7 sword at 160 G, including per-quote first-insurance surcharge and follow-up discount", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a final premium of 197.5 G up to 198 G while retaining fractional intermediates", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("pays 400 G for 500 G damage to a regular steel enchantment-3 sword after one 100 G deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never))
      .toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for 200 G damage to an insured rune after one 100 G deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never))
      .toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("pays 400 G for 1000 G damage to a dragon-material enchantment-8 sword because the 50% clause wins before deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G damage to a dragon-material enchantment-9 sword because high enchantment wins over dragon material", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon-material enchantment-5 sword using full reimbursement before deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel enchantment-9 sword using 50% reimbursement before deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when one incident damages a sword by 500 G and an amulet by 300 G, applying a deductible to each damage entry", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("gives a two-sword policy a 2000 G insurance sum and 4000 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles when two swords are insured", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim through the CLI with non-zero status and stderr when damage entries outnumber insured items of that type; chosen description includes 'Damage quantity exceeds policy coverage'", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    const cli = runCli(scenario);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toContain("Damage quantity exceeds policy coverage");
    expect(cli.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap from its 1600 G insurance sum", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("gives a cursed sword a 2000 G cap based on unmodified 1000 G insurance value", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-runes policy a 3500 G cap from a 1750 G insurance sum despite the premium block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits two successive 1500 G sword claims to payouts of 1400 then 600 G, leaving caps of 600 then 0 G", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a final payout of 350.5 G down to 350 G while retaining fractional intermediates", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as never).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item type through the CLI with non-zero status, stderr, and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] };
    const cli = runCli(scenario);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("rejects a claim for an item not covered by the policy through the CLI with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = runCli(scenario);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("rejects a negative damage amount through the CLI with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = runCli(scenario);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("exposes src/cli.ts as a stdin/stdout JSON CLI preserving sequential result order and binding output field names", () => {
    const scenario = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = runCli(scenario);
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
