import { describe, it, expect } from "vitest";
import { createPolicy } from "./policy.js";
import type { Item } from "./types.js";

describe("Policy creation", () => {
  describe("Insurance sum (sum of unmodified insurance values)", () => {
    it.todo("two swords: insurance sum 2000 G");
    it.todo("sword + amulet: insurance sum 1600 G");
    it.todo(
      "sword + 3 runes (block): insurance sum 1750 G (block affects premium only, not sum)",
    );
  });

  describe("Cap (= 2 × insurance sum, unmodified)", () => {
    it.todo("two swords: cap 4000 G");
    it.todo("sword + amulet: cap 3200 G");
    it.todo(
      "cursed sword: cap 2000 G (based on unmodified insurance value, not modified premium)",
    );
  });
});
