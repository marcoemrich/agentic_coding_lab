import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function premiumOf(scenario: Parameters<typeof runScenario>[0]): number {
  const result = runScenario(scenario).results[0];
  if (!("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list with initial assessment: sword 115 G, amulet 71 G, staff 93 G, and potion 49 G", () => {
    const premiumFor = (type: string): number => premiumOf({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }],
    });
    expect(premiumFor("sword")).toBe(115);
    expect(premiumFor("amulet")).toBe(71);
    expect(premiumFor("staff")).toBe(93);
    expect(premiumFor("potion")).toBe(49);
  });
  it("quotes ordinary component quantities with assessment and fee: 2 runes at 60 G, 4 at 115 G, and 7 at 198 G", () => {
    const premiumFor = (count: number): number => premiumOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
    });
    expect(premiumFor(2)).toBe(60);
    expect(premiumFor(4)).toBe(115);
    expect(premiumFor(7)).toBe(198);
  });
  it("quotes exactly 3 alike runes at 71 G after assessment and fee", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: runes }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("treats component types separately: 2 runes + 1 moonstone is 88 G and 3 + 3 is 137 G", () => {
    const quote = (types: string[]): number => premiumOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    });
    expect(quote(["rune", "rune", "moonstone"])).toBe(88);
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G with first-insurance surcharge and fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies enchantment at exactly 5, not 4, and stacks it with a curse", () => {
    const quote = (enchantment: number, cursed: boolean): number => premiumOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment, cursed }] }],
    });
    expect(quote(5, true)).toBe(195);
    expect(quote(4, true)).toBe(165);
    expect(quote(5, false)).toBe(145);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    const quote = (yearsWithMHPCO: number): number => premiumOf({
      customer: { yearsWithMHPCO },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(quote(2)).toBe(95);
    expect(quote(1)).toBe(115);
  });
  it("quotes a newcomer's cursed sword at 165 G", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays standard damage less one deductible: sword 500 -> 400 and rune 200 -> 100", () => {
    const claim = (item: { type: string; enchantment?: number; material?: string }, amount: number) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: item.type, amount }] } },
      ],
    }).results[1];
    expect(claim({ type: "sword", material: "steel", enchantment: 3 }, 500)).toMatchObject({ payout: 400 });
    expect(claim({ type: "rune" }, 200)).toMatchObject({ payout: 100 });
  });
  it("pays 400 G for dragon sword enchantment 8 damaged by 1000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    }).results[1];
    expect(result).toMatchObject({ payout: 400 });
  });
  it("resolves enchantment versus material: dragon enchantment 9 -> 400, dragon enchantment 5 -> 700, steel enchantment 9 -> 400", () => {
    const payout = (material: string, enchantment: number, amount: number): number => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material, enchantment }] },
          { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
        ],
      }).results[1];
      if (!("payout" in result)) throw new Error("Expected claim result");
      return result.payout;
    };
    expect(payout("dragon", 9, 1000)).toBe(400);
    expect(payout("dragon", 5, 800)).toBe(700);
    expect(payout("steel", 9, 1000)).toBe(400);
  });
  it("applies a deductible per damaged item: sword 500 plus amulet 300 -> 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    }).results[1];
    expect(result).toMatchObject({ payout: 600 });
  });
  it("covers two same-type items independently and starts with a 4000 G cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    }).results[1];
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when same-type damages outnumber insured same-type items", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [
          { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
        ] } },
      ],
    })).toThrow();
  });
  it("bases caps on unmodified item values and component counts, not premium modifiers or block discounts", () => {
    const cap = (items: Array<{ type: string; cursed?: boolean }>): number => {
      const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ] }).results[1];
      if (!("remainingCap" in result)) throw new Error("Expected claim result");
      return result.remainingCap;
    };
    expect(cap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    expect(cap([{ type: "sword", cursed: true }])).toBe(2000);
    expect(cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
  });
  it("exhausts a sword policy cap across claims: 1400 G then 600 G, leaving zero", () => {
    const damage = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: damage },
      { op: "claim", policy: 0, incident: damage },
    ] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("rounds a fractional premium of 197.5 G up to 198 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(premiumOf({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: runes }] })).toBe(198);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1];
    expect(result).toMatchObject({ payout: 350 });
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const execution = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "broomstick" }] },
      ] }),
      encoding: "utf8",
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
  it("CLI rejects an uninsured or unknown damaged item with non-zero status and stderr", () => {
    const executeDamage = (itemType: string) => spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] }),
      encoding: "utf8",
    });
    for (const itemType of ["amulet", "broomstick"]) {
      const execution = executeDamage(itemType);
      expect(execution.status).not.toBe(0);
      expect(execution.stderr.length).toBeGreaterThan(0);
      expect(execution.stdout).toBe("");
    }
  });
  it("CLI rejects a negative damage amount with non-zero status and stderr", () => {
    const execution = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
      ] }),
      encoding: "utf8",
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
});
