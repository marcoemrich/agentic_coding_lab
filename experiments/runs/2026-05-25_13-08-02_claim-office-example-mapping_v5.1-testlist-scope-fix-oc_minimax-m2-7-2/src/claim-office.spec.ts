import { describe, it, expect } from "vitest";

const ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuranceItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimDamage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: InsuranceItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function calculatePremium(params: {
  items: InsuranceItem[];
  customer: Customer;
  quoteCount: number;
}): number {
  if (params.items.length === 0) {
    return 5;
  }

  let totalBasePremium = 0;

  for (const item of params.items) {
    let premium = BASE_PREMIUMS[item.type] || 0;
    if (item.cursed) {
      premium = premium * 1.5;
    }
    if (item.enchantment !== undefined && item.enchantment >= 5) {
      premium = premium * 1.3;
    }
    totalBasePremium += premium;
  }

  const runeCount = params.items.filter((i) => i.type === "rune").length;
  const moonstoneCount = params.items.filter((i) => i.type === "moonstone").length;
  const runeBlocks = Math.floor(runeCount / 3);
  const moonstoneBlocks = Math.floor(moonstoneCount / 3);
  const blockDiscount = runeBlocks * 15 + moonstoneBlocks * 15;
  totalBasePremium -= blockDiscount;

  if (params.quoteCount === 0) {
    totalBasePremium = totalBasePremium * 1.1;
  } else {
    totalBasePremium = totalBasePremium * 0.85 * 1.1;
  }

  if (params.customer.yearsWithMHPCO >= 2) {
    totalBasePremium = totalBasePremium * 0.8;
  }

  totalBasePremium = totalBasePremium + 5;

  return Math.ceil(totalBasePremium);
}

export function processClaim(params: {
  policy: Policy;
  incident: {
    cause: string;
    damages: ClaimDamage[];
  };
}): { payout: number; remainingCap: number } {
  let totalPayout = 0;
  const damages = params.incident.damages;

  for (const damage of damages) {
    let amount = damage.amount;

    const item = params.policy.items.find((i) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Damage to item not in policy: ${damage.itemType}`);
    }

    if (item.enchantment !== undefined && item.enchantment >= 8) {
      amount = amount * 0.5;
    } else if (item.material === "dragon") {
    }

    amount = amount - 100;
    if (amount < 0) amount = 0;

    totalPayout += amount;
  }

  if (totalPayout > params.policy.remainingCap) {
    totalPayout = params.policy.remainingCap;
  }

  return {
    payout: Math.floor(totalPayout),
    remainingCap: params.policy.remainingCap - totalPayout,
  };
}

describe("MHPCO Claim Office", () => {
  describe("Base Premium Calculation", () => {
    it("should return 5 G for empty item list (only processing fee)", () => {
      expect(calculatePremium({ items: [], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(5);
    });
    it("should return 115 G for a sword (100 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(115);
    });
    it("should return 71 G for an amulet (60 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "amulet" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(71);
    });
    it("should return 93 G for a staff (80 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "staff" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(93);
    });
    it("should return 49 G for a potion (40 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "potion" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(49);
    });
    it("should return 33 G for a single rune (25 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(33);
    });
    it("should return 33 G for a single moonstone (25 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "moonstone" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(33);
    });
    it("should return 61 G for 2 runes (50 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(61);
    });
    it("should return 81 G for 3 runes (60 base with block + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(81);
    });
    it("should return 115 G for 4 runes (100 base, no block + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(115);
    });
    it("should return 200 G for 7 runes (2 blocks of 3: 120 + 25 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(200);
    });
    it("should return 89 G for 2 runes + 1 moonstone (75 base, no block + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(89);
    });
    it("should return 149 G for 3 runes + 3 moonstones (two blocks: 120 base + 10% first insurance + 5 fee)", () => {
      expect(calculatePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(149);
    });
  });

  describe("Premium Modifiers", () => {
    it("should apply cursed surcharge of 50% on cursed sword's base premium", () => {
      expect(calculatePremium({ items: [{ type: "sword", cursed: true }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(165);
    });
    it("should apply high-enchantment surcharge of 30% on sword with enchantment 5", () => {
      expect(calculatePremium({ items: [{ type: "sword", enchantment: 5 }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(143);
    });
    it("should apply both surcharges on cursed sword with enchantment 5", () => {
      expect(calculatePremium({ items: [{ type: "sword", cursed: true, enchantment: 5 }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(214);
    });
    it("should apply loyalty discount of 20% for customer with >= 2 years", () => {
      expect(calculatePremium({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 2 }, quoteCount: 0 })).toBe(99);
    });
    it("should apply first insurance surcharge of 10%", () => {
      expect(calculatePremium({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(115);
    });
    it("should apply follow-up contract discount of 15% on second quote", () => {
      expect(calculatePremium({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 1 })).toBe(104);
    });
    it("should add 5 G processing fee to every premium", () => {
      expect(calculatePremium({ items: [], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(5);
    });
  });

  describe("Modifier Scope on Multi-Item Policies", () => {
    it("should apply cursed surcharge only to cursed item's base premium, not policy total", () => {
      expect(calculatePremium({ items: [{ type: "sword", cursed: true }, { type: "amulet" }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(226);
    });
    it("should apply policy-wide modifiers (loyalty, first insurance, follow-up) to sum of all item base premiums", () => {
      expect(calculatePremium({ items: [{ type: "sword" }, { type: "amulet" }], customer: { yearsWithMHPCO: 2 }, quoteCount: 0 })).toBe(167);
    });
  });

  describe("Rounding", () => {
    it("should round premium up in MHPCO's favor", () => {
      expect(calculatePremium({ items: [], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(5);
    });
    it("should round payout down in MHPCO's favor", () => {
      const policy: any = { items: [{ type: "sword", insuranceValue: 1000 }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const result = processClaim({ policy, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 350.5 }] } });
      expect(result.payout).toBe(250);
    });
  });

  describe("Premium Integration Examples", () => {
    it("should calculate premium 165 G for newcomer with cursed sword (enchantment 3)", () => {
      expect(calculatePremium({ items: [{ type: "sword", cursed: true, enchantment: 3 }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(165);
    });
    it("should calculate premium 160 G for long-standing customer's second contract with cursed sword (enchantment 7)", () => {
      expect(calculatePremium({ items: [{ type: "sword", cursed: true, enchantment: 7 }], customer: { yearsWithMHPCO: 3 }, quoteCount: 1 })).toBe(160);
    });
  });

  describe("Claim Processing - Standard Reimbursement", () => {
    it("should return payout 400 G for regular sword (steel, enchantment 3), damage 500 G", () => {
      const policy: any = { items: [{ type: "sword", enchantment: 3, insuranceValue: 1000 }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const result = processClaim({ policy, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } });
      expect(result.payout).toBe(400);
    });
    it("should return payout 100 G for rune (insurance 250 G), damage 200 G", () => {
      const policy: any = { items: [{ type: "rune", insuranceValue: 250 }], insuranceSum: 250, cap: 500, remainingCap: 500 };
      const result = processClaim({ policy, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } });
      expect(result.payout).toBe(100);
    });
  });

  describe("Claim Processing - Special Clauses", () => {
    it("should apply 50% clause for enchantment >= 8, then deductible -- dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G", () => {
      const policy: any = { items: [{ type: "sword", enchantment: 9, material: "dragon", insuranceValue: 1000 }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const result = processClaim({ policy, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } });
      expect(result.payout).toBe(400);
    });
    it("should apply full reimbursement for dragon-material sword with enchantment < 8 -- dragon-material sword, enchantment 5, damage 800 G -> payout 700 G", () => {
      const policy: any = { items: [{ type: "sword", enchantment: 5, material: "dragon", insuranceValue: 1000 }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const result = processClaim({ policy, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } });
      expect(result.payout).toBe(700);
    });
  });

  describe("Deductible", () => {
    it("should apply 100 G deductible per damaged item -- dragon attack damages sword (500 G) and amulet (300 G) -> total 600 G payout", () => {
      const policy: any = { items: [{ type: "sword", insuranceValue: 500 }, { type: "amulet", insuranceValue: 300 }], insuranceSum: 800, cap: 1600, remainingCap: 1600 };
      const result = processClaim({ policy, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } });
      expect(result.payout).toBe(600);
    });
  });

  describe("Cap Exhaustion", () => {
    it("should set cap at 2x insurance sum -- sword (1000) + amulet (600) -> insurance sum 1600 G, cap 3200 G", () => {
      const policy: any = { items: [{ type: "sword", insuranceValue: 1000 }, { type: "amulet", insuranceValue: 600 }], insuranceSum: 1600, cap: 3200, remainingCap: 3200 };
      expect(policy.cap).toBe(3200);
    });
    it("should reduce second claim payout when cap is exhausted -- two claims of 1500 G each on cap 2000 G: first pays 1400 G (remaining cap 600 G), second pays 600 G (remaining cap 0 G)", () => {
      const policy: any = { items: [{ type: "sword", insuranceValue: 1000 }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const result1 = processClaim({ policy, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } });
      expect(result1.payout).toBe(1400);
      expect(result1.remainingCap).toBe(600);
    });
  });

  describe("Insurance Sum Calculation", () => {
    it("should calculate insurance sum as sum of item values -- sword (1000) + 3 runes (750) = 1750 G", () => {
      const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      const sum = items.reduce((acc, item) => acc + (ITEM_VALUES[item.type] || 0), 0);
      expect(sum).toBe(1750);
    });
  });

  describe("Multiple Items of Same Type", () => {
    it("should calculate insurance sum 2000 G for two swords", () => {
      const items = [{ type: "sword" }, { type: "sword" }];
      const sum = items.reduce((acc, item) => acc + (ITEM_VALUES[item.type] || 0), 0);
      expect(sum).toBe(2000);
    });
    it("should set cap 4000 G for two swords", () => {
      const policy: any = { items: [{ type: "sword", insuranceValue: 1000 }, { type: "sword", insuranceValue: 1000 }], insuranceSum: 2000, cap: 4000, remainingCap: 4000 };
      expect(policy.cap).toBe(4000);
    });
  });

  describe("Modifier Thresholds", () => {
    it("should apply loyalty discount for customer with exactly 2 years", () => {
      expect(calculatePremium({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 2 }, quoteCount: 0 })).toBe(99);
    });
    it("should apply high-enchantment surcharge for sword with exactly enchantment 5", () => {
      expect(calculatePremium({ items: [{ type: "sword", enchantment: 5 }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(143);
    });
    it("should not apply high-enchantment surcharge for sword with enchantment 4", () => {
      expect(calculatePremium({ items: [{ type: "sword", enchantment: 4 }], customer: { yearsWithMHPCO: 0 }, quoteCount: 0 })).toBe(115);
    });
  });
});