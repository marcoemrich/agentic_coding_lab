import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / fee-only ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results).toEqual([{ premium: 5 }]);
  });

  // --- Single main items (base premiums + fee) ---
  it("quote for a single plain sword on a new customer -> premium 115 G (100 base + 10 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results).toEqual([{ premium: 115 }]);
  });
  it("quote for a single plain amulet on a new customer -> premium 71 G (60 base + 6 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out.results).toEqual([{ premium: 71 }]);
  });
  it("quote for a single plain staff on a new customer -> premium 93 G (80 base + 8 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results).toEqual([{ premium: 93 }]);
  });
  it("quote for a single plain potion on a new customer -> premium 49 G (40 base + 4 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out.results).toEqual([{ premium: 49 }]);
  });

  // --- Components: building block of 3 alike ---
  it("2 runes on a new customer -> 50 G base premium -> 60 G total (50 + 5 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes on a new customer -> 60 G base (block applies) -> 71 G total (60 + 6 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes on a new customer -> 100 G base (no block; requires exactly 3) -> 115 G total", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(out.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes on a new customer -> 175 G base (no block; not exactly 3) -> 198 G total (175 + 17.5 first ins + 5 fee = 197.5 -> 198 rounded up)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(out.results).toEqual([{ premium: 198 }]);
  });

  // --- 'Alike' components: same type only ---
  it("2 runes + 1 moonstone on a new customer -> 75 G base (no block, different types) -> 88 G total (75 + 7.5 first ins + 5 fee -> 88 rounded up)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(out.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones on a new customer -> 120 G base (two separate blocks) -> 137 G total", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(out.results).toEqual([{ premium: 137 }]);
  });

  // --- Cursed surcharge (single item) ---
  it("cursed sword on a new customer -> 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out.results).toEqual([{ premium: 165 }]);
  });

  // --- High enchantment surcharge ---
  it("plain sword enchantment 5 on a new customer -> 145 G (100 base + 30 high-ench + 10 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out.results).toEqual([{ premium: 145 }]);
  });
  it("plain sword enchantment 4 on a new customer -> 115 G (no high-ench surcharge)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  // --- Loyalty discount threshold ---
  it("customer with exactly 2 years + plain sword -> 95 G (100 base + 10 first ins - 20 loyalty + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results).toEqual([{ premium: 95 }]);
  });

  // --- Modifier scope on multi-item policies ---
  it("policy with cursed sword + plain amulet (new customer) -> 231 G (100+60 base + 50 curse on sword + 16 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    expect(out.results).toEqual([{ premium: 231 }]);
  });

  // --- Rounding ---
  it("premium calc yielding 197.5 G -> final 198 G (rounded up, MHPCO favor)", () => {
    // 7 runes: 175 base + 17.5 first ins + 5 fee = 197.5 -> 198
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(out.results).toEqual([{ premium: 198 }]);
  });
  it("payout calc yielding 350.5 G -> final 350 G (rounded down, MHPCO favor)", () => {
    // sword ench 8: 50% rule. damage 901 -> 50%*901 = 450.5 - 100 = 350.5
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Claim: basic ---
  it("regular steel sword (ench 3), damage 500 G -> payout 400 G (no special clause, minus deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "misadventure", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance 250 G), damage 200 G -> payout 100 G (full reimbursement minus 100 G deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "trip", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high enchantment clause ---
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (high-ench 50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material clause ---
  it("dragon-material sword ench 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: both clauses apply (high enchantment wins) ---
  it("dragon-material sword ench 9, damage 1000 G -> payout 400 G (50% rule wins; then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) + amulet (300) -> payout 600 G (100 deductible per item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout 200-100=100, remainingCap 4000-100=3900
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two swords insured, dragon damages both -> each entry separate deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array contains more entries of a type than insured -> claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 100 },
            { itemType: "sword", amount: 100 },
          ] } },
        ],
      }),
    ).toThrow();
  });

  // --- Cap calculation ---
  it("policy with sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 5000 },
        ] } },
      ],
    });
    // Damage 5000 - deductible 100 = 4900, capped at 3200
    expect(out.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword premium 165 with modifiers -> cap 2000 G (based on unmodified insurance value)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(out.results).toEqual([
      { premium: 165 },
      { payout: 2000, remainingCap: 0 },
    ]);
  });
  it("sword + 3 runes (block) -> insurance sum 1750 G; block affects premium only", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    // Cap 1750*2 = 3500
    expect(out.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000), first claim 1500 -> payout 1400, remaining cap 600", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000), two successive claims 1500 each -> 1400 then 600, remaining 0", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "y", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword -> 165 G (integration example, repeated)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(out.results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's second contract: cursed sword (ench 7) -> 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }, // some prior contract
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Edge cases / errors ---
  it("quote with unknown item type -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" } as unknown as { type: string }] }],
    })).toThrow();
  });
  it("claim references damage on item not in policy -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    })).toThrow();
  });
  it("claim damage with negative amount -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // --- CLI integration ---
  it("CLI reads JSON from stdin and writes results to stdout (schema example)", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).toBe(0);
    const out = JSON.parse(res.stdout);
    expect(Array.isArray(out.results)).toBe(true);
    expect(out.results).toHaveLength(2);
    expect(typeof out.results[0].premium).toBe("number");
    expect(typeof out.results[1].payout).toBe("number");
    expect(typeof out.results[1].remainingCap).toBe("number");
  });
});
