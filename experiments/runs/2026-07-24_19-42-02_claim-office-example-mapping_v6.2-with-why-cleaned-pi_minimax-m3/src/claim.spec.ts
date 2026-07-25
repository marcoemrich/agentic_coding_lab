import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";
import { claim } from "./claim.js";

describe("claim", () => {
  // -- standard reimbursement (no special clauses) --
  it(
    "regular sword (steel, enchantment 3), damage 500 → payout 400 G " +
      "(full reimbursement minus 100 G deductible)",
    () => {
      const policy = quote([{ type: "sword", enchantment: 3 }], 0, false);
      const result = claim(policy, [
        { itemType: "sword", amount: 500 },
      ]);
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    },
  );
  it(
    "rune, damage 200 → payout 100 G " +
      "(full reimbursement minus 100 G deductible; runes have no enchantment/material)",
    () => {
      const policy = quote([{ type: "rune" }], 0, false);
      const result = claim(policy, [
        { itemType: "rune", amount: 200 },
      ]);
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(400);
    },
  );

  // -- enchantment threshold vs dragon material --
  it(
    "dragon-material sword, enchantment 9, damage 1000 → payout 400 G " +
      "(both clauses apply; 50% rule wins, then deductible: 500 - 100)",
    () => {
      const policy = quote(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 1000 },
      ]);
      expect(result.payout).toBe(400);
    },
  );
  it(
    "dragon-material sword, enchantment 5, damage 800 → payout 700 G " +
      "(only dragon clause applies: full reimbursement, then deductible: 800 - 100)",
    () => {
      const policy = quote(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 800 },
      ]);
      expect(result.payout).toBe(700);
    },
  );
  it(
    "steel sword, enchantment 9, damage 1000 → payout 400 G " +
      "(only high-enchantment applies: 50% first, then deductible: 500 - 100)",
    () => {
      const policy = quote(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 1000 },
      ]);
      expect(result.payout).toBe(400);
    },
  );
  it(
    "dragon-material sword, enchantment 8, damage 1000 → payout 400 G " +
      "(high-enchantment clause applies, then deductible)",
    () => {
      const policy = quote(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 1000 },
      ]);
      expect(result.payout).toBe(400);
    },
  );

  // -- deductible per damage event --
  it(
    "dragon attack damages sword (500) and amulet (300) → payout 600 G " +
      "(100 G deductible applies once per damaged item: 400 + 200)",
    () => {
      const policy = quote(
        [{ type: "sword" }, { type: "amulet" }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]);
      expect(result.payout).toBe(600);
    },
  );

  // -- multiple items of same type --
  it(
    "two swords policy, two sword damages (each 1500) → each entry has its own deductible " +
      "(each pays 1400, total 2800 — but subject to cap)",
    () => {
      const policy = quote(
        [{ type: "sword" }, { type: "sword" }],
        0,
        false,
      );
      const result = claim(policy, [
        { itemType: "sword", amount: 1500 },
        { itemType: "sword", amount: 1500 },
      ]);
      expect(result.payout).toBe(2800);
    },
  );

  // -- cap exhaustion --
  it(
    "sword insured (cap 2000), first claim 1500 → payout 1400 G, cap remaining 600 G",
    () => {
      const policy = quote([{ type: "sword" }], 0, false);
      const result = claim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    },
  );
  it(
    "sword insured (cap 2000), second claim 1500 (after first paid 1400) → " +
      "payout 600 G (reduced to remaining cap), cap remaining 0 G",
    () => {
      let policy = quote([{ type: "sword" }], 0, false);
      policy = {
        ...policy,
        capRemaining: policy.capRemaining - 1400,
      };
      const result = claim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    },
  );

  // -- rounding in MHPCO's favor (payouts round down) --
  it(
    "payout calculation that yields 350.5 G → final payout 350 G (rounded down) " +
      "(dragon sword, enchantment 8, damage 901: 901 * 0.5 - 100 = 350.5)",
    () => {
      const policy = quote(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        0,
        false,
      );
      const result = claim(policy, [{ itemType: "sword", amount: 901 }]);
      expect(result.payout).toBe(350);
    },
  );
});
