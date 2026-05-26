import { describe, it, expect } from "vitest";
import { runCLI } from "./cli.js";

describe("MHPCO Claim Office CLI", () => {
  // ============ EMPTY AND EDGE CASES ============

  it("empty item list quote should return premium 5 G (only processing fee)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(5);
  });

  it("quote with unknown item type should exit with non-zero status and error to stderr", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    };
    await expect(runCLI(JSON.stringify(input))).rejects.toThrow();
  });

  it("claim with damage entry for item not in policy should exit with non-zero status and error to stderr", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    };
    await expect(runCLI(JSON.stringify(input))).rejects.toThrow();
  });

  it("claim with damage entry for unknown item type should exit with non-zero status and error to stderr", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "broomstick", amount: 100 }] } }
      ]
    };
    await expect(runCLI(JSON.stringify(input))).rejects.toThrow();
  });

  it("claim with negative damage amount should exit with non-zero status and error to stderr", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    await expect(runCLI(JSON.stringify(input))).rejects.toThrow();
  });

  it("claim with more damage entries of a type than policy covers should exit with non-zero status and error to stderr", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 200 }] } }
      ]
    };
    await expect(runCLI(JSON.stringify(input))).rejects.toThrow();
  });

  // ============ BASE PREMIUMS ============

  it("sword base premium should be 100 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(115);
  });

  it("amulet base premium should be 60 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(71);
  });

  it("staff base premium should be 80 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(93);
  });

  it("potion base premium should be 40 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(49);
  });

  it("rune base premium should be 25 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(33);
  });

  it("moonstone base premium should be 25 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(33);
  });

  // ============ COMPONENT BLOCKS ============

  it("2 runes should have base premium 50 G (2 x 25)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(60);
  });

  it("3 runes should have base premium 60 G (block discount applies)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(71);
  });

  it("4 runes should have base premium 100 G (no block - requires exactly 3)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(115);
  });

  it("7 runes should have base premium 175 G (no blocks - 7 x 25)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(198);
  });

  it("2 runes + 1 moonstone should have base premium 75 G (no block - different types)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(88);
  });

  it("3 runes + 3 moonstones should have base premium 120 G (two separate blocks)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(137);
  });

  // ============ INSURANCE VALUES ============

  it("sword insurance value should be 1000 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 1000, cap: 2000
    // After a claim of 0 (100 - 100 deductible), remaining cap should be 2000
    expect(result.results[1].remainingCap).toBe(2000);
  });

  it("amulet insurance value should be 600 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 600, cap: 1200
    expect(result.results[1].remainingCap).toBe(1200);
  });

  it("staff insurance value should be 800 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "staff", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 800, cap: 1600
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("potion insurance value should be 400 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "potion", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 400, cap: 800
    expect(result.results[1].remainingCap).toBe(800);
  });

  it("rune insurance value should be 250 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "rune", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 250, cap: 500
    expect(result.results[1].remainingCap).toBe(500);
  });

  it("moonstone insurance value should be 250 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "moonstone", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 250, cap: 500
    expect(result.results[1].remainingCap).toBe(500);
  });

  // ============ ITEM-SPECIFIC MODIFIERS ============

  it("cursed sword should add 50% surcharge to its base premium (100 -> 150)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(165);
  });

  it("highly enchanted sword (level 5) should add 30% surcharge to its base premium (100 -> 130)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(145);
  });

  it("cursed and highly enchanted sword (level 5) should add both surcharges to its base premium (100 -> 180)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(195);
  });

  it("sword with enchantment 4 should not add high-enchantment surcharge", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(115);
  });

  it("cursed sword with enchantment 4 should only add curse surcharge (100 -> 150)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(165);
  });

  // ============ POLICY-WIDE MODIFIERS ============

  it("customer with 2 years should receive 20% loyalty discount on policy base premium", async () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(95);
  });

  it("customer with exactly 2 years should receive loyalty discount", async () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(95);
  });

  it("first insurance should add 10% initial assessment surcharge on policy base premium", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    // Base: 100, first insurance: +10, fee: +5 = 115
    expect(result.results[0].premium).toBe(115);
  });

  it("follow-up contract (second quote) should give 15% discount on policy base premium", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // First quote: 100 + 10 + 5 = 115
    // Second quote: 100 + 10 - 15 + 5 = 100
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });

  it("processing fee of 5 G should be added to every premium", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(5);
  });

  // ============ MODIFIER SCOPE ============

  it("cursed surcharge should apply only to cursed item's base premium, not whole policy", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    // Sword: base 100 + cursed 50 = 150
    // Amulet: base 60
    // Policy base premium: 100 + 60 = 160
    // Item-specific modifiers: 50 (cursed)
    // First insurance: +10% of 160 = +16
    // Fee: +5
    // Total: 160 + 50 + 16 + 5 = 231
    expect(result.results[0].premium).toBe(231);
  });

  it("policy with cursed sword (100) and plain amulet (60) should have base premium 160, cursed surcharge 50, total 210 before fee", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(231);
  });

  it("item-specific modifiers apply to item base premium, policy-wide modifiers apply to policy base premium sum", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    // This is the same as the previous test, which verifies that item-specific modifiers
    // (cursed surcharge on sword) and policy-wide modifiers (first insurance on policy base premium)
    // are both applied correctly
    expect(result.results[0].premium).toBe(231);
  });

  // ============ ROUNDING ============

  it("premium 32.5 G should round up to 33 G (MHPCO's favor)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(33);
  });

  it("payout 0.5 G should round down to 0 G (MHPCO's favor)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 201 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(0);
  });

  // ============ INTEGRATION EXAMPLES ============

  it("newcomer with cursed sword (0 years, no previous contract) should have premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0].premium).toBe(165);
  });

  it("long-standing customer's second contract with cursed sword (3 years, second quote, enchantment 7) should have premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].premium).toBe(160);
  });

  // ============ CLAIM PROCESSING ============

  it("deductible of 100 G should apply per damage event", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Damage: 500, deductible: -100, payout: 400
    expect(result.results[1].payout).toBe(400);
  });

  it("payout should be capped at twice the insurance sum per policy", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 10000 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 1000, cap: 2000
    // Damage: 10000, reimbursement: 10000, deductible: -100, payout before cap: 9900
    // Capped at 2000
    expect(result.results[1].payout).toBe(2000);
    expect(result.results[1].remainingCap).toBe(0);
  });

  it("damage to item with enchantment >= 8 should be reimbursed at 50%", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Damage: 1000, 50% reimbursement: 500, deductible: -100, payout: 400
    expect(result.results[1].payout).toBe(400);
  });

  it("damage to dragon material item should be fully reimbursed", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 4 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Damage: 1000, full reimbursement: 1000, deductible: -100, payout: 900
    expect(result.results[1].payout).toBe(900);
  });

  it("dragon material sword with enchantment 9, damage 1000 G should payout 400 G (50% rule wins, then deductible: 500 - 100)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("dragon material sword with enchantment 5, damage 800 G should payout 700 G (full reimbursement, then deductible: 800 - 100)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300);
  });

  it("steel sword with enchantment 9, damage 1000 G should payout 400 G (50% first, then deductible: 500 - 100)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("regular sword (steel, enchantment 3), damage 500 G should payout 400 G (full minus 100 deductible)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("rune damage 200 G should payout 100 G (full minus 100 deductible)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });

  it("dragon attack damaging sword (500 G) and amulet (300 G) should payout 600 G (100 deductible once per damaged item)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(2600);
  });

  // ============ CAP CALCULATION ============

  it("policy with sword and amulet should have insurance sum 1600 G and cap 3200 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // After a claim of 0 (100 - 100 deductible), remaining cap should be 3200
    expect(result.results[1].remainingCap).toBe(3200);
  });

  it("cursed sword should have cap 2000 G (based on unmodified insurance value 1000, not premium)", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 1000 (based on unmodified value, not premium), cap: 2000
    expect(result.results[1].remainingCap).toBe(2000);
  });

  it("policy with sword and 3 runes (block) should have insurance sum 1750 G (1000 + 3x250), block affects premium only", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 1000 + 3*250 = 1750, cap: 3500
    // After a claim of 0 (100 - 100 deductible), remaining cap should be 3500
    expect(result.results[1].remainingCap).toBe(3500);
  });

  it("sword insured (sum 1000 G, cap 2000 G), first claim 1500 G should payout 1400 G, cap remaining 600 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });

  it("sword insured, second claim 1500 G with 600 G cap remaining should payout 600 G, cap remaining 0 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test1", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "test2", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // ============ MULTIPLE ITEMS OF SAME TYPE ============

  it("policy with two swords should have insurance sum 2000 G and cap 4000 G", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Insurance sum: 2*1000 = 2000, cap: 4000
    expect(result.results[1].remainingCap).toBe(4000);
  });

  it("dragon attack damaging both swords should treat each as separate damage with its own deductible", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Each sword damage has its own deductible: (500 - 100) + (300 - 100) = 400 + 200 = 600
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(3400);
  });

  // ============ FIRST INSURANCE SURCHARGE CLARIFICATION ============

  it("first insurance surcharge should apply to new sword even for long-standing customer on follow-up contract", async () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // First quote: 100 + 10 (first insurance) - 20 (loyalty) + 5 = 95
    // Second quote: 100 + 10 (first insurance) - 20 (loyalty) - 15 (follow-up) + 5 = 80
    expect(result.results[0].premium).toBe(95);
    expect(result.results[1].premium).toBe(80);
  });

  it("each item in a quote should be treated as first insurance regardless of customer history", async () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    // Policy base premium: 100 + 60 = 160
    // First insurance: +10% of 160 = +16
    // Loyalty: -20% of 160 = -32
    // Fee: +5
    // Total: 160 + 16 - 32 + 5 = 149
    expect(result.results[0].premium).toBe(149);
  });

  // ============ MULTI-STEP SCENARIOS ============

  it("quote followed by claim should reference policy by step index", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results.length).toBe(2);
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
  });

  it("multiple quotes and claims should process sequentially", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test1", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 2, incident: { cause: "test2", damages: [{ itemType: "amulet", amount: 300 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results.length).toBe(4);
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[2]).toHaveProperty("premium");
    expect(result.results[3]).toHaveProperty("payout");
  });

  // ============ CLI INPUT/OUTPUT FORMAT ============

  it("CLI should read JSON from stdin and write JSON to stdout", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result).toHaveProperty("results");
    expect(Array.isArray(result.results)).toBe(true);
  });

  it("output should have results array matching steps array length and order", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results.length).toBe(2);
  });

  it("quote result should have premium as integer", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[0]).toHaveProperty("premium");
    expect(typeof result.results[0].premium).toBe("number");
  });

  it("claim result should have payout and remainingCap as integers", async () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = await runCLI(JSON.stringify(input));
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
    expect(typeof result.results[1].payout).toBe("number");
    expect(typeof result.results[1].remainingCap).toBe("number");
  });
});
