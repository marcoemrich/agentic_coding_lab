import { describe, it, expect } from "vitest";
import { calculatePremium } from "./mhpco.js";

describe("MHPCO Premium Calculation", () => {
  it.todo("should calculate premium for a single sword without modifiers");
  it.todo("should calculate premium for a single amulet");
  it.todo("should calculate premium for a single staff");
  it.todo("should calculate premium for a single potion");
  it.todo("should calculate premium for a single component");
  it.todo("should calculate premium for 3 matching components (building block)");
  it.todo("should add 50% cursed item surcharge");
  it.todo("should add 30% enchantment surcharge for level >= 5");
  it.todo("should apply 20% loyalty discount for customers with >= 2 years");
  it.todo("should apply 10% initial assessment surcharge for first contract");
  it.todo("should apply 15% discount for second contract");
  it.todo("should apply 15% discount for third and later contracts");
  it.todo("should add 5 G processing fee");
  it.todo("should calculate premium for multiple items with mixed types");
  it.todo("should round all amounts up to whole G in MHPCO's favor");
});
