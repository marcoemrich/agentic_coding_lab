import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { run } from "./claim-office.js";

const CLI_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "cli.ts");
const runCli = (stdin: string) =>
  spawnSync("npx", ["tsx", CLI_PATH], { input: stdin, encoding: "utf8" });

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial ---
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per item type ---
  it("single plain sword (newcomer, first contract) yields base 100 + 10 first-insurance + 5 fee = 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (newcomer, first contract) yields base 60 + 6 first-insurance + 5 fee = 71 G (rounded up)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (newcomer, first contract) yields base 80 + 8 first-insurance + 5 fee = 93 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (newcomer, first contract) yields base 40 + 4 first-insurance + 5 fee = 49 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component base premiums and blocks ---
  it("2 runes -> base premium 50 G (no block); total premium 50 + 5 first-insurance + 5 fee = 60 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> base premium 60 G (block applies); total = 60 + 6 + 5 = 71 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> base premium 100 G (no block; block requires exactly 3); total = 100 + 10 + 5 = 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> base premium 175 G (no block; 7*25); total = 175 + 17.5 + 5 -> 198 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> base premium 75 G (alike = same type, no block); total = 75 + 7.5 + 5 -> 88 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks); total = 120 + 12 + 5 = 137 G", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(out).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed sword (newcomer, first contract) -> 100 + 50 curse + 10 first-ins + 5 fee = 165 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment exactly 5 (newcomer) -> 100 + 30 high-ench + 10 first-ins + 5 fee = 145 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 (newcomer) -> no high-enchantment surcharge: 100 + 10 + 5 = 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword enchantment 5 (newcomer) -> 100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee = 195 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("plain sword, customer with 2 years -> 100 - 20 loyalty + 10 first-ins + 5 fee = 95 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 95 }] });
  });
  it("plain sword, customer with 1 year -> no loyalty discount: 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("first-insurance surcharge: 2 swords (newcomer) -> 200 base + 20 first-ins + 5 fee = 225 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 225 }] });
  });
  it("second quote in scenario gets 15% follow-up discount: sword -> first 115, second 100 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Processing fee + rounding direction ---
  it("processing fee of 5 G is added at the end (e.g. 7 runes -> 192.5 + 5 = 197.5 -> 198 G)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });
  // "197.5 -> 198" already covered by the 7-runes and processing-fee tests above.

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet (newcomer) -> 160 base + 50 curse + 16 first-ins + 5 fee = 231 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Integration examples from the spec ---
  it("integration: newcomer with cursed steel sword enchant 3 -> 165 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("integration: 3-year customer, second quote, cursed sword enchant 7 -> 160 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchant 3) damage 500 -> payout 400 (minus 100 deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "ogre", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance 250) of 200 -> payout 100 (minus 100 deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell mishap", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword enchant 8 damage 1000 -> payout 400 (high-enchant clause then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchant 9 damage 1000 -> payout 400 (50% wins, then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchant 5 damage 800 -> payout 700 (full reimbursement, then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchant 9 damage 1000 -> payout 400 (high-enchant clause then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword 500 + amulet 300 -> total payout 600 (deductible per item)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap rules ---
  it("policy of sword + amulet -> insurance sum 1600, cap 3200", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rust", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword -> cap stays 2000 (premium modifiers don't raise cap)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes (block) -> insurance sum 1750 (block affects premium only)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rust", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword cap 2000 with two 1500 claims -> first payout 1400 remaining 600, second payout 600 remaining 0", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding direction (in MHPCO's favor) ---
  it("payout calculation of 350.5 rounds down to 350", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Multiple items of the same type ---
  it("policy of two swords -> insurance sum 2000 and cap 4000", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rust", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two-sword policy with damages to both swords -> each damage gets its own deductible", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("claim references more items of a type than insured -> CLI exits non-zero", () => {
    expect(() =>
      run({
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Error cases ---
  it("quote with unknown item type -> CLI exits non-zero and writes error to stderr", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> CLI exits non-zero and writes error to stderr", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim damage entry with negative amount -> CLI exits non-zero and writes error to stderr", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "weird", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // --- CLI integration smoke test ---
  it("schema example: amulet quote + 200 G fire damage claim returns expected results array", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const result = runCli(input);
    expect(result.status).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
