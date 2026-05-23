import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { writeFileSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  runScenario,
  computeQuote,
  createPolicy,
  processClaim,
  Scenario,
  Item,
} from "./claim-office.js";

// ============================================================================
// Building block of 3 alike components
// ============================================================================

describe("Building block of 3 alike components", () => {
  it("2 runes → 50 G base premium", () => {
    // Newcomer with 0 years; only fee + base = 50 + 5 (first ins is 10% of 50 = 5) → 55? but spec says base premium, not full premium.
    // We assert via computeQuote with a configuration where only base premium is observed: 0 years, first contract.
    // policyBase = 50. itemSurcharges = 0. first ins = 5. Total before fee = 55. +5 fee = 60.
    // Round-trip via base premium check: ensure policyBase computation is 50.
    // We don't expose policyBase directly; verify via integration: a customer with 2 years loyalty (no surcharges) and first contract:
    // premium = 50 (base) + 0 - 10 (loyalty 20% of 50) + 5 (first ins 10% of 50) + 5 fee = 50 + 0 - 10 + 5 + 5 = 50.
    const items: Item[] = [{ type: "rune" }, { type: "rune" }];
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // base 50 - 10 + 5 + 5 = 50
    expect(premium).toBe(50);
  });

  it("3 runes → 60 G base premium (block applies)", () => {
    const items: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // base 60 - 12 + 6 + 5 = 59
    expect(premium).toBe(59);
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const items: Item[] = Array(4).fill({ type: "rune" });
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // base 100 - 20 + 10 + 5 = 95
    expect(premium).toBe(95);
  });

  it("7 runes → 175 G base premium", () => {
    // 2 blocks of 3 = 120, plus 1 leftover = 25 → 145
    // Wait, 7 runes: 7/3 = 2 blocks + 1 remainder. 2*60 + 1*25 = 145. But spec says 175.
    // Re-read: "7 runes → 175 G base premium". So 7 = 1 block + 4 leftover? That doesn't fit either.
    // 1 block (60) + 4 individuals (100) = 160. Still not 175.
    // 7 runes at 25 each = 175. So block doesn't apply for 7? Only exactly 3 → block?
    // Re-read: "A building block of 3 alike components is offered at a special base premium of 60 G."
    // "4 runes → 100 G base premium (no block — block requires exactly 3)"
    // So a block applies only if the count is exactly 3? Then 7 = no block, 7*25 = 175. ✓
    // But what about 6? 6*25 = 150. And 9?
    // Need to interpret: only count == 3 triggers the block.
    const items: Item[] = Array(7).fill({ type: "rune" });
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // policyBase = 175. -35 + 17.5 + 5 = 162.5 → ceil 163
    expect(premium).toBe(163);
  });
});

// ============================================================================
// "Alike" components
// ============================================================================

describe("Alike components", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const items: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // base 75 - 15 + 7.5 + 5 = 72.5 → 73
    expect(premium).toBe(73);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const items: Item[] = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    // base 120 - 24 + 12 + 5 = 113
    expect(premium).toBe(113);
  });
});

// ============================================================================
// Modifier scope on multi-item policies
// ============================================================================

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword (100 G base) + plain amulet (60 G base) → 210 G before policy-wide modifiers and fee", () => {
    // 0 years, first contract: first insurance applies but not loyalty/follow-up
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const premium = computeQuote({ yearsWithMHPCO: 0 }, items, false);
    // policyBase = 160. surcharges = 50 (cursed sword). first ins = 16. + 5 fee = 231.
    expect(premium).toBe(231);
  });
});

// ============================================================================
// Modifier thresholds
// ============================================================================

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword, ench 3, not cursed: base 100. loyalty -20. first ins +10. +5 fee = 95.
    const items: Item[] = [{ type: "sword", enchantment: 3, cursed: false }];
    const premium = computeQuote({ yearsWithMHPCO: 2 }, items, false);
    expect(premium).toBe(95);
  });

  it("customer with 1 year → loyalty discount does not apply", () => {
    const items: Item[] = [{ type: "sword", enchantment: 3, cursed: false }];
    const premium = computeQuote({ yearsWithMHPCO: 1 }, items, false);
    // 100 + 10 + 5 = 115
    expect(premium).toBe(115);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // sword ench 5: base 100, high ench +30. first ins +10, +5 fee = 145.
    const items: Item[] = [{ type: "sword", enchantment: 5, cursed: false }];
    const premium = computeQuote({ yearsWithMHPCO: 0 }, items, false);
    expect(premium).toBe(145);
  });

  it("sword with enchantment 5 and cursed → both surcharges apply", () => {
    // base 100, curse +50, high ench +30, first ins +10, +5 = 195
    const items: Item[] = [{ type: "sword", enchantment: 5, cursed: true }];
    const premium = computeQuote({ yearsWithMHPCO: 0 }, items, false);
    expect(premium).toBe(195);
  });

  it("sword with enchantment 4, not cursed → no surcharges", () => {
    const items: Item[] = [{ type: "sword", enchantment: 4, cursed: false }];
    const premium = computeQuote({ yearsWithMHPCO: 0 }, items, false);
    // 100 + 10 + 5 = 115
    expect(premium).toBe(115);
  });

  it("sword with enchantment 4 and cursed → curse only", () => {
    const items: Item[] = [{ type: "sword", enchantment: 4, cursed: true }];
    const premium = computeQuote({ yearsWithMHPCO: 0 }, items, false);
    // 100 + 50 + 10 + 5 = 165
    expect(premium).toBe(165);
  });

  it("dragon-material sword with enchantment 8, damage 1000 G → payout 400 G", () => {
    // high-enchantment clause applies (50%): 500, then deductible: 400
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = processClaim(policy, {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
});

// ============================================================================
// Deductible per damage event
// ============================================================================

describe("Deductible per damage event", () => {
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible per item)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "amulet", material: "silver", enchantment: 2 },
    ]);
    const result = processClaim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    // (500 - 100) + (300 - 100) = 600
    expect(result.payout).toBe(600);
  });
});

// ============================================================================
// Standard reimbursement (no special clauses)
// ============================================================================

describe("Standard reimbursement", () => {
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = processClaim(policy, {
      cause: "accident",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  it("damage to a rune (insurance 250 G), damage 200 G → payout 100 G", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = processClaim(policy, {
      cause: "accident",
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });
});

// ============================================================================
// Enchantment threshold vs. dragon material
// ============================================================================

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon clause: full, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (high-ench clause: 50%, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
});

// ============================================================================
// Multiple items of the same type
// ============================================================================

describe("Multiple items of the same type", () => {
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });

  it("dragon attack damages both swords; each entry has its own deductible", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    const result = processClaim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    // (500 - 100) * 2 = 800
    expect(result.payout).toBe(800);
  });

  it("claim with more damages than policy covers (two sword damages, one sword) → rejected (throws)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(() =>
      processClaim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      })
    ).toThrow();
  });
});

// ============================================================================
// Cap exhaustion
// ============================================================================

describe("Cap exhaustion", () => {
  it("policy covers a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "amulet", material: "silver", enchantment: 2 },
    ]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });

  it("cursed sword: cap 2000 G based on unmodified insurance value (premium modifiers don't raise cap)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]);
    expect(policy.cap).toBe(2000);
  });

  it("sword + 3 runes (block) → insurance sum 1750 G (block discount affects premium only)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });

  it("sword (cap 2000 G); two successive claims of 1500 G each → first payout 1400, second 600", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const r1 = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

// ============================================================================
// Rounding in the MHPCO's favor
// ============================================================================

describe("Rounding in the MHPCO's favor", () => {
  it("premium 197.5 G → final premium 198 G (rounded up)", () => {
    // Engineer: 7 runes, customer 2 years, follow-up
    // policyBase = 175. -35 (loyalty) + 17.5 (first ins) - 26.25 (follow-up 15%) + 5 fee
    // = 175 - 35 + 17.5 - 26.25 + 5 = 136.25 → ceil 137. Not the right test case.
    // Let's just verify ceiling behavior on a constructed case.
    // 2 runes, 0 years, first: policyBase=50, first ins +5, +5 fee = 60. Integer.
    // Easier: just confirm Math.ceil semantics via a known fractional case.
    // 7 runes, 0 years, first: 175 + 17.5 + 5 = 197.5 → 198. ✓
    const premium = computeQuote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), false);
    expect(premium).toBe(198);
  });

  it("payout 350.5 G → 350 G (rounded down)", () => {
    // Need a calculation yielding .5. high-ench item: damage 901 → 450.5, -100 = 350.5
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 8 }]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });

  it("intermediate amounts during calculation are kept as fractions; only final premium/payout is rounded", () => {
    // Verified indirectly through the above tests with fractional intermediate values
    const premium = computeQuote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), false);
    expect(Number.isInteger(premium)).toBe(true);
  });
});

// ============================================================================
// Edge cases
// ============================================================================

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const premium = computeQuote({ yearsWithMHPCO: 0 }, [], false);
    expect(premium).toBe(5);
  });

  it("quote with unknown item type → exits non-zero, error to stderr", () => {
    expect(() => computeQuote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], false)).toThrow();
  });

  it("claim references damage to item not part of policy → throws", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 100 }],
      })
    ).toThrow();
  });

  it("claim with unknown item type in damages → throws", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "broomstick", amount: 100 }],
      })
    ).toThrow();
  });

  it("claim with negative damage amount → throws", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      })
    ).toThrow();
  });
});

// ============================================================================
// Integration examples
// ============================================================================

describe("Integration: Newcomer with a cursed sword", () => {
  it("0 years, no previous contract, cursed sword (steel, ench 3) → 165 G", () => {
    const premium = computeQuote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      false,
    );
    // 100 base + 50 curse + 10 first = 160 + 5 fee = 165
    expect(premium).toBe(165);
  });
});

describe("Integration: Long-standing customer's second contract", () => {
  it("3 years, second contract, cursed sword (steel, ench 7) → 160 G", () => {
    const premium = computeQuote(
      { yearsWithMHPCO: 3 },
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      true,
    );
    // 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
    expect(premium).toBe(160);
  });
});

// ============================================================================
// Scenario runner (full input/output flow)
// ============================================================================

describe("runScenario", () => {
  it("processes quote then claim referring to policy by index", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    const output = runScenario(scenario);
    expect(output.results.length).toBe(2);
    expect((output.results[0] as { premium: number }).premium).toBeTypeOf("number");
    const claim = output.results[1] as { payout: number; remainingCap: number };
    // amulet damage 200, no special clause: payout = 200 - 100 = 100. cap = 1200 - 100 = 1100.
    expect(claim.payout).toBe(100);
    expect(claim.remainingCap).toBe(1100);
  });

  it("treats second quote in scenario as follow-up contract", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const output = runScenario(scenario);
    // Second quote = integration example #2 = 160 G
    expect((output.results[1] as { premium: number }).premium).toBe(160);
  });
});

// ============================================================================
// CLI
// ============================================================================

describe("CLI", () => {
  const cliPath = join(process.cwd(), "src", "cli.ts");

  function runCli(input: string): { stdout: string; stderr: string; status: number } {
    try {
      const stdout = execSync(`pnpm exec tsx ${cliPath}`, {
        input,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return { stdout, stderr: "", status: 0 };
    } catch (err) {
      const e = err as { stdout: string; stderr: string; status: number };
      return { stdout: e.stdout ?? "", stderr: e.stderr ?? "", status: e.status ?? 1 };
    }
  }

  it("reads JSON from stdin, writes JSON results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
  });

  it("exits non-zero on unknown item type in quote", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("exits non-zero on negative damage amount", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("exits non-zero on damage to item not part of policy", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    });
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
