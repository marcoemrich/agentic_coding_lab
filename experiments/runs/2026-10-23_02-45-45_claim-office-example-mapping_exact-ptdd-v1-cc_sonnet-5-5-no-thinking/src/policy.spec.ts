import { describe, expect, it } from "vitest";
import { Policy } from "./policy.js";

describe("Insurance sum and cap", () => {
  it("sword -> insurance sum 1000 G, cap 2000 G", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.remainingCap).toBe(2000);
  });

  it("amulet -> insurance sum 600 G", () => {
    expect(new Policy([{ type: "amulet" }]).insuranceSum).toBe(600);
  });

  it("staff -> insurance sum 800 G", () => {
    expect(new Policy([{ type: "staff" }]).insuranceSum).toBe(800);
  });

  it("potion -> insurance sum 400 G", () => {
    expect(new Policy([{ type: "potion" }]).insuranceSum).toBe(400);
  });

  it("2 runes -> insurance sum 500 G (250 G per component)", () => {
    expect(new Policy([{ type: "rune" }, { type: "rune" }]).insuranceSum).toBe(500);
  });

  it("2 moonstones -> insurance sum 500 G (250 G per component)", () => {
    expect(new Policy([{ type: "moonstone" }, { type: "moonstone" }]).insuranceSum).toBe(500);
  });

  it("2 swords -> insurance sum 2000 G, cap 4000 G", () => {
    const policy = new Policy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });

  it("sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy = new Policy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it("cursed sword -> cap 2000 G (premium modifiers do not raise the cap)", () => {
    expect(new Policy([{ type: "sword", cursed: true }]).remainingCap).toBe(2000);
  });

  it("sword + 3 runes -> insurance sum 1750 G (block discount affects premium only)", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(new Policy(items).insuranceSum).toBe(1750);
  });

});
