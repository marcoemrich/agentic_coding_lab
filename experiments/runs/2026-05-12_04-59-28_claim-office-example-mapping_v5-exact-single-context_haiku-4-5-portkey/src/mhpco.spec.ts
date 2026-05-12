import { describe, it, expect } from "vitest";
import { calculateQuote, processClaim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Operation", () => {
    it.todo("should calculate 5 G premium for empty items list");
    it.todo("should calculate 105 G premium for single sword");
    it.todo("should calculate 65 G premium for single amulet");
    it.todo("should calculate 85 G premium for single staff");
    it.todo("should calculate 45 G premium for single potion");
    it.todo("should calculate 30 G premium for single component");
    it.todo("should sum premiums for multiple items");
    it.todo("should add 50% surcharge for cursed item");
    it.todo("should add 30% surcharge for high enchantment item");
    it.todo("should apply 20% loyalty discount for long-standing customer");
    it.todo("should apply 10% first insurance surcharge on new items");
    it.todo("should apply 15% follow-up contract discount");
    it.todo("should round premium up in MHPCO's favor");
  });

  describe("Claim Operation", () => {
    it.todo("should calculate payout as damage minus 100 G deductible");
    it.todo("should fully reimburse dragon material damage");
    it.todo("should reimburse high enchantment damage at 50%");
    it.todo("should track remaining cap after claim");
    it.todo("should not exceed cap of 2x insurance value");
  });
});
