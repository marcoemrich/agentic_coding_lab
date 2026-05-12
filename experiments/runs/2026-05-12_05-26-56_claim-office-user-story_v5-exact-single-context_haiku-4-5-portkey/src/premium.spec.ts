import { describe, it, expect } from "vitest";
import { calculatePremium } from "./premium.js";

describe("Premium Calculation", () => {
  it.todo("should calculate premium for a single sword with no surcharges");
  it.todo("should calculate premium for a single amulet");
  it.todo("should calculate premium for a single staff");
  it.todo("should calculate premium for a single potion");
  it.todo("should calculate premium for a single component (rune)");
  it.todo("should apply special building block premium for three alike components");
  it.todo("should apply cursed item surcharge (50%)");
  it.todo("should apply enchantment surcharge for level >= 5 (30%)");
  it.todo("should apply both cursed and enchantment surcharges together");
  it.todo("should apply initial assessment surcharge for first insurance (10%)");
  it.todo("should apply loyalty discount for long-standing customers (20% for >= 2 years)");
  it.todo("should apply repeat customer discount (15% for contracts after first)");
  it.todo("should add processing fee (5G) to final premium");
  it.todo("should calculate premium for multiple items in one quote");
  it.todo("should round premium up (MHPCO's favor)");
});
