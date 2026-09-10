import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

describe("MHPCO Claim Office — quote", () => {
  // Edge case: empty
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0).premium).toBe(5);
  });

  // Price list (base premiums), newcomer flags off, plus fee
  it("single sword (0 years, first contract) → 100 base +10% first insurance +5 fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0).premium).toBe(115);
  });
  it("single amulet → 60 base +10% first insurance + 5 fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0).premium).toBe(71);
  });
  it("single staff → 80 base +10% + 5 fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0).premium).toBe(93);
  });
  it("single potion → 40 base +10% + 5 fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0).premium).toBe(49);
  });

  // Components and building blocks
  it("2 runes → base premium 50 G (55 + 5 = 60 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0).premium).toBe(60);
  });
  it("3 runes → block base premium 60 G (66 + 5 = 71 G)", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0).premium).toBe(71);
  });
  it("4 runes → base premium 100 G, no block (110 + 5 = 115 G)", () => {
    const runes = Array(4).fill({ type: "rune" });
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0).premium).toBe(115);
  });
  it("7 runes → base premium 175 G (192.5 → rounded up 193 + 5 = 198 G)", () => {
    const runes = Array(7).fill({ type: "rune" });
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0).premium).toBe(198);
  });
  it("2 runes + 1 moonstone → base premium 75 G, no block for different types (82.5 → 83 + 5 = 88 G)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(88);
  });
  it("3 runes + 3 moonstones → base premium 120 G, two separate blocks (132 + 5 = 137 G)", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(137);
  });

  // Item-specific modifiers
  it("newcomer cursed steel sword enchantment 3 → 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(165);
  });
  it("sword with enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 first + 5 fee = 145 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(145);
  });
  it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 first + 5 fee = 195 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(195);
  });
  it("sword with enchantment 4, not cursed → no surcharge (115 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(115);
  });
  it("cursed sword with enchantment 4 → only curse surcharge (165 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(165);
  });
  it("cursed sword + plain amulet → cursed surcharge only on the sword: 160 base + 50 curse + 16 first + 5 fee = 231 G", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 1, cursed: true },
      { type: "amulet", material: "silver", enchantment: 1, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(231);
  });

  // Policy-wide modifiers
  it("customer with exactly 2 years → loyalty discount applies (sword: 100 − 20 + 10 = 90 + 5 = 95 G)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0).premium).toBe(95);
  });
  it("customer with 1 year → no loyalty discount (sword 115 G)", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0).premium).toBe(115);
  });
  it("second contract → 15% follow-up discount and first insurance still applies (sword, 0 years: 100 + 10 − 15 = 95 + 5 = 100 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1).premium).toBe(100);
  });
  it("long-standing customer's second contract with cursed sword enchantment 7 → 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1).premium).toBe(160);
  });

  // Rounding
  it("premium with a fractional result is rounded up (single rune: 25 + 2.5 first + 5 fee = 32.5 → 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0).premium).toBe(33);
  });

  // Insurance sum / cap
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).insuranceSum).toBe(2000);
  });
  it("policy with sword and amulet → insurance sum 1600 G, cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).insuranceSum).toBe(1600);
  });
  it("cursed sword → cap 2000 G based on unmodified insurance value (insurance sum 1000, premium 165)", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0);
    expect(result.insuranceSum).toBe(1000);
    expect(result.premium).toBe(165);
  });
  it("sword and 3 runes → insurance sum 1750 G; block discount does not affect insurance sum", () => {
    const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).insuranceSum).toBe(1750);
  });

  // Errors
  it("unknown item type (broomstick) → throws an error", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(/broomstick/);
  });
});

describe("MHPCO Claim Office — claim", () => {
  it("regular steel sword enchantment 3, damage 500 → payout 400 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("rune damage 200 → payout 100 G (no special clause for components)", () => {
    const policy = { items: [{ type: "rune" }], insuranceSum: 250 };
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident).payout).toBe(100);
  });
  it("steel sword enchantment 9, damage 1000 → payout 400 G (50% then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 9 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon sword enchantment 5, damage 800 → payout 700 G (full reimbursement then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });
  it("dragon sword enchantment 9, damage 1000 → payout 400 G (50% rule wins)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon sword with exactly enchantment 8, damage 1000 → payout 400 G", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per damaged item)", () => {
    const policy = { items: [{ type: "sword" }, { type: "amulet" }], insuranceSum: 1600 };
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("two swords insured, two sword damage entries → each has its own deductible (500 + 300 → 600 G)", () => {
    const policy = { items: [{ type: "sword" }, { type: "sword" }], insuranceSum: 2000 };
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });
  it("payout yielding 350.5 G → rounded down to 350 G (enchantment 9 sword, damage 901)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 9 }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident).payout).toBe(350);
  });
  it("first claim of 1500 on a sword → payout 1400 G, remainingCap 600 G", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second claim of 1500 on the same sword → payout 600 G, remainingCap 0 G", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident);
    const second = claim(first.policy, incident);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
  it("more sword damage entries than swords insured → throws an error", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(/sword/);
  });
  it("damage to an item not in the policy (amulet when only sword insured) → throws an error", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow(/amulet/);
  });
  it("damage to an item with unknown type → throws an error", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow(/broomstick/);
  });
  it("damage entry with negative amount → throws an error", () => {
    const policy = { items: [{ type: "sword" }], insuranceSum: 1000 };
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow(/-200/);
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("reads scenario JSON from stdin and writes results (quote then claim) to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("unknown item type in quote → exits non-zero, writes error to stderr, no results on stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
  it("claim with damage entry not covered by the policy → exits non-zero with error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).toBe("");
  });
});
