// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { quote, claim, insuranceSum } from "./claim-office.js";

function runCli(input: unknown) {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  return spawnSync("npx", ["tsx", "src/cli.ts"], {
    cwd: projectRoot,
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO Claim Office", () => {
  // --- Empty / processing fee baseline ---
  it("quote with empty item list returns premium 5 (only the processing fee)", () => {
    expect(quote({ items: [], customerYears: 0, previousContracts: 0 })).toBe(5);
  });

  // --- Base premiums for main items (with processing fee) ---
  it("quote for a single plain sword returns premium 105 (100 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "sword" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(105);
  });
  it("quote for a single plain amulet returns premium 65 (60 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "amulet" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(65);
  });
  it("quote for a single plain staff returns premium 85 (80 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "staff" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(85);
  });
  it("quote for a single plain potion returns premium 45 (40 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "potion" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(45);
  });

  // --- Components and block-of-3 rule ---
  it("quote for 2 runes returns premium 55 (50 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(55);
  });
  it("quote for 3 runes returns premium 65 (60 base block + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(65);
  });
  it("quote for 4 runes returns premium 105 (100 base + 5 fee, no block — block requires exactly 3)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(105);
  });
  it("quote for 7 runes returns premium 180 (175 base + 5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(180);
  });
  it("quote for 2 runes + 1 moonstone returns premium 80 (75 base + 5 fee, no block: different types)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(80);
  });
  it("quote for 3 runes + 3 moonstones returns premium 125 (120 base + 5 fee, two separate blocks)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(125);
  });

  // --- Item-specific modifiers ---
  it("quote for a cursed sword (steel, ench 3) for newcomer (0 yrs, no previous) returns premium 165", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(165);
  });
  it("quote for a sword with enchantment exactly 5 applies the high-enchantment surcharge", () => {
    expect(
      quote({
        items: [{ type: "sword", enchantment: 5 }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(145);
  });
  it("quote for a sword with enchantment 4 does not apply the high-enchantment surcharge", () => {
    expect(
      quote({
        items: [{ type: "sword", enchantment: 4 }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(105);
  });
  it("quote for a cursed sword with enchantment 5 applies both curse and high-enchantment surcharges", () => {
    expect(
      quote({
        items: [{ type: "sword", cursed: true, enchantment: 5 }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(195);
  });

  // --- Policy-wide modifiers ---
  it("quote for a customer with exactly 2 years applies the 20% loyalty discount", () => {
    expect(
      quote({
        items: [{ type: "sword" }],
        customerYears: 2,
        previousContracts: 0,
      }),
    ).toBe(85);
  });
  it("first quote in a scenario applies the 10% first-insurance surcharge", () => {
    expect(
      quote({
        items: [{ type: "sword", cursed: true }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(165);
  });
  it("second quote in a scenario applies the 15% follow-up contract discount", () => {
    expect(
      quote({
        items: [{ type: "sword" }],
        customerYears: 0,
        previousContracts: 1,
      }),
    ).toBe(90);
  });

  // --- Modifier scope on multi-item policies ---
  it("quote for cursed sword + plain amulet: curse surcharge is 50G (50% of cursed item's base, not policy total) → 215G (210 + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        customerYears: 0,
        previousContracts: 0,
      }),
    ).toBe(215);
  });

  // --- Rounding ---
  it("premium calculation yielding 92 (60 base + 30 curse + 6 first-ins - 9 followup + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "amulet", cursed: true }],
        customerYears: 0,
        previousContracts: 1,
      }),
    ).toBe(92);
  });

  // --- Integration: long-standing customer's second contract ---
  it("quote for cursed sword (steel, ench 7) for 3-yr customer's second quote returns premium 160", () => {
    expect(
      quote({
        items: [{ type: "sword", cursed: true, enchantment: 7 }],
        customerYears: 3,
        previousContracts: 1,
      }),
    ).toBe(160);
  });

  // --- Claim: standard reimbursement ---
  it("claim on regular sword (steel, ench 3) with damage 500 → payout 400 (full minus 100 deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim on a rune (insurance 250, no enchantment/material) with damage 200 → payout 100 (full minus deductible)", () => {
    const result = claim({
      items: [{ type: "rune" }],
      remainingCap: 500,
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  // --- Claim: deductible per damage event ---
  it("claim with damage to insured sword (500) and insured amulet (300) → payout 600 (deductible applies once per item)", () => {
    const result = claim({
      items: [{ type: "sword" }, { type: "amulet" }],
      remainingCap: 3200,
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // --- Claim: enchantment threshold ---
  it("claim on steel sword ench 9, damage 1000 → payout 400 (50% then deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // --- Claim: dragon material ---
  it("claim on dragon-material sword ench 5, damage 800 → payout 700 (full reimbursement then deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  // --- Claim: enchantment vs dragon material (50% rule wins) ---
  it("claim on dragon-material sword ench 9, damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim on dragon-material sword ench 8, damage 1000 → payout 400 (high-enchantment clause applies, then deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // --- Claim: payout rounding ---
  it("payout calculation yielding 300.5 rounds down to 300 (in MHPCO's favor)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 8 }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 801 }],
    });
    expect(result.payout).toBe(300);
  });

  // --- Multiple items of the same type ---
  it("policy covering two swords has insurance sum 2000 and cap 4000", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const sum = insuranceSum(items);
    expect(sum).toBe(2000);
    expect(sum * 2).toBe(4000);
  });
  it("dragon attack damaging both swords (two sword entries) treats each as separate damage with own deductible", () => {
    const result = claim({
      items: [{ type: "sword" }, { type: "sword" }],
      remainingCap: 4000,
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });

  // --- Cap ---
  it("policy covering sword + amulet has insurance sum 1600 and cap 3200", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const sum = insuranceSum(items);
    expect(sum).toBe(1600);
    expect(sum * 2).toBe(3200);
  });
  it("cap is based on unmodified insurance value: cursed sword has cap 2000 regardless of premium modifiers", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(insuranceSum(items)).toBe(1000);
    expect(insuranceSum(items) * 2).toBe(2000);
  });
  it("policy covering sword + 3 runes has insurance sum 1750 (block discount affects premium only, not insurance sum)", () => {
    const items = [
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000): first claim 1500 → payout 1400, remaining cap 600", () => {
    const result = claim({
      items: [{ type: "sword" }],
      remainingCap: 2000,
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword (cap 2000): second claim 1500 after first → payout 600, remaining cap 0 (reduced to remaining cap)", () => {
    const result = claim({
      items: [{ type: "sword" }],
      remainingCap: 600,
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // --- Error cases ---
  it("quote with unknown item type causes the CLI to exit with non-zero status and error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(result.stdout).not.toContain("results");
  });
  it("claim referencing a damage entry whose item is not in the policy causes non-zero exit and stderr error", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toContain("results");
  });
  it("claim with more damage entries of a type than insured (e.g. two sword damages, one sword) causes non-zero exit", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toContain("results");
  });
  it("claim with a damage entry of negative amount causes non-zero exit and stderr error", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toContain("results");
  });
});
