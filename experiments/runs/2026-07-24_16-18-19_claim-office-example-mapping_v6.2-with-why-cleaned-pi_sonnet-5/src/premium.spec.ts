import { describe, it, expect } from "vitest";
import {
  calculatePremium,
  calculateComponentsBasePremium,
  roundUpToWholeGold,
} from "./premium.js";

describe("Premium calculation", () => {
  // --- Simplest cases ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // --- Base premiums for main items (no modifiers, newcomer) ---
  it("single sword, newcomer, no modifiers -> base 100 G + 10% first insurance + 5 G fee = 115 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }])
    ).toBe(115);
  });
  it("single amulet, newcomer, no modifiers -> base 60 G + 10% first insurance + 5 G fee = 71 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])
    ).toBe(71);
  });
  it("single staff, newcomer, no modifiers -> base 80 G + 10% first insurance + 5 G fee = 93 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "staff" }])
    ).toBe(93);
  });
  it("single potion, newcomer, no modifiers -> base 40 G + 10% first insurance + 5 G fee = 49 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "potion" }])
    ).toBe(49);
  });

  // --- Building block of 3 alike components ---
  it("2 runes -> 50 G base premium (no block)", () => {
    expect(
      calculateComponentsBasePremium([{ type: "rune" }, { type: "rune" }])
    ).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(
      calculateComponentsBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    expect(
      calculateComponentsBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    expect(
      calculateComponentsBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(175);
  });

  // --- "Alike" components: same type only, not same family ---
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(
      calculateComponentsBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ])
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    expect(
      calculateComponentsBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ])
    ).toBe(120);
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years with MHPCO -> loyalty discount applies (100 base - 20 loyalty + 10 first insurance = 90, +5 fee = 95)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 2 }, [{ type: "sword" }])
    ).toBe(95);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (100 base + 30 high enchantment + 10 first insurance = 140, +5 fee = 145)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 5 },
      ])
    ).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 -> both curse and high-enchantment surcharges apply (100 base + 50 curse + 30 high enchantment + 10 first insurance = 190, +5 fee = 195)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 5, cursed: true },
      ])
    ).toBe(195);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge (100 base + 10 first insurance = 110, +5 fee = 115)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 4 },
      ])
    ).toBe(115);
  });
  it("uncursed sword with enchantment 4 -> curse surcharge does not apply (100 base + 10 first insurance = 110, +5 fee = 115)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 4, cursed: false },
      ])
    ).toBe(115);
  });

  // --- Modifier scope on multi-item policies ---
  it("policy with cursed sword (base 100) and plain amulet (base 60) -> item-specific curse surcharge (50 G) applies only to sword's base, policy base premium 160 G, total before fee 210 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ])
    ).toBe(231);
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (100 base + 50 curse + 10 first insurance = 160, +5 fee = 165)", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ])
    ).toBe(165);
  });
  it("long-standing customer's second contract with a cursed sword (steel, enchantment 7) -> premium 160 G (100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155, +5 fee = 160)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { isFollowUpContract: true }
      )
    ).toBe(160);
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G -> final premium rounds up to 198 G", () => {
    expect(roundUpToWholeGold(197.5)).toBe(198);
  });
});
