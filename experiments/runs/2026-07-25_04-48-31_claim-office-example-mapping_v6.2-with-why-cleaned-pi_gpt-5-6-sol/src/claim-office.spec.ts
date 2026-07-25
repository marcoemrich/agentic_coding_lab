import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const scenario = (steps: any[], yearsWithMHPCO = 0) => ({ customer: { yearsWithMHPCO }, steps });
const quote = (items: any[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: any[]) => ({
  op: "claim" as const, policy, incident: { cause: "test incident", damages },
});
const repeated = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));

describe("MHPCO claim office", () => {
  it("charges only the 5 G processing fee for an empty item list", () => {
    expect(processScenario(scenario([quote([])]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price-list base premiums for sword, amulet, staff, and potion -- 100, 60, 80, and 40 G", () => {
    expect(processScenario(scenario([
      quote([{ type: "sword" }]), quote([{ type: "amulet" }]),
      quote([{ type: "staff" }]), quote([{ type: "potion" }]),
    ]))).toEqual({ results: [{ premium: 115 }, { premium: 62 }, { premium: 81 }, { premium: 43 }] });
  });
  it("charges 50 G base premium for 2 runes", () => {
    expect(processScenario(scenario([quote(repeated("rune", 2))]))).toEqual({ results: [{ premium: 60 }] });
  });
  it("charges the special 60 G block premium for exactly 3 runes", () => {
    expect(processScenario(scenario([quote(repeated("rune", 3))]))).toEqual({ results: [{ premium: 71 }] });
  });
  it("charges 100 G base premium for 4 runes because a block requires exactly 3", () => {
    expect(processScenario(scenario([quote(repeated("rune", 4))]))).toEqual({ results: [{ premium: 115 }] });
  });
  it("charges 175 G base premium for 7 runes", () => {
    expect(processScenario(scenario([quote(repeated("rune", 7))]))).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block -- 75 G base premium", () => {
    expect(processScenario(scenario([quote([...repeated("rune", 2), { type: "moonstone" }])]))).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two separate blocks -- 120 G base premium", () => {
    expect(processScenario(scenario([quote([...repeated("rune", 3), ...repeated("moonstone", 3)])]))).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the affected sword -- 210 G before policy modifiers and fee", () => {
    expect(processScenario(scenario([quote([{ type: "sword", cursed: true }, { type: "amulet" }])]))).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(processScenario(scenario([quote([{ type: "sword" }])], 2))).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    expect(processScenario(scenario([quote([{ type: "sword", cursed: true, enchantment: 5 }])]))).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(processScenario(scenario([quote([{ type: "sword", cursed: true, enchantment: 4 }])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    expect(processScenario(scenario([quote(repeated("rune", 7))])).results[0]).toEqual({ premium: 198 });
  });
  it("pays 400 G for regular sword damage of 500 G after one deductible", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])]))).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for rune damage of 200 G after one deductible", () => {
    expect(processScenario(scenario([quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])]))).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("pays 600 G when sword and amulet damages each have their own deductible", () => {
    expect(processScenario(scenario([quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])]))).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("pays 400 G for dragon sword enchantment 8 damage of 1000 G because the 50 percent clause wins", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon sword enchantment 9 damage of 1000 G", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon sword enchantment 5 damage of 800 G", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])])).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel sword enchantment 9 damage of 1000 G", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a raw payout of 350.5 G down to 350 G", () => {
    expect(processScenario(scenario([quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }])])).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("gives two insured swords a 4000 G cap and treats two damage entries separately", () => {
    expect(processScenario(scenario([quote(repeated("sword", 2)), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])])).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => processScenario(scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 10 }, { itemType: "sword", amount: 10 }])]))).toThrow(/not covered/);
  });
  it("uses a 3200 G cap for a sword and amulet policy", () => {
    expect(processScenario(scenario([quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])])).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("uses an unmodified 2000 G cap for a cursed sword", () => {
    expect(processScenario(scenario([quote([{ type: "sword", cursed: true }]), claim(0, [])])).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("uses a 3500 G cap for a sword and 3-rune block", () => {
    expect(processScenario(scenario([quote([{ type: "sword" }, ...repeated("rune", 3)]), claim(0, [])])).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across two 1500 G claims -- payouts 1400 then 600", () => {
    expect(processScenario(scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 1500 }]), claim(0, [{ itemType: "sword", amount: 1500 }])])).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects an unknown quote item type without producing results", () => {
    expect(() => processScenario(scenario([quote([{ type: "broomstick" }])]))).toThrow(/Unknown item type/);
  });
  it("rejects damage to a known item type absent from the policy", () => {
    expect(() => processScenario(scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 200 }])]))).toThrow(/not covered/);
  });
  it("rejects an unknown damage item type", () => {
    expect(() => processScenario(scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "broomstick", amount: 200 }])]))).toThrow(/Unknown item type/);
  });
  it("rejects a negative damage amount", () => {
    expect(() => processScenario(scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])]))).toThrow(/negative/);
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(processScenario(scenario([quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    expect(processScenario(scenario([quote([]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])], 3)).results[1]).toEqual({ premium: 160 });
  });
  it("returns quote and claim results in step order with the normative field names", () => {
    expect(processScenario(scenario([quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]), claim(0, [{ itemType: "amulet", amount: 200 }])], 5))).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
