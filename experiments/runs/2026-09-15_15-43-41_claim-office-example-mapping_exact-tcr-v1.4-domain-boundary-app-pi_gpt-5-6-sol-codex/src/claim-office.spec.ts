import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, and potion 40 G base premiums", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: ["sword", "amulet", "staff", "potion"].map((type) => ({ type })) }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 313 }] });
  });
  it("prices ordinary components at 25 G each: 2 runes at 50 G, 4 at 100 G, and 7 at 175 G before fee", () => {
    const premiumFor = (count: number) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
    }).results[0];
    expect([premiumFor(2), premiumFor(4), premiumFor(7)]).toEqual([
      { premium: 60 }, { premium: 115 }, { premium: 198 },
    ]);
  });
  it("prices exactly 3 alike runes as one 60 G building block before fee", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: runes }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("groups components by exact type: 2 runes plus 1 moonstone is 75 G, while 3 of each is 120 G before fee", () => {
    const quote = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    }).results[0];
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ premium: 88 });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"]))
      .toEqual({ premium: 137 });
  });
  it("applies a curse surcharge only to its item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies high enchantment at exactly level 5, combines it with curse, and does not apply it at level 4", () => {
    const quoteSword = (enchantment: number, cursed: boolean) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment, cursed }] }],
    }).results[0];
    expect([quoteSword(5, true), quoteSword(5, false), quoteSword(4, true)]).toEqual([
      { premium: 195 }, { premium: 145 }, { premium: 165 },
    ]);
  });
  it("quotes a newcomer's first cursed sword policy at 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a 3-year customer's second contract for a new cursed level-7 sword at 160 G, retaining first-insurance surcharge and adding follow-up discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("keeps fractional premium intermediates and rounds 197.5 G up to 198 G", () => {
    const items = [
      { type: "sword", cursed: true, enchantment: 5 },
      { type: "rune" },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("reimburses ordinary sword damage of 500 G at 400 G after deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("reimburses rune damage of 200 G at 100 G without item special clauses", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the level-8 enchantment clause before deductible to pay 400 G on 1000 G dragon-sword damage", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50% rule win for a level-9 dragon sword, paying 400 G on 1000 G damage", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses level-5 dragon sword damage before deductible, paying 700 G on 800 G damage", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves level-9 steel sword damage before deductible, paying 400 G on 1000 G damage", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 100 G deductible once per damaged item, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G with a 4000 G cap and treats two sword damages separately", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 225 }, { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("rejects the whole claim through non-zero CLI status and stderr when damage entries outnumber insured items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
        ] } },
      ],
    };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("damage");
    expect(execution.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a cursed sword policy at 2000 G from unmodified insurance value, not its 165 G premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 165 }, { payout: 0, remainingCap: 2000 },
    ]);
  });
  it("values a sword and 3-rune block at 1750 G insurance sum despite the premium block discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G with 0 G remaining", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [damage] } },
      ],
    };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("keeps fractional payout intermediates and rounds 350.5 G down to 350 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quoted type through non-zero CLI status, stderr description, and no stdout results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("broomstick");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage to a known item absent from the policy through non-zero CLI status and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("damage");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage with an unknown item type through non-zero CLI status and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("damage");
    expect(execution.stdout).toBe("");
  });
  it("rejects negative damage through non-zero CLI status and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("amount");
    expect(execution.stdout).toBe("");
  });
  it("reads sequential steps from stdin and writes quote and claim results in the normative JSON stdout shape", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 }, steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const execution = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(execution.status).toBe(0);
    expect(execution.stderr).toBe("");
    expect(JSON.parse(execution.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
