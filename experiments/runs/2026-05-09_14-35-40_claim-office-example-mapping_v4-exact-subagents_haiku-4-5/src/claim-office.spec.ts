import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claims Office", () => {
  // Quote operation - base functionality
  it("should return 0 premium for empty item list", () => {
    expect(quote([])).toBe(0);
  });
  it("should calculate premium for single standard item (Sword)", () => {
    expect(quote([{ name: "Sword", type: "standard" }])).toBe(10);
  });
  it("should calculate premium for single standard item (Amulet)", () => {
    expect(quote([{ name: "Amulet", type: "standard" }])).toBe(10);
  });
  it("should calculate premium for single component", () => {
    expect(quote([{ name: "Mithril Component", type: "component" }])).toBe(5);
  });
  it("should sum premiums for multiple different items", () => {
    expect(quote([{ name: "Sword", type: "standard" }, { name: "Mithril Component", type: "component" }])).toBe(15);
  });
  it("should apply cursed modifier (+50%) to item premium", () => {
    expect(quote([{ name: "Sword", type: "standard", cursed: true }])).toBe(15);
  });
  it("should apply highly enchanted modifier (+30%) for items with enchantment >= 5", () => {
    expect(quote([{ name: "Sword", type: "standard", enchantment: 5 }])).toBe(13);
  });
  it("should apply first insurance modifier (+10%) to policy premium", () => {
    expect(quote([{ name: "Sword", type: "standard" }], { insurance: true })).toBe(11);
  });
  it("should apply loyalty modifier (-20%) for customers with >= 2 years", () => {
    expect(quote([{ name: "Sword", type: "standard" }], { years: 2 })).toBe(8);
  });
  it("should apply follow-up contract modifier (-15%) to policy premium", () => {
    expect(quote([{ name: "Sword", type: "standard" }], { followUp: true })).toBe(8.5);
  });
  it("should add 5G processing fee to final premium", () => {
    expect(quote([{ name: "Sword", type: "standard" }], { fiveG: true })).toBe(11);
  });
  it("should round premium up in MHPCO's favor", () => {
    expect(quote([{ name: "Sword", type: "standard" }], { years: 1, insurance: true })).toBe(12);
  });

  // Claim operation - base functionality
  it("should deduct 100G deductible from claim payout", () => {
    expect(claim(1000, 500, 1000)).toBe(400);
  });
  it("should cap payout at 2x insurance value", () => {
    expect(claim(5000, 1000, 5000)).toBe(1900);
  });
  it("should apply 50% payout for enchantment >= 8", () => {
    expect(claim(1000, 500, 1000, 8)).toBe(450);
  });
  it("should apply 100% payout for dragon material", () => {
    expect(claim(1000, 500, 1000, undefined, true)).toBe(900);
  });
  it("should process claim for item within insurance value", () => {
    expect(claim(500, 300, 600)).toBe(200);
  });
});
