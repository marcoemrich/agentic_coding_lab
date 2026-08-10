import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const run = (steps: Scenario["steps"], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps });
const quote = (items: Item[], yearsWithMHPCO = 0) => run([{ op: "quote", items }], yearsWithMHPCO);
const claim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) =>
  run([{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "incident", damages } }]);
const premium = (items: Item[], years = 0) => (quote(items, years).results[0] as { premium: number }).premium;

const item = (type: Item["type"], fields: Partial<Item> = {}): Item => ({ type, ...fields });

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G", () => expect(premium([])).toBe(5));
  it("uses all main-item prices", () => expect(premium([item("sword"), item("amulet"), item("staff"), item("potion")])).toBe(313));
  it("quotes 2 runes at 60 G", () => expect(premium([item("rune"), item("rune")])).toBe(60));
  it("quotes exactly 3 runes at 71 G", () => expect(premium(Array.from({ length: 3 }, () => item("rune")))).toBe(71));
  it("quotes 4 runes at 115 G", () => expect(premium(Array.from({ length: 4 }, () => item("rune")))).toBe(115));
  it("quotes 7 runes at 198 G", () => expect(premium(Array.from({ length: 7 }, () => item("rune")))).toBe(198));
  it("does not combine unlike components into a block", () => expect(premium([item("rune"), item("rune"), item("moonstone")])).toBe(88));
  it("prices two separate component blocks", () => expect(premium([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toBe(137));
  it("scopes curse to the affected item", () => expect(premium([item("sword", { cursed: true }), item("amulet")])).toBe(231));
  it("applies loyalty at exactly 2 years", () => expect(premium([item("sword")], 2)).toBe(95));
  it("stacks curse and enchantment at level 5", () => expect(premium([item("sword", { cursed: true, enchantment: 5 })])).toBe(195));
  it("does not apply enchantment surcharge at level 4", () => expect(premium([item("sword", { cursed: true, enchantment: 4 })])).toBe(165));
  it("applies first-insurance assessment", () => expect(premium([item("sword")])).toBe(115));
  it("quotes newcomer cursed sword at 165 G", () => expect(premium([item("sword", { cursed: true, enchantment: 3 })])).toBe(165));
  it("discounts a follow-up contract", () => expect(run([{ op: "quote", items: [] }, { op: "quote", items: [item("sword")] }]).results[1]).toEqual({ premium: 100 }));
  it("quotes long-standing second-contract example at 160 G", () => expect(run([{ op: "quote", items: [] }, { op: "quote", items: [item("sword", { cursed: true, enchantment: 7 })] }], 3).results[1]).toEqual({ premium: 160 }));
  it("halves enchantment 8 damage before deductible", () => expect(claim([item("sword", { material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("applies deductible per damaged item", () => expect(claim([item("sword"), item("amulet")], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).results[1]).toEqual({ payout: 600, remainingCap: 2600 }));
  it("reimburses standard sword damage", () => expect(claim([item("sword", { material: "steel", enchantment: 3 })], [{ itemType: "sword", amount: 500 }]).results[1]).toMatchObject({ payout: 400 }));
  it("reimburses rune damage", () => expect(claim([item("rune")], [{ itemType: "rune", amount: 200 }]).results[1]).toMatchObject({ payout: 100 }));
  it("lets enchantment rule win over dragon", () => expect(claim([item("sword", { material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toMatchObject({ payout: 400 }));
  it("fully reimburses dragon below level 8", () => expect(claim([item("sword", { material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }]).results[1]).toMatchObject({ payout: 700 }));
  it("halves steel level 9 damage", () => expect(claim([item("sword", { material: "steel", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toMatchObject({ payout: 400 }));
  it("counts duplicate items in cap", () => expect(claim([item("sword"), item("sword")], [{ itemType: "sword", amount: 100 }]).results[1]).toEqual({ payout: 0, remainingCap: 4000 }));
  it("deducts separately for two same-type damages", () => expect(claim([item("sword"), item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).results[1]).toMatchObject({ payout: 800 }));
  it("rejects excess same-type damages", () => expect(() => claim([item("sword")], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])).toThrow(/not covered/));
  it("caps sword and amulet at 3200 G", () => expect(claim([item("sword"), item("amulet")], [{ itemType: "sword", amount: 2000 }, { itemType: "amulet", amount: 2000 }]).results[1]).toEqual({ payout: 3200, remainingCap: 0 }));
  it("bases cursed sword cap on value", () => expect(claim([item("sword", { cursed: true })], [{ itemType: "sword", amount: 3000 }]).results[1]).toEqual({ payout: 2000, remainingCap: 0 }));
  it("does not apply block discount to insurance sum", () => expect(claim([item("sword"), ...Array.from({ length: 3 }, () => item("rune"))], [{ itemType: "sword", amount: 100 }]).results[1]).toEqual({ payout: 0, remainingCap: 3500 }));
  it("exhausts cap over successive claims", () => expect(run([{ op: "quote", items: [item("sword")] }, { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } }]).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]));
  it("rounds 197.5 premium up", () => expect(premium(Array.from({ length: 7 }, () => item("rune")))).toBe(198));
  it("rounds 350.5 payout down", () => expect(claim([item("sword", { enchantment: 8 })], [{ itemType: "sword", amount: 901 }]).results[1]).toMatchObject({ payout: 350 }));
  it("rejects unknown quote type", () => expect(() => quote([{ type: "broomstick" } as unknown as Item])).toThrow(/Unknown/));
  it("rejects an uninsured known item", () => expect(() => claim([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow(/not covered/));
  it("rejects unknown claim type", () => expect(() => claim([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow(/Unknown/));
  it("rejects negative damage", () => expect(() => claim([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow(/negative/));
  it("uses zero-based step policy index and ordered results", () => expect(run([{ op: "quote", items: [] }, { op: "quote", items: [item("amulet")] }, { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }]).results).toEqual([{ premium: 5 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }]));
  it("CLI reads stdin and writes JSON", () => {
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }), encoding: "utf8" });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("CLI writes errors to stderr without stdout results", () => {
    expect(() => execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }), encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })).toThrow(expect.objectContaining({ stdout: "" }));
  });
});
