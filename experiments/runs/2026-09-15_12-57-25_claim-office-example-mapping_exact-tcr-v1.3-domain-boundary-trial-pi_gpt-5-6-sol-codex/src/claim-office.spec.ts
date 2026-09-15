import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliResult {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function scenario(yearsWithMHPCO: number, steps: unknown[]): unknown {
  return { customer: { yearsWithMHPCO }, steps };
}

function quote(items: unknown[]): unknown {
  return { op: "quote", items };
}

function claim(policy: number, damages: unknown[], cause = "accident"): unknown {
  return { op: "claim", policy, incident: { cause, damages } };
}

function outputOf(input: unknown): unknown {
  return JSON.parse(runCli(input).stdout);
}

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(outputOf(scenario(0, [quote([])]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword from the 100 G price-list base at 115 G", () => {
    expect(outputOf(scenario(0, [quote([{ type: "sword" }])]))).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes a plain amulet from the 60 G price-list base at 71 G", () => {
    expect(outputOf(scenario(0, [quote([{ type: "amulet" }])]))).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("quotes a plain staff from the 80 G price-list base at 93 G", () => {
    expect(outputOf(scenario(0, [quote([{ type: "staff" }])]))).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion from the 40 G price-list base at 49 G", () => {
    expect(outputOf(scenario(0, [quote([{ type: "potion" }])]))).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes one rune from the 25 G component base at 33 G", () => {
    expect(outputOf(scenario(0, [quote([{ type: "rune" }])]))).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 2 runes with a 50 G base at 60 G", () => {
    const runes = [{ type: "rune" }, { type: "rune" }];
    expect(outputOf(scenario(0, [quote(runes)]))).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as a 60 G block base at 71 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(outputOf(scenario(0, [quote(runes)]))).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at a 100 G base, totaling 115 G", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(outputOf(scenario(0, [quote(runes)]))).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at a 175 G base, totaling 198 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(outputOf(scenario(0, [quote(runes)]))).toEqual({ results: [{ premium: 198 }] });
  });
  it("treats component types as unlike: 2 runes plus 1 moonstone has a 75 G base and totals 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(outputOf(scenario(0, [quote(items)]))).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices separate alike blocks: 3 runes plus 3 moonstones has a 120 G base and totals 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(outputOf(scenario(0, [quote(items)]))).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a cursed surcharge to its item: cursed sword plus plain amulet is 210 G before policy modifiers and 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(outputOf(scenario(0, [quote(items)]))).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword totals 95 G", () => {
    expect(outputOf(scenario(2, [quote([{ type: "sword" }])]))).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharge at enchantment 5: a cursed sword totals 195 G", () => {
    const sword = { type: "sword", cursed: true, enchantment: 5 };
    expect(outputOf(scenario(0, [quote([sword])]))).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but still applies curse: a cursed sword totals 165 G", () => {
    const sword = { type: "sword", cursed: true, enchantment: 4 };
    expect(outputOf(scenario(0, [quote([sword])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(outputOf(scenario(0, [quote([sword])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies first-insurance per item and follow-up discount on a long-standing customer's second quote: cursed enchantment-7 sword is 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(outputOf(scenario(3, [quote([]), quote([sword])]))).toEqual({
      results: [{ premium: 5 }, { premium: 160 }],
    });
  });
  it("rounds a 197.5 G premium up to 198 G in MHPCO's favor", () => {
    const items = [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }];
    expect(outputOf(scenario(0, [quote([]), quote(items)]))).toEqual({
      results: [{ premium: 5 }, { premium: 198 }],
    });
  });
  it("processes regular sword damage of 500 G as a 400 G payout with 1600 G cap remaining", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 500 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("processes rune damage of 200 G as a 100 G payout with 400 G cap remaining", () => {
    const steps = [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("applies the enchantment-8 half reimbursement before deductible to dragon sword damage of 1000 G: payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("lets the half-reimbursement rule win for enchantment-9 dragon sword damage of 1000 G: payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("fully reimburses enchantment-5 dragon sword damage of 800 G before deductible: payout 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 800 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("half reimburses enchantment-9 steel sword damage of 1000 G before deductible: payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("applies one deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [quote(items), claim(0, damages, "dragon attack")];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("insures two swords for 2000 G and reports a 4000 G cap", () => {
    const steps = [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("does not apply the exact-three component block to 3 swords: premium is 335 G", () => {
    const swords = Array.from({ length: 3 }, () => ({ type: "sword" }));
    expect(outputOf(scenario(0, [quote(swords)]))).toEqual({ results: [{ premium: 335 }] });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [quote(swords), claim(0, damages, "dragon attack")];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("rejects the whole claim with non-zero status and stderr when sword damages outnumber insured swords", () => {
    const damages = [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }];
    const result = runCli(scenario(0, [quote([{ type: "sword" }]), claim(0, damages)]));
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const steps = [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("caps a cursed sword policy at 2000 G from unmodified insurance value, not premium", () => {
    const steps = [quote([{ type: "sword", cursed: true }]), claim(0, [])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("values a sword and 3-rune block at 1750 G insurance sum and a 3500 G cap", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [quote(items), claim(0, [])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("tracks cap exhaustion: successive 1500 G sword claims pay 1400 G then 600 G, leaving zero", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    const steps = [quote([{ type: "sword" }]), claim(0, damage), claim(0, damage)];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }],
    });
  });
  it("rounds a raw payout of 350.5 G down to 350 G in MHPCO's favor", () => {
    const sword = { type: "sword", enchantment: 8 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 901 }])];
    expect(outputOf(scenario(0, steps))).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("rejects an unknown quoted item with non-zero status, stderr, and no stdout results", () => {
    const result = runCli(scenario(0, [quote([{ type: "broomstick" }])]));
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an item type absent from the policy with non-zero status and stderr", () => {
    const result = runCli(scenario(0, [quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 200 }])]));
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects an unknown damaged item type with non-zero status and stderr", () => {
    const result = runCli(scenario(0, [quote([{ type: "sword" }]), claim(0, [{ itemType: "broomstick", amount: 200 }])]));
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects negative damage with non-zero status and stderr", () => {
    const result = runCli(scenario(0, [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])]));
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("emits quote and claim results in step order using the normative JSON field names", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    const steps = [quote([amulet]), claim(0, [{ itemType: "amulet", amount: 200 }], "fire")];
    expect(outputOf(scenario(5, steps))).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
