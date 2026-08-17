import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("charges only the 5 G processing fee for an empty item list -- premium 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("uses the main-item price list and first-insurance surcharge -- sword 115 G, amulet 71 G, staff 93 G, potion 49 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0].premium,
    );
    expect(premiums).toEqual([115, 71, 93, 49]);
  });
  it("uses each main item's insurance value -- empty-claim caps are sword 2000 G, amulet 1200 G, staff 1600 G, potion 800 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 2, incident: { cause: "inspection", damages: [] } },
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 4, incident: { cause: "inspection", damages: [] } },
        { op: "quote", items: [{ type: "potion" }] },
        { op: "claim", policy: 6, incident: { cause: "inspection", damages: [] } },
      ],
    } as never);
    expect([1, 3, 5, 7].map((index) => output.results[index])).toEqual([
      { payout: 0, remainingCap: 2000 },
      { payout: 0, remainingCap: 1200 },
      { payout: 0, remainingCap: 1600 },
      { payout: 0, remainingCap: 800 },
    ]);
  });
  it("prices ordinary components at 25 G each -- two different components have premium 60 G including first-insurance surcharge and fee", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "moonstone" }] }],
    });
    expect(output.results).toEqual([{ premium: 60 }]);
  });
  it("applies a block only to exactly 3 alike components -- raw bases for 2, 3, 4, and 7 runes are reflected by premiums 60, 71, 115, and 198 G", () => {
    const premiums = [2, 3, 4, 7].map((count) =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
      }).results[0].premium,
    );
    expect(premiums).toEqual([60, 71, 115, 198]);
  });
  it("interprets alike as exact component type -- mixed triple premium 88 G and separate rune/moonstone triples premium 137 G", () => {
    const mixed = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] });
    const separate = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))] }],
    });
    expect([mixed.results[0].premium, separate.results[0].premium]).toEqual([88, 137]);
  });
  it("scopes a cursed surcharge to the affected item -- cursed sword plus plain amulet premium 231 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }] }],
    } as never);
    expect(output.results).toEqual([{ premium: 231 }]);
  });
  it("applies the loyalty discount at exactly 2 years -- plain sword premium 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results).toEqual([{ premium: 95 }]);
  });
  it("applies enchantment and curse thresholds per item -- level 5 cursed sword 195 G, level 4 cursed sword 165 G, level 4 plain sword 115 G", () => {
    const premiums = [
      { type: "sword", enchantment: 5, cursed: true },
      { type: "sword", enchantment: 4, cursed: true },
      { type: "sword", enchantment: 4, cursed: false },
    ].map((item) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] } as never).results[0].premium);
    expect(premiums).toEqual([195, 165, 115]);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("quotes a long-standing customer's second cursed level-7 sword contract at 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results).toEqual([{ premium: 198 }]);
  });
  it("reimburses standard damage then deducts 100 G -- regular sword pays 400 G and rune pays 100 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 2, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(output.results[3]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("resolves enchantment versus dragon clauses -- exact level-8 dragon pays 400 G, level-9 dragon 400 G, level-5 dragon 700 G, level-9 steel 400 G", () => {
    const examples = [
      { item: { type: "sword", material: "dragon", enchantment: 8 }, amount: 1000 },
      { item: { type: "sword", material: "dragon", enchantment: 9 }, amount: 1000 },
      { item: { type: "sword", material: "dragon", enchantment: 5 }, amount: 800 },
      { item: { type: "sword", material: "steel", enchantment: 9 }, amount: 1000 },
    ];
    const payouts = examples.map(({ item, amount }) =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [item] },
          { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
        ],
      }).results[1].payout,
    );
    expect(payouts).toEqual([400, 400, 700, 400]);
  });
  it("applies the deductible once per damaged item -- sword 500 G plus amulet 300 G pays 600 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("supports duplicate insured item types -- two swords have cap 4000 G and two 500 G damages pay 800 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "duplicate report", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
      ],
    })).toThrow(/more damage entries/i);
  });
  it("bases policy caps on unmodified insurance sums -- sword plus amulet 3200 G, cursed sword 2000 G, sword plus three runes 3500 G", () => {
    const policies = [
      [{ type: "sword" }, { type: "amulet" }],
      [{ type: "sword", cursed: true }],
      [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
    ];
    const caps = policies.map((items) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }],
    }).results[1].remainingCap);
    expect(caps).toEqual([3200, 2000, 3500]);
  });
  it("tracks cap exhaustion across claims -- successive 1500 G sword claims pay 1400 G then 600 G, leaving zero", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(output.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G payout down to 350 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "rounding", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects an unknown quote item with stderr, non-zero status, and no stdout results", () => {
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }),
      encoding: "utf8",
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/unknown item type/i);
    expect(run.stdout).not.toContain("results");
  });
  it("CLI rejects damage to an uninsured or unknown item with stderr and non-zero status", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType, amount: 200 }] } },
          ],
        }),
        encoding: "utf8",
      });
      expect(run.status).not.toBe(0);
      expect(run.stderr).toMatch(/not insured|unknown item type/i);
      expect(run.stdout).not.toContain("results");
    }
  });
  it("CLI rejects a negative damage amount with stderr and non-zero status", () => {
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
      encoding: "utf8",
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/negative damage/i);
    expect(run.stdout).not.toContain("results");
  });
  it("CLI emits results in step order with the normative quote and claim result field names", () => {
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
      encoding: "utf8",
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(run.stderr).toBe("");
  });
});
