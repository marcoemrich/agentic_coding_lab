import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { runScenario, type Scenario } from "./claim-office.js";

// --- Helpers --------------------------------------------------------------

function quote(items: any[], yearsWithMHPCO = 0): number {
  const out = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (out.results[0] as { premium: number }).premium;
}

function quoteWithPrior(items: any[], yearsWithMHPCO = 0): number {
  // Add a prior trivial quote so this one becomes a follow-up
  const out = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items: [{ type: "potion" }] },
      { op: "quote", items },
    ],
  });
  return (out.results[1] as { premium: number }).premium;
}

function claimSingle(
  items: any[],
  damages: any[],
  yearsWithMHPCO = 0,
): { payout: number; remainingCap: number } {
  const out = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  });
  return out.results[1] as { payout: number; remainingCap: number };
}

// --- Item values and base premiums ---------------------------------------

describe("Item base premiums", () => {
  it("sword: base premium 100 + 10 first insurance + 5 fee = 115", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });

  it("amulet: base premium 60 + 6 first insurance + 5 fee = 71", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });

  it("staff: base premium 80 + 8 first insurance + 5 fee = 93", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });

  it("potion: base premium 40 + 4 first insurance + 5 fee = 49", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

// --- Building block of 3 alike components --------------------------------

describe("Building block of 3 alike components", () => {
  it("2 runes → 50 G base premium (no block)", () => {
    // base = 50, first insurance +5 = 55, +5 fee = 60
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("3 runes → 60 G base premium (block applies)", () => {
    // base = 60, first insurance +6 = 66, +5 fee = 71
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // base = 100, first insurance +10 = 110, +5 fee = 115
    expect(
      quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(115);
  });

  it("7 runes → 175 G base premium", () => {
    // 2 blocks of 3 (120) + 1 leftover (25) = 145? Wait, spec says 175.
    // Per spec: "block requires exactly 3" — so 7 runes = no block applies at all? But spec says 175.
    // 7 * 25 = 175 — yes, 7 runes is 175 G base premium (no block since not exactly 3).
    // base = 175, first insurance +17.5 = 192.5, +5 fee = 197.5 → 198
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });
});

// --- "Alike" components --------------------------------------------------

describe('"Alike" components — exactly the same type', () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // base = 75, first insurance +7.5 = 82.5, +5 fee = 87.5 → 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // base = 60 + 60 = 120, first insurance +12 = 132, +5 fee = 137
    expect(
      quote([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(137);
  });
});

// --- Modifier scope on multi-item policies -------------------------------

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet: 100+60=160 base, cursed +50 (on sword base only) = 210 before fee", () => {
    // base = 160, cursed surcharge +50 = 210
    // first insurance +16 = 226, fee +5 = 231
    expect(
      quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]),
    ).toBe(231);
  });
});

// --- Modifier thresholds -------------------------------------------------

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword: base 100, loyalty -20, first insurance +10 = 90, fee +5 = 95
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // base 100, high ench +30 = 130, first insurance +10 = 140, fee +5 = 145
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  it("sword with exactly enchantment 5 AND cursed → both surcharges", () => {
    // base 100, cursed +50, high ench +30 = 180, first insurance +10 = 190, fee +5 = 195
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });

  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // base 100, first insurance +10 = 110, fee +5 = 115
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });

  it("sword with enchantment 4, cursed → curse surcharge applies", () => {
    // base 100, cursed +50 = 150, first insurance +10 = 160, fee +5 = 165
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });

  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    // dragon + ench 8: enchantment clause wins (50%), then deductible: 500 - 100 = 400
    const { payout } = claimSingle(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(payout).toBe(400);
  });
});

// --- Deductible per damage event -----------------------------------------

describe("Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per damaged item)", () => {
    // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
    const { payout } = claimSingle(
      [
        { type: "sword", material: "steel" },
        { type: "amulet", material: "silver" },
      ],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(payout).toBe(600);
  });
});

// --- Standard reimbursement ---------------------------------------------

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const { payout } = claimSingle(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(payout).toBe(400);
  });

  it("damage to a rune, damage 200 G → payout 100 G", () => {
    // rune insurance value 250, cap = 500; damage 200 - 100 deductible = 100
    const { payout } = claimSingle(
      [{ type: "rune" }],
      [{ itemType: "rune", amount: 200 }],
    );
    expect(payout).toBe(100);
  });
});

// --- Enchantment threshold vs. dragon material ---------------------------

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const { payout } = claimSingle(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(payout).toBe(400);
  });

  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon clause: full, then deductible)", () => {
    const { payout } = claimSingle(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    );
    expect(payout).toBe(700);
  });

  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50%, then deductible)", () => {
    const { payout } = claimSingle(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(payout).toBe(400);
  });
});

// --- Multiple items of the same type -------------------------------------

describe("Multiple items of the same type", () => {
  it("two swords → insurance sum 2000 G, cap 4000 G", () => {
    // quote: base 200, first insurance +20 = 220, fee +5 = 225
    // claim with 2 small damages to verify cap
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    // Payouts: 100 + 200 = 300; cap = 4000, remaining = 3700
    expect(claim.payout).toBe(300);
    expect(claim.remainingCap).toBe(3700);
  });

  it("dragon attack damages both swords; each damage gets its own deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel" },
            { type: "sword", material: "steel" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    // 400 + 400 = 800
    expect(claim.payout).toBe(800);
  });

  it("claim with more damages of a type than insured → CLI rejects (runScenario throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

// --- Cap exhaustion ------------------------------------------------------

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600 G (cap 3200)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    // payout = 100, remaining = 3200 - 100 = 3100
    expect(claim.remainingCap).toBe(3100);
  });

  it("cursed sword: cap based on unmodified insurance value = 2000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    // payout 100, remaining 2000 - 100 = 1900
    expect(claim.remainingCap).toBe(1900);
  });

  it("sword + 3 runes (block) → insurance sum 1750 G (block does NOT affect insurance sum)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    // cap = 1750 * 2 = 3500; remaining = 3500 - 100 = 3400
    expect(claim.remainingCap).toBe(3400);
  });

  it("sword (cap 2000): two claims of 1500 G each → first 1400 (remaining 600), second 600 (remaining 0)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    const c1 = out.results[1] as { payout: number; remainingCap: number };
    const c2 = out.results[2] as { payout: number; remainingCap: number };
    expect(c1.payout).toBe(1400);
    expect(c1.remainingCap).toBe(600);
    expect(c2.payout).toBe(600);
    expect(c2.remainingCap).toBe(0);
  });
});

// --- Rounding in the MHPCO's favor ---------------------------------------

describe("Rounding in the MHPCO's favor", () => {
  it("premium of 197.5 G → 198 G (rounded up)", () => {
    // 7 runes premium: 175 + 17.5 (first insurance) + 5 = 197.5 → 198
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });

  it("payout of 350.5 G → 350 G (rounded down)", () => {
    // We need a payout that comes out to a fractional value. With 50% rule:
    // damage 901 on enchantment≥8 item: 901*0.5 = 450.5 - 100 = 350.5 → 350
    const { payout } = claimSingle(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
    );
    expect(payout).toBe(350);
  });

  it("intermediate fractions are kept until the end (premium)", () => {
    // verified by the 7-runes case above
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });
});

// --- Edge cases ----------------------------------------------------------

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });

  it("quote with unknown item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  it("claim references damage with item not in policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [{ itemType: "amulet", amount: 100 }],
            },
          },
        ],
      }),
    ).toThrow();
  });

  it("claim with unknown damage item type → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      }),
    ).toThrow();
  });

  it("claim with negative damage amount → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

// --- Integration examples ------------------------------------------------

describe("Integration: Newcomer with a cursed sword", () => {
  it("0 years, cursed sword (steel, enchantment 3) → premium 165 G", () => {
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
});

describe("Integration: Long-standing customer's second contract", () => {
  it("3 years, second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    expect(
      quoteWithPrior(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        3,
      ),
    ).toBe(160);
  });

  it("each item in a quote is treated as a first insurance, regardless of customer history", () => {
    // From spec: "The first insurance surcharge still applies to the new sword,
    // even though the customer is on a follow-up contract"
    // Already verified by the previous test: 10 G first-insurance is included
    // in the 160 G computation.
    expect(
      quoteWithPrior(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        3,
      ),
    ).toBe(160);
  });
});

// --- CLI integration -----------------------------------------------------

describe("CLI", () => {
  const cliPath = path.resolve(__dirname, "cli.ts");

  function runCli(input: string): { stdout: string; status: number; stderr: string } {
    try {
      const stdout = execFileSync("npx", ["tsx", cliPath], {
        input,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return { stdout, status: 0, stderr: "" };
    } catch (err: any) {
      return {
        stdout: err.stdout?.toString() ?? "",
        status: err.status ?? 1,
        stderr: err.stderr?.toString() ?? "",
      };
    }
  }

  it("reads JSON from stdin and writes JSON to stdout (schema example)", () => {
    const input: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const { stdout, status } = runCli(JSON.stringify(input));
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(2);
    expect(typeof parsed.results[0].premium).toBe("number");
    expect(typeof parsed.results[1].payout).toBe("number");
    expect(typeof parsed.results[1].remainingCap).toBe("number");
  });

  it("exits non-zero on unknown item type in quote", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("exits non-zero on negative damage", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: -1 }] },
        },
      ],
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
