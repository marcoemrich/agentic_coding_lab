import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  quote,
  itemBasePremium,
  itemPremium,
  insuranceSum,
  createPolicy,
  claim,
} from "./claim-office.js";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(input: string) {
  return spawnSync("node", ["--import", "tsx", cliPath], {
    input,
    encoding: "utf8",
  });
}

describe("Claim Office", () => {
  // ===== Premium from item base values =====
  it("should quote a single sword -- base premium 100 G", () => {
    expect(
      itemBasePremium([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ])
    ).toBe(100);
  });
  it("should quote a single amulet -- base premium 60 G", () => {
    expect(
      itemBasePremium([
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ])
    ).toBe(60);
  });
  it("should quote a single staff -- base premium 80 G", () => {
    expect(
      itemBasePremium([
        { type: "staff", material: "oak", enchantment: 0, cursed: false },
      ])
    ).toBe(80);
  });
  it("should quote a single potion -- base premium 40 G", () => {
    expect(
      itemBasePremium([
        { type: "potion", material: "red", enchantment: 0, cursed: false },
      ])
    ).toBe(40);
  });
  it("should quote a single rune -- base premium 25 G", () => {
    expect(itemBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("should quote a single moonstone -- base premium 25 G", () => {
    expect(itemBasePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("should quote an empty item list -- premium 5 G (only the fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // ===== Building block of 3 alike components =====
  it("should quote 2 runes -- base premium 50 G", () => {
    expect(itemBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("should quote 3 runes -- base premium 60 G (block applies)", () => {
    expect(itemBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("should quote 4 runes -- base premium 100 G (no block, requires exactly 3)", () => {
    expect(itemBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("should quote 7 runes -- base premium 175 G", () => {
    expect(itemBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("should quote 2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    expect(itemBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("should quote 3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    expect(itemBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(120);
  });

  // ===== Modifier scope on multi-item policies =====
  it("should apply cursed surcharge to cursed item only -- cursed sword + plain amulet -> 210 G before fee", () => {
    expect(
      itemPremium([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ])
    ).toBe(210);
  });

  // ===== Modifier thresholds =====
  it("should apply loyalty discount at exactly 2 years with MHPCO", () => {
    expect(
      quote(
        { yearsWithMHPCO: 2 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
      )
    ).toBe(95);
  });
  it("should apply high-enchantment surcharge at exactly enchantment 5", () => {
    expect(
      itemPremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])
    ).toBe(130);
  });
  it("should apply both curse and high-enchantment surcharges when cursed with exactly enchantment 5", () => {
    expect(
      itemPremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])
    ).toBe(180);
  });
  it("should not apply high-enchantment surcharge at enchantment 4", () => {
    expect(
      itemPremium([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])
    ).toBe(100);
  });
  it("should not apply curse surcharge when not cursed", () => {
    expect(
      itemPremium([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])
    ).toBe(100);
  });

  // ===== Integration: newcomer with a cursed sword =====
  it("should quote newcomer cursed sword (0 years, no prior contract, steel, enchantment 3) -- premium 165 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }]
      )
    ).toBe(165);
  });

  // ===== Integration: long-standing customer's second contract =====
  it("should quote 3-year customer second contract cursed sword (enchantment 7) -- premium 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1
      )
    ).toBe(160);
  });

  // ===== Multiple items of same type =====
  it("should compute insurance sum and cap for two swords -- sum 2000 G, cap 4000 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ]);
    expect(p.insuranceSum).toBe(2000);
    expect(p.remainingCap).toBe(4000);
  });

  // ===== Cap exhaustion =====
  it("should compute insurance sum and cap for a sword + amulet -- sum 1600 G, cap 3200 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ]);
    expect(p.insuranceSum).toBe(1600);
    expect(p.remainingCap).toBe(3200);
  });
  it("should compute cap based on unmodified insurance value -- cursed sword cap 2000 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.remainingCap).toBe(2000);
  });
  it("should compute insurance sum for a sword + 3 runes block -- sum 1750 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(p.insuranceSum).toBe(1750);
    expect(p.remainingCap).toBe(3500);
  });
  it("should pay out first claim 1400 G leaving cap 600 G, then second claim 600 G leaving cap 0 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ]);
    const first = claim(p, { damages: [{ itemType: "sword", amount: 1500 }] });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    p.remainingCap = first.remainingCap;
    const second = claim(p, { damages: [{ itemType: "sword", amount: 1500 }] });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // ===== Rounding in MHPCO's favor =====
  it("should round premium 197.5 G up -- 198 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ]
      )
    ).toBe(198);
  });
  it("should round payout 350.5 G down -- 350 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
    ]);
    p.remainingCap = 2000;
    const result = claim(p, { damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // ===== Claim: standard reimbursement (no special clauses) =====
  it("should pay out regular steel sword (enchantment 3), damage 500 G -- payout 400 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ]);
    expect(claim(p, { damages: [{ itemType: "sword", amount: 500 }] }).payout).toBe(400);
  });
  it("should pay out a rune, damage 200 G -- payout 100 G", () => {
    const p = createPolicy([{ type: "rune" }]);
    expect(claim(p, { damages: [{ itemType: "rune", amount: 200 }] }).payout).toBe(100);
  });

  // ===== Deductible per damage event =====
  it("should apply deductible once per damaged item -- dragon attack both sword (500 G) and amulet (300 G) -> payout 600 G", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    expect(
      claim(p, {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      }).payout
    ).toBe(600);
  });

  // ===== Enchantment threshold vs. dragon material =====
  it("should pay out dragon-material sword (enchantment 9), damage 1000 G -- payout 400 G (50% wins)", () => {
    const p = createPolicy([
      { type: "sword", material: "dragon", enchantment: 9, cursed: false },
    ]);
    expect(claim(p, { damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });
  it("should pay out dragon-material sword (enchantment 5), damage 800 G -- payout 700 G (full reimbursement)", () => {
    const p = createPolicy([
      { type: "sword", material: "dragon", enchantment: 5, cursed: false },
    ]);
    expect(claim(p, { damages: [{ itemType: "sword", amount: 800 }] }).payout).toBe(700);
  });
  it("should pay out steel sword (enchantment 9), damage 1000 G -- payout 400 G (50% only)", () => {
    const p = createPolicy([
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
    ]);
    expect(claim(p, { damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });

  // ===== Modifier thresholds for claims =====
  it("should pay out dragon-material sword with exactly enchantment 8, damage 1000 G -- payout 400 G", () => {
    const p = createPolicy([
      { type: "sword", material: "dragon", enchantment: 8, cursed: false },
    ]);
    expect(claim(p, { damages: [{ itemType: "sword", amount: 1000 }] }).payout).toBe(400);
  });

  // ===== Edge cases: errors =====
  it("should exit with non-zero status and stderr for a quote with an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const res = runCli(JSON.stringify(scenario));
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
    expect(res.stdout.trim()).toBe("");
  });
  it("should exit with non-zero status and stderr for a claim on an item not part of the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
    const res = runCli(JSON.stringify(scenario));
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });
  it("should exit with non-zero status and stderr for a claim with a damage amount of -200", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const res = runCli(JSON.stringify(scenario));
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });
  it("should exit with non-zero status and stderr for a claim with more damages of a type than insured", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    };
    const res = runCli(JSON.stringify(scenario));
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });
});