import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge cases: empty / processing fee ---
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items are exercised indirectly through every quote test below;
  // the spec doesn't isolate them with a dedicated example, since first-insurance always applies per item.

  // --- Building block of 3 alike components ---
  it("2 runes -> premium reflects 50 G base + 5 G fee (long-standing follow-up customer, no other modifiers)", () => {
    // For long-standing follow-up: base 50 - 20%% loyalty - 15%% follow-up + 10%% first-insurance? Use newcomer no-first to isolate.
    // Simpler: use a customer with 2+ years -> loyalty 20%%, AND it's the first quote -> first insurance still applies per integration ex.
    // To isolate base we use: years=0, first quote -> first insurance 10%% applies on base.
    // newcomer with 2 runes: base 50 + 10%% first = 55 + 5 fee = 60 G.
    // But spec hasn't yet exercised first insurance with runes. To truly isolate base premium 50 G we need a quote where no premium modifiers apply.
    // Use: years=2 (loyalty applies, -20%%), this is the SECOND quote (follow-up -15%%).
    // Modifiers stacked: 50 * 0.8 (loyalty) - 50*0.15 (follow-up) + ? No - first insurance per item still applies.
    // The cleanest direct verification is to compute exactly what the spec produces.
    // Per integration example 2: "each item in a quote is treated as a first insurance".
    // So first insurance surcharge always applies. We'll verify the simpler invariant: 2 runes premium for a newcomer first quote:
    // base 50 + 10%% first = 55 + 5 = 60 G.
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" },
        { type: "rune" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> base premium 60 G (block applies) -> premium 60*1.1 + 5 = 71", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    // base = 60 (block), + 10%% first = 66 + 5 fee = 71 G
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> base premium 100 G (no block); premium 100*1.1 + 5 = 115", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> base premium 175 G; premium 175*1.1 + 5 = 197.5 -> 198", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });

  // --- 'Alike' components ---
  it("2 runes + 1 moonstone -> base premium 75 G; premium 75*1.1 + 5 = 87.5 -> 88", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks); premium 120*1.1 + 5 = 137", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet, newcomer first quote -> premium 231 G (160 base + 50 curse + 16 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // --- Modifier thresholds ---
  it("long-standing customer (exactly 2 years) with one plain sword, first quote -> premium 95 G (100 - 20 loyalty + 10 first + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] }],
    });
    // base 100; loyalty -20 (20%% of policy base 100); first-insurance +10 (10%% of 100); fee +5; = 95 G
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies; newcomer first quote -> premium 145 G (100 + 30 + 10 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("cursed sword with enchantment 5, newcomer first quote -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4, newcomer first quote -> premium 115 G (100 + 10 first + 5 fee, no high-ench)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  // --- Standard reimbursement (no special clauses) ---
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G, remainingCap 1600", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G), damage 200 G -> payout 100 G, remainingCap 400", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "acid", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // insurance value 250, cap = 500. Damage 200 - 100 deductible = 100. remainingCap 500-100=400.
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible per damaged item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    // 400 + 200 = 600; cap 3200, remaining 2600
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Enchantment threshold vs dragon material ---
  it("dragon-material sword, ench 9, damage 1000 G -> payout 400 G (both clauses apply, 50%% wins, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 5, damage 800 G -> payout 700 G (only dragon clause applies; high-enchantment claim threshold is 8)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 G -> payout 400 G (high-enchantment claim clause: 50%% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly ench 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords; two sword damages of 500 each -> each damage gets its own deductible, payout 800", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    // insurance sum 2000, cap 4000. 400 + 400 = 800. remainingCap 3200.
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array contains two sword entries but only one sword insured -> runScenario throws (claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy of sword + amulet -> insurance sum 1600 G, cap 3200 G (claim hugely exceeds cap, payout caps at 3200)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "earthquake", damages: [
          { itemType: "sword", amount: 10000 },
          { itemType: "amulet", amount: 10000 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword (premium 165 G) -> cap remains 2000 G; huge claim -> payout capped 2000", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "siege", damages: [{ itemType: "sword", amount: 100000 }] } },
      ],
    });
    expect((out.results[0] as { premium: number }).premium).toBe(165);
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy of sword + 3 runes -> insurance sum 1750 G; huge claim caps at 3500", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "earthquake", damages: [
          { itemType: "sword", amount: 100000 },
          { itemType: "rune", amount: 100000 },
          { itemType: "rune", amount: 100000 },
          { itemType: "rune", amount: 100000 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("sword insured; two successive 1500 G claims -> [1400, remainingCap 600], [600, remainingCap 0]", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding in MHPCO's favor ---
  // The premium rounding case (197.5 -> 198) is already exercised by the "7 runes" test.
  it("payout calculation 350.5 G -> final payout 350 (rounded down)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // 901*0.5 - 100 = 350.5 -> floor = 350. cap 2000 - 350 = 1650.
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Edge cases for input validation ---
  it("quote with unknown item type 'broomstick' -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not part of policy (amulet damaged when only sword insured) -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim damage with negative amount -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing (3 years) customer's second quote: cursed sword ench 7 -> premium 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // second quote: 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- CLI (stdin/stdout JSON) ---
  it("CLI reads JSON from stdin, writes JSON results to stdout (schema example)", async () => {
    const { execFileSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "amulet", amount: 200 },
        ] } },
      ],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf-8" });
    const parsed = JSON.parse(stdout);
    expect(Array.isArray(parsed.results)).toBe(true);
    expect(parsed.results).toHaveLength(2);
    expect(typeof parsed.results[0].premium).toBe("number");
    expect(typeof parsed.results[1].payout).toBe("number");
    expect(typeof parsed.results[1].remainingCap).toBe("number");
  });
});
