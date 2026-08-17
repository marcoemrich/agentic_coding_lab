import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { claim, quote, type Item, type Policy } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes sword, amulet, staff, and potion price-list values -- premiums 105, 65, 85, and 45 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }], 0, -1).premium)).toEqual([105, 65, 85, 45]);
  });
  it("quotes 2 runes -- 55 G including processing fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], 0, -1).premium).toBe(55);
  });
  it("quotes exactly 3 runes as a building block -- 65 G including fee", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })), 0, -1).premium).toBe(65);
  });
  it("quotes 4 runes without a block -- 105 G including fee", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })), 0, -1).premium).toBe(105);
  });
  it("quotes 7 runes without a block -- 180 G including fee", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), 0, -1).premium).toBe(180);
  });
  it("does not combine 2 runes and 1 moonstone into a block -- 80 G including fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, -1).premium).toBe(80);
  });
  it("quotes 3 runes and 3 moonstones as two blocks -- 125 G including fee", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items, 0, -1).premium).toBe(125);
  });
  it("scopes a cursed surcharge to the cursed sword in a sword-and-amulet policy -- 215 G including fee", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }], 0, -1).premium).toBe(215);
  });
  it("applies loyalty at exactly 2 years -- plain sword premium 85 G", () => {
    expect(quote([{ type: "sword" }], 2, -1).premium).toBe(85);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5 -- sword premium 185 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }], 0, -1).premium).toBe(185);
  });
  it("does not apply high-enchantment surcharge at enchantment 4 -- cursed sword premium 155 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }], 0, -1).premium).toBe(155);
  });
  it("quotes an empty item list -- processing fee only, 5 G", () => {
    expect(quote([], 0, -1).premium).toBe(5);
  });
  it("quotes a newcomer's cursed sword with first-insurance surcharge -- 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 3 }], 0, 0).premium).toBe(165);
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract -- 160 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 7 }], 3, 1).premium).toBe(160);
  });
  it("reimburses a regular steel enchantment-3 sword damage of 500 G -- payout 400 G", () => {
    const policy = quote([{ type: "sword", material: "steel", enchantment: 3 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
  });
  it("reimburses rune damage of 200 G -- payout 100 G", () => {
    const policy = quote([{ type: "rune" }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });
  it("applies one deductible to each of sword 500 G and amulet 300 G damages -- payout 600 G", () => {
    const policy = quote([{ type: "sword" }, { type: "amulet" }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).payout).toBe(600);
  });
  it("applies enchantment-8 reimbursement before deductible despite dragon material -- payout 400 G", () => {
    const policy = quote([{ type: "sword", material: "dragon", enchantment: 8 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("applies enchantment-9 reimbursement before deductible despite dragon material -- payout 400 G", () => {
    const policy = quote([{ type: "sword", material: "dragon", enchantment: 9 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("fully reimburses dragon-material enchantment-5 sword before deductible -- payout 700 G", () => {
    const policy = quote([{ type: "sword", material: "dragon", enchantment: 5 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("halves steel enchantment-9 sword damage before deductible -- payout 400 G", () => {
    const policy = quote([{ type: "sword", material: "steel", enchantment: 9 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("insures two swords separately -- insurance sum 2000 G and remaining cap 3600 G after a 500 G claim", () => {
    const policy = quote([{ type: "sword" }, { type: "sword" }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("treats two sword damage entries as separate events -- payout 800 G", () => {
    const policy = quote([{ type: "sword" }, { type: "sword" }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).payout).toBe(800);
  });
  it("rejects the whole claim with an Error when sword damages outnumber insured swords", () => {
    const policy = quote([{ type: "sword" }], 0, -1).policy;
    expect(() => claim(policy, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toThrow(Error);
  });
  it("caps a sword-and-amulet policy from the 1600 G insurance sum -- remaining cap 2800 G after payout 400 G", () => {
    const policy = quote([{ type: "sword" }, { type: "amulet" }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(2800);
  });
  it("bases a cursed sword cap on unmodified 1000 G value -- remaining cap 1600 G after payout 400 G", () => {
    const policy = quote([{ type: "sword", cursed: true }], 0, 0).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(1600);
  });
  it("bases sword-and-3-rune cap on 1750 G insurance sum despite block pricing -- remaining cap 3100 G", () => {
    const policy = quote([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(3100);
  });
  it("exhausts a sword policy cap across two 1500 G claims -- payouts 1400 then 600 G, remaining 0 G", () => {
    const policy = quote([{ type: "sword" }], 0, -1).policy;
    const first = claim(policy, [{ itemType: "sword", amount: 1500 }]);
    const second = claim(policy, [{ itemType: "sword", amount: 1500 }]);
    expect([first.payout, first.remainingCap, second.payout, second.remainingCap]).toEqual([1400, 600, 600, 0]);
  });
  it("rounds a 197.5 G premium up in MHPCO's favor -- 198 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }, { type: "rune", enchantment: 5 }];
    expect(quote(items, 0, -1).premium).toBe(198);
  });
  it("rounds a 350.5 G payout down in MHPCO's favor -- 350 G", () => {
    const policy = quote([{ type: "sword", enchantment: 8 }], 0, -1).policy;
    expect(claim(policy, [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("keeps fractional intermediate premium amounts until final rounding -- 198 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }, { type: "rune", enchantment: 5 }];
    expect(quote(items, 0, -1).premium).toBe(198);
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to an uninsured or unknown item with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("not covered");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("uses staff and potion insurance values -- policy caps 1600 G and 800 G", () => {
    expect([quote([{ type: "staff" }], 0, -1).policy.remainingCap, quote([{ type: "potion" }], 0, -1).policy.remainingCap]).toEqual([1600, 800]);
  });
  it("CLI processes sequential quote and claim steps -- premium 59 G, payout 100 G, remaining cap 1100 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
  it("exposes the claim-office executable -- empty quote returns premium 5 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
    const result = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
