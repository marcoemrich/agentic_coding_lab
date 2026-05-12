import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote operation", () => {
    it.todo("should return 5G for empty item list (processing fee only)");
    it.todo("should calculate base premium for single sword");
    it.todo("should calculate base premium for single amulet");
    it.todo("should sum base premiums for multiple different items");
    it.todo("should apply building block discount for exactly 3 alike components");
    it.todo("should not apply building block discount for non-matching components");
  });

  describe("claim operation", () => {
    it.todo("should apply 100G deductible to a single damage claim");
    it.todo("should reimbuse full damage minus deductible for regular item");
    it.todo("should apply insurance cap (2x insurance value) across multiple claims");
    it.todo("should process multiple damages on different items separately");
  });
});
