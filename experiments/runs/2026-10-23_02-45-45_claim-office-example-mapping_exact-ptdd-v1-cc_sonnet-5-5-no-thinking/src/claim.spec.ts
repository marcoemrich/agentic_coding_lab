import { describe, expect, it } from "vitest";
import { ClaimOfficeError } from "./claim-office-error.js";
import { Policy } from "./policy.js";

describe("Standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, cap remaining 1600 G", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(policy.claim([{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("rune, damage 200 G -> payout 100 G (no enchantment or material, no special clause)", () => {
    const policy = new Policy([{ type: "rune" }]);
    expect(policy.claim([{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });

  it("damage below the deductible (50 G) -> payout 0 G (chosen reading: payout is never negative)", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(policy.claim([{ itemType: "sword", amount: 50 }])).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });

});

describe("Special reimbursement clauses", () => {
  it("dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(policy.claim([{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });

  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(policy.claim([{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });

  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement)", () => {
    const policy = new Policy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(policy.claim([{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });

  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(policy.claim([{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });

  it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment 8 threshold)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 7 }]);
    expect(policy.claim([{ itemType: "sword", amount: 1000 }]).payout).toBe(900);
  });

  it("steel sword, enchantment 9, damage 901 G -> payout 350 G (350.5 rounded down)", () => {
    const policy = new Policy([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(policy.claim([{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });

});

describe("Deductible per damage event", () => {
  it("sword damage 500 G + amulet damage 300 G -> payout 600 G (deductible per damaged item)", () => {
    const policy = new Policy([{ type: "sword" }, { type: "amulet" }]);
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(policy.claim(damages).payout).toBe(600);
  });

  it("two swords insured, two sword damages of 500 G -> payout 800 G (own deductible each)", () => {
    const policy = new Policy([{ type: "sword" }, { type: "sword" }]);
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(policy.claim(damages).payout).toBe(800);
  });

  it("two steel swords enchantment 9 insured, two damages of 901 G -> payout 701 G (fractions summed before rounding)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    const policy = new Policy([sword, sword]);
    const damages = [
      { itemType: "sword", amount: 901 },
      { itemType: "sword", amount: 901 },
    ];
    expect(policy.claim(damages).payout).toBe(701);
  });

  it("two swords with enchantment 3 and 9, two sword damages of 800 G -> payout 1000 G (damages matched to swords in policy order; chosen reading)", () => {
    const policy = new Policy([
      { type: "sword", enchantment: 3 },
      { type: "sword", enchantment: 9 },
    ]);
    const damages = [
      { itemType: "sword", amount: 800 },
      { itemType: "sword", amount: 800 },
    ];
    expect(policy.claim(damages).payout).toBe(1000);
  });

});

describe("Cap exhaustion", () => {
  it("sword (cap 2000 G): claim 1500 G -> payout 1400 G, cap remaining 600 G", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(policy.claim([{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });

  it("sword (cap 2000 G): second claim 1500 G -> payout 600 G, cap remaining 0 G", () => {
    const policy = new Policy([{ type: "sword" }]);
    policy.claim([{ itemType: "sword", amount: 1500 }]);
    expect(policy.claim([{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

});

describe("Claim rejection", () => {
  it("amulet damaged while only a sword is insured -> throws ClaimOfficeError", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() => policy.claim([{ itemType: "amulet", amount: 300 }])).toThrow(ClaimOfficeError);
  });

  it("damage with unknown item type broomstick -> throws ClaimOfficeError", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() => policy.claim([{ itemType: "broomstick", amount: 300 }])).toThrow(ClaimOfficeError);
  });

  it("damage amount -200 -> throws ClaimOfficeError", () => {
    const policy = new Policy([{ type: "sword" }]);
    expect(() => policy.claim([{ itemType: "sword", amount: -200 }])).toThrow(ClaimOfficeError);
  });

  it("two sword damages while one sword is insured -> throws ClaimOfficeError (whole claim rejected, cap unchanged)", () => {
    const policy = new Policy([{ type: "sword" }]);
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => policy.claim(damages)).toThrow(ClaimOfficeError);
    expect(policy.remainingCap).toBe(2000);
  });

});
