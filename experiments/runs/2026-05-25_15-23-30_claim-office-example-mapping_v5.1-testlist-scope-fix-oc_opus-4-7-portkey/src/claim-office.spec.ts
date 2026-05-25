import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases / edge cases ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote with unknown item type -> throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // --- Single main item base premiums ---
  it("single plain sword (newcomer, first quote) -> premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (newcomer, first quote) -> premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (newcomer, first quote) -> premium 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (newcomer, first quote) -> premium 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components: per-piece and building-block pricing (newcomer, first quote => 10% surcharge on base) ---
  it("2 runes (newcomer) -> premium 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (newcomer) -> premium 71 G (block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (newcomer) -> premium 115 G (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (newcomer) -> premium 198 G", () => {
    const items = Array(7).fill({ type: "rune" });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone (newcomer) -> premium 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones (newcomer) -> premium 137 G (two blocks)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifier thresholds (newcomer, first quote unless noted) ---
  it("cursed sword (newcomer) -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 (newcomer) -> premium 145 G (high-ench applies at exactly 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 (newcomer) -> premium 115 G (no high-ench at 4)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 (newcomer) -> premium 195 G (both surcharges)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years (loyalty applies, first quote) -> sword premium 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year (no loyalty, first quote) -> sword premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote (follow-up, no loyalty, 0 years) -> sword premium 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Multi-item policies and modifier scope (newcomer, first quote) ---
  it("policy with cursed sword + plain amulet (newcomer) -> premium 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("two swords (newcomer) -> premium 225 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });

  // --- Rounding in MHPCO's favor (premium rounded up) ---
  // (Already covered by "7 runes -> 198 G": 175 base + 17.5 first-ins = 192.5, ceil(192.5)+5=198)

  // --- Integration examples ---
  it("long-standing customer's second contract: cursed sword ench 7 -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "ogre", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment/material), damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fall", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 100 });
  });

  // --- Claim processing: special clauses ---
  it("dragon sword enchantment 8, damage 1000 G -> payout 400 G (high-ench clause, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword ench 9, damage 1000 G -> payout 400 G (50% wins)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(r.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword ench 5, damage 800 G -> payout 700 G (only dragon clause)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(r.results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword ench 9, damage 1000 G -> payout 400 G (only high-ench)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(r.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> total payout 600 G (deductible per item)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(r.results[1]).toMatchObject({ payout: 600 });
  });

  // --- Multiple items of the same type ---
  it("policy with two swords -> two sword damages each with own deductible; cap 4000", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fight", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    });
    // 500-100 + 300-100 = 400+200 = 600; cap 4000, remaining 3400
    expect(r.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("damages contains more entries of a type than insured -> throws (claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fight", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword (cap 2000); two claims of 1500 -- first 1400 (remaining 600); second 600 (remaining 0)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(r.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(r.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword cap is 2000 G (based on unmodified insurance value)", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    // payout=0 (100-100), remainingCap=2000-0=2000
    expect(r.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes block -> insurance sum 1750 G, cap 3500 G", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout = 200-100 = 100; cap = 1750*2 = 3500; remaining = 3400
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Rounding in MHPCO's favor (payout rounded down) ---
  it("payout that yields 350.5 G fractional -> rounded down to 350 G", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        // damage 901 -> high-ench 50%: 450.5, minus 100 deductible: 350.5, rounded down: 350
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(r.results[1]).toMatchObject({ payout: 350 });
  });

  // --- Claim error cases ---
  it("claim references item not in policy -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    })).toThrow();
  });
  it("claim damage entry with negative amount -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // --- CLI integration ---
  it("CLI reads JSON from stdin, writes JSON results to stdout", async () => {
    const { spawn } = await import("child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    const child = spawn("node", ["--import", "tsx", "src/cli.ts"], { stdio: ["pipe", "pipe", "pipe"] });
    child.stdin.write(input);
    child.stdin.end();
    let out = "";
    child.stdout.on("data", (chunk: Buffer) => { out += chunk.toString(); });
    const exitCode = await new Promise<number>((resolve) => child.on("close", resolve));
    expect(exitCode).toBe(0);
    expect(JSON.parse(out)).toEqual({ results: [{ premium: 165 }] });
  });

  it("CLI exits non-zero and writes to stderr on unknown item type", async () => {
    const { spawn } = await import("child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const child = spawn("node", ["--import", "tsx", "src/cli.ts"], { stdio: ["pipe", "pipe", "pipe"] });
    child.stdin.write(input);
    child.stdin.end();
    let out = "";
    let err = "";
    child.stdout.on("data", (c: Buffer) => { out += c.toString(); });
    child.stderr.on("data", (c: Buffer) => { err += c.toString(); });
    const exitCode = await new Promise<number>((resolve) => child.on("close", resolve));
    expect(exitCode).not.toBe(0);
    expect(err.length).toBeGreaterThan(0);
    expect(out).toBe("");
  });
});
