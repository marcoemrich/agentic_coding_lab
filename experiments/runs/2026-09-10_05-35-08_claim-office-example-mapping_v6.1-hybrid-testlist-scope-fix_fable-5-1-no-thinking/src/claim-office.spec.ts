import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

// Note: every quote carries the 10 % first-insurance surcharge and the 5 G fee.
// A newcomer (0 years) quoting a single item therefore pays ceil(base * 1.1 + 5).

const itemsOf = (type: string, count: number): object[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number): object[] => itemsOf("rune", count);

const quotePremium = (items: object[], yearsWithMHPCO = 0): number =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0].premium;

describe("MHPCO Claim Office — quote", () => {
  describe("base premiums", () => {
    it("should charge only the processing fee for an empty item list — 5 G", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
      expect(runScenario(scenario).results).toEqual([{ premium: 5 }]);
    });
    it("should quote a sword (base 100 G) — 115 G", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      expect(runScenario(scenario).results).toEqual([{ premium: 115 }]);
    });
    it("should quote an amulet (base 60 G) — 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("should quote a staff (base 80 G) — 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("should quote a potion (base 40 G) — 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
    it("should quote a single rune component (base 25 G) — 33 G (32.5 rounded up)", () => {
      expect(quotePremium([{ type: "rune" }])).toBe(33);
    });
  });

  describe("building block of 3 alike components", () => {
    it("should quote 2 runes without block (base 50 G) — 60 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("should quote 3 runes as a block (base 60 G) — 71 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("should quote 4 runes without block, block requires exactly 3 (base 100 G) — 115 G", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("should quote 7 runes without block (base 175 G) — 198 G (197.5 rounded up in MHPCO's favor)", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("should not form a block from 2 runes + 1 moonstone, different types (base 75 G) — 88 G", () => {
      expect(quotePremium([...runes(2), { type: "moonstone" }])).toBe(88);
    });
    it("should form two separate blocks from 3 runes + 3 moonstones (base 120 G) — 137 G", () => {
      expect(quotePremium([...runes(3), ...itemsOf("moonstone", 3)])).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("should add 50 % curse surcharge to a cursed sword for a newcomer — 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("should add 30 % high-enchantment surcharge to a sword with exactly enchantment 5 — 145 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("should apply both surcharges to a cursed sword with enchantment 5 — 195 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("should apply no high-enchantment surcharge to a plain sword with enchantment 4 — 115 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("should apply only the curse surcharge to a cursed sword with enchantment 4 — 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("should apply the curse surcharge only to the cursed item's base premium on a multi-item policy (cursed sword + plain amulet, 210 G before policy-wide modifiers) — 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
  });

  describe("policy-wide modifiers", () => {
    it("should give 20 % loyalty discount to a customer with exactly 2 years (sword) — 95 G", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("should give no loyalty discount to a customer with 1 year (sword) — 115 G", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("should give 15 % follow-up discount on the second quote of a newcomer (sword, sword) — [115, 100] G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      };
      expect(runScenario(scenario).results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("should still apply the first-insurance surcharge on a long-standing customer's second contract (3 years, cursed sword enchantment 7) — 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      };
      expect(runScenario(scenario).results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("errors", () => {
    it("should reject a quote containing an unknown item type (broomstick) with an error", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });
});

type Damage = { itemType: string; amount: number };

const claimOn = (items: object[], damages: Damage[], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];

const steelSword = (enchantment: number): object => ({ type: "sword", material: "steel", enchantment, cursed: false });
const dragonSword = (enchantment: number): object => ({ type: "sword", material: "dragon", enchantment, cursed: false });

describe("MHPCO Claim Office — claim", () => {
  describe("standard reimbursement", () => {
    it("should pay full damage minus 100 G deductible for a regular steel sword enchantment 3, damage 500 G — payout 400 G, remainingCap 1600 G", () => {
      expect(claimOn([steelSword(3)], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay full damage minus deductible for a rune (no enchantment/material), damage 200 G — payout 100 G, remainingCap 400 G", () => {
      expect(claimOn([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("special clauses", () => {
    it("should reimburse 50 % for a steel sword with enchantment 9, damage 1000 G — payout 400 G", () => {
      expect(claimOn([steelSword(9)], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("should fully reimburse a dragon-material sword with enchantment 5, damage 800 G — payout 700 G", () => {
      expect(claimOn([dragonSword(5)], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
    });
    it("should let the 50 % rule win for a dragon-material sword with enchantment 9, damage 1000 G — payout 400 G", () => {
      expect(claimOn([dragonSword(9)], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("should apply the 50 % rule at exactly enchantment 8 for a dragon-material sword, damage 1000 G — payout 400 G", () => {
      expect(claimOn([dragonSword(8)], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("should round a payout of 350.5 G down to 350 G (steel sword enchantment 9, damage 901 G)", () => {
      expect(claimOn([steelSword(9)], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
    });
  });

  describe("deductible per damage event", () => {
    it("should apply the deductible once per damaged item (sword 500 G + amulet 300 G) — payout 600 G", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
      expect(claimOn([steelSword(3), { type: "amulet" }], damages).payout).toBe(600);
    });
  });

  describe("insurance sum and cap", () => {
    it("should cap a sword + amulet policy at 3200 G (sum 1600 G): sword damage 500 G — remainingCap 2800 G", () => {
      expect(claimOn([steelSword(3), { type: "amulet" }], [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(2800);
    });
    it("should base the cap on the unmodified insurance value for a cursed sword (cap 2000 G): damage 1500 G — payout 1400 G, remainingCap 600 G", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(claimOn([cursedSword], [{ itemType: "sword", amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("should not let the block discount reduce the insurance sum (sword + 3 runes, sum 1750 G, cap 3500 G): sword damage 500 G — remainingCap 3100 G", () => {
      expect(claimOn([steelSword(3), ...runes(3)], [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(3100);
    });
    it("should insure two swords for 2000 G with cap 4000 G: one sword damage 500 G — remainingCap 3600 G", () => {
      expect(claimOn([steelSword(3), steelSword(3)], [{ itemType: "sword", amount: 500 }]).remainingCap).toBe(3600);
    });
    it("should treat two sword damage entries as separate damages with their own deductibles (two swords insured, 500 G each) — payout 800 G, remainingCap 3200 G", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
      expect(claimOn([steelSword(3), steelSword(3)], damages)).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("should reduce the second of two successive 1500 G claims on a sword to the remaining cap — payouts [1400, 600] G, remainingCap [600, 0] G", () => {
      const swordClaim = { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] } };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [steelSword(3)] }, swordClaim, swordClaim],
      };
      expect(runScenario(scenario).results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("policy references", () => {
    it("should resolve the policy by the zero-based index of the quote step (claim against second quote)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [steelSword(3)] },
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      expect(runScenario(scenario).results[2]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });

  describe("errors", () => {
    it("should reject a claim with more sword damages than swords insured (two damages, one sword) with an error", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
      expect(() => claimOn([steelSword(3)], damages)).toThrow(/sword/);
    });
    it("should reject a claim damaging an amulet when only a sword is insured with an error", () => {
      expect(() => claimOn([steelSword(3)], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
    });
    it("should reject a claim damaging an item of unknown type with an error", () => {
      expect(() => claimOn([steelSword(3)], [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
    });
    it("should reject a claim with a negative damage amount (-200) with an error", () => {
      expect(() => claimOn([steelSword(3)], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });
});
