import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / minimal
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });

  // Base premiums per item type
  it.todo("quote for a single plain sword yields 115 G (100 base + 10 first + 5 fee)");
  it.todo("quote for a single plain amulet yields 71 G (60 base + 6 first + 5 fee)");

  // Components and blocks
  it.todo("quote for 2 runes yields 60 G (50 base + 5 first + 5 fee)");
  it.todo("quote for 3 runes uses block: 71 G (60 base + 6 first + 5 fee)");
  it.todo("quote for 4 runes: 115 G (100 base + 10 first + 5 fee, no block)");
  it.todo("quote for 2 runes + 1 moonstone: 88 G (75 base + 8 first + 5 fee, no block)");
  it.todo("quote for 3 runes + 3 moonstones: 137 G (120 base + 12 first + 5 fee, two blocks)");

  // Modifiers
  it.todo("cursed sword (newcomer): 165 G (100 + 50 curse + 10 first + 5 fee)");
  it.todo("high-enchantment sword (enchantment 5): 148 G (100 + 30 + 13 first + 5 fee)");
  it.todo("loyalty discount: long-standing customer (2 years) gets 20% off policy base");
  it.todo("multi-item policy: item-specific surcharges apply per item, not policy total");
  it.todo("second contract: follow-up 15% discount applies; first insurance still applies per item");
  it.todo("integration: long-standing customer's second contract with cursed enchanted sword = 160 G");

  // Rounding
  it.todo("premium rounded UP to MHPCO favor (197.5 -> 198)");

  // Claims
  it.todo("standard sword damage 500 G yields payout 400 G (full minus 100 deductible)");
  it.todo("rune damage 200 G yields payout 100 G (full minus deductible)");
  it.todo("high-enchantment sword (>=8) damage 1000 G yields 400 G (50% then deductible)");
  it.todo("dragon-material sword damage fully reimbursed minus deductible");
  it.todo("dragon material + high enchantment: 50% rule wins, then deductible");
  it.todo("multiple items damaged in one event: deductible applied per damaged item");
  it.todo("payout rounded DOWN in MHPCO favor (350.5 -> 350)");
  it.todo("cap exhaustion: payout limited to remaining cap across successive claims");

  // CLI / errors (exit non-zero)
  it.todo("quote with unknown item type causes CLI error");
  it.todo("claim with damage on item not in policy causes CLI error");
  it.todo("claim with negative damage amount causes CLI error");
  it.todo("claim with more damages of a type than policy covers causes CLI error");
});
