import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateBasePremium, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price-list base premiums and insurance values for sword, amulet, staff, potion, and components", () => {
    expect(calculateBasePremium([
      { type: "sword" }, { type: "amulet" }, { type: "staff" },
      { type: "potion" }, { type: "rune" }, { type: "moonstone" },
    ])).toBe(330);
  });
  it("prices alike component counts 2, 3, 4, and 7 at 50, 60, 100, and 175 G", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    expect([2, 3, 4, 7].map((count) => calculateBasePremium(runes(count))))
      .toEqual([50, 60, 100, 175]);
  });
  it("treats component types separately: 2 runes plus 1 moonstone costs 75 G, while two separate triples cost 120 G", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
    expect(calculateBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(120);
  });
  it("scopes curse and enchantment surcharges to affected items and applies exact enchantment threshold 5", () => {
    const quote = (items: object[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0].premium;
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }, { type: "amulet" }])).toBe(231);
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("applies the 20% loyalty discount at exactly 2 years, but not below the threshold", () => {
    const premium = (yearsWithMHPCO: number) => runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results[0].premium;
    expect(premium(1)).toBe(115);
    expect(premium(2)).toBe(95);
  });
  it("rounds only the final premium upward: 197.5 G becomes 198 G", () => {
    const items = [
      { type: "sword" },
      { type: "rune", enchantment: 5 },
      { type: "moonstone", cursed: true, enchantment: 5 },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0].premium).toBe(198);
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's cursed enchanted sword on their second contract at 160 G, including per-item initial assessment", () => {
    const scenario = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(scenario.results[1].premium).toBe(160);
  });
  it("reimburses ordinary sword damage 500 at 400 G and rune damage 200 at 100 G after per-event deductibles", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 500, remainingCap: 2000 });
  });
  it("applies enchantment 8+ at 50% even for dragon material, otherwise reimburses dragon material fully, and rounds payout down", () => {
    const claim = (item: object, amount: number) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ] }).results[1].payout;
    expect(claim({ type: "sword", material: "dragon", enchantment: 8 }, 1000)).toBe(400);
    expect(claim({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
    expect(claim({ type: "sword", material: "steel", enchantment: 9 }, 901)).toBe(350);
  });
  it("applies a separate 100 G deductible to sword 500 and amulet 300 damages for a total payout of 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result.results[1].payout).toBe(600);
  });
  it("supports duplicate insured item types with separate damages and rejects damage multiplicity beyond insured count", () => {
    const scenario = (items: object[], damages: object[]) => ({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "attack", damages } },
    ] });
    expect(runScenario(scenario([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }])).results[1].payout).toBe(600);
    expect(() => runScenario(scenario([{ type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }]))).toThrow("Damage item is not covered by policy: sword");
  });
  it("bases the cap on twice unmodified insurance values, including mixed items and component blocks", () => {
    const cap = (items: object[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results[1].remainingCap;
    expect(cap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    expect(cap([{ type: "sword", cursed: true }])).toBe(2000);
    expect(cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
  });
  it("exhausts a sword policy cap across successive 1500 G claims with payouts 1400 then 600 and remaining cap 0", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects an unknown quoted item type", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }))
      .toThrow("Unknown item type: broomstick");
  });
  it("rejects absent or unknown damaged items and negative damage amounts", () => {
    const invalidClaim = (damage: { itemType: string; amount: number }) => () => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [damage] } },
    ] });
    expect(invalidClaim({ itemType: "amulet", amount: 200 })).toThrow("Damage item is not covered by policy: amulet");
    expect(invalidClaim({ itemType: "broomstick", amount: 200 })).toThrow("Damage item is not covered by policy: broomstick");
    expect(invalidClaim({ itemType: "sword", amount: -200 })).toThrow("Damage amount cannot be negative");
  });
  it("exposes a stdin/stdout CLI producing ordered quote and claim result objects and reports errors only on stderr with non-zero status", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });

    const failure = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }),
      encoding: "utf8",
    });
    expect(failure.status).not.toBe(0);
    expect(failure.stdout).toBe("");
    expect(failure.stderr).toContain("Unknown item type: broomstick");
  });
});
