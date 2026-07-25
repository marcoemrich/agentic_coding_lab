import { describe, it, expect } from "vitest";
import { createPolicy } from "./policy.js";
import { processClaim } from "./claim.js";
import type { Damage, Item } from "./types.js";

describe("Claim processing", () => {
  describe("Standard reimbursement (no special clauses)", () => {
    it.todo(
      "regular sword (steel, enchantment 3), damage 500 G: payout 400 G (full minus deductible)",
    );
    it.todo(
      "rune (no enchantment/material), damage 200 G: payout 100 G (full minus deductible)",
    );
  });

  describe("High-enchantment clause (enchantment >= 8)", () => {
    it.todo(
      "dragon-material sword enchantment 8, damage 1000 G: payout 400 G (50% rule wins, then deductible: 500 - 100)",
    );
    it.todo(
      "steel sword enchantment 9, damage 1000 G: payout 400 G (only high-enchantment clause: 50%, then deductible: 500 - 100)",
    );
  });

  describe("Dragon-material clause (no high enchantment)", () => {
    it.todo(
      "dragon-material sword enchantment 5, damage 800 G: payout 700 G (full reimbursement, then deductible: 800 - 100)",
    );
  });

  describe("Deductible per damaged item", () => {
    it.todo(
      "dragon attack damages sword 500 G + amulet 300 G: payout 600 G (100 G deductible per damaged item)",
    );
  });

  describe("Multiple items of the same type", () => {
    it.todo(
      "policy with 2 swords, two `{itemType: 'sword', ...}` damages: each treated as a separate damage with its own deductible",
    );
  });

  describe("Cap exhaustion", () => {
    it.todo(
      "sword (cap 2000 G), one claim of 1500 G: payout 1400 G, remaining cap 600 G",
    );
    it.todo(
      "sword (cap 2000 G), two successive claims of 1500 G each: first payout 1400 G, second payout 600 G (cap exhausted)",
    );
  });

  describe("Rounding (MHPCO's favor)", () => {
    it.todo("payout 350.5 G rounds DOWN to 350 G");
  });

  describe("Error cases", () => {
    it.todo("damage entry for item not in policy: throws error");
    it.todo("damage entry for unknown item type: throws error");
    it.todo("damage entry with negative amount: throws error");
    it.todo(
      "more damage entries of a given type than items of that type in policy: throws error",
    );
  });
});
