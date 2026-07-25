import { describe, it, expect } from "vitest";
import { createPolicy, processClaim } from "./claim.js";

describe("Claim - reimbursement and cap", () => {
  it("standard reimbursement: steel sword ench 3 damage 500 -> payout 400; rune damage 200 -> payout 100", () => {
    const swordPolicy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const swordResult = processClaim(swordPolicy, [{ itemType: "sword", amount: 500 }]);
    expect(swordResult.payout).toBe(400);
    expect(swordResult.remainingCap).toBe(1600);
    const runePolicy = createPolicy([{ type: "rune" }]);
    const runeResult = processClaim(runePolicy, [{ itemType: "rune", amount: 200 }]);
    expect(runeResult.payout).toBe(100);
    expect(runeResult.remainingCap).toBe(400);
  });
  it("high-enchantment claim (>=8) 50%: dragon sword ench 9 damage 1000 -> 400; steel sword ench 9 damage 1000 -> 400", () => {
    const dragonPolicy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(processClaim(dragonPolicy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    const steelPolicy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(processClaim(steelPolicy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon material full reimbursement (ench<8): dragon sword ench 5 damage 800 -> 700", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(processClaim(policy, [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("high-enchantment threshold exactly 8: dragon sword ench 8 damage 1000 -> 400 (50% wins over dragon)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(processClaim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("per-item deductible per damage event: steel sword 500 + amulet 300 -> 600 (100 deductible each)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "amulet", material: "silver", enchantment: 2 },
    ]);
    expect(
      processClaim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]).payout
    ).toBe(600);
  });
  it("multiple same-type items: two steel swords, two damages of 500 each -> 800 (separate deductibles)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    expect(
      processClaim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]).payout
    ).toBe(800);
  });
  it("payout rounds down (MHPCO favor): steel sword ench 9 damage 901 -> 350 (350.5 -> 350)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(processClaim(policy, [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("cap exhaustion: two claims of 1500 on a sword -> first payout 1400/remaining 600, second payout 600/remaining 0", () => {
    const basePolicy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const first = processClaim(basePolicy, [{ itemType: "sword", amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const secondPolicy = { ...basePolicy, remainingCap: first.remainingCap };
    const second = processClaim(secondPolicy, [{ itemType: "sword", amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
  it("cursed sword cap based on unmodified insurance value: damage 2000 -> payout 1900/remaining 100 (cap 2000)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]);
    const result = processClaim(policy, [{ itemType: "sword", amount: 2000 }]);
    expect(result.payout).toBe(1900);
    expect(result.remainingCap).toBe(100);
  });
  it("cap unaffected by premium modifiers: sword+3 runes(block) -> cap 3500; sword+amulet -> cap 3200", () => {
    expect(
      createPolicy([{ type: "sword" }, ...Array(3).fill({ type: "rune" })]).remainingCap
    ).toBe(3500);
    expect(createPolicy([{ type: "sword" }, { type: "amulet" }]).remainingCap).toBe(3200);
  });
});
