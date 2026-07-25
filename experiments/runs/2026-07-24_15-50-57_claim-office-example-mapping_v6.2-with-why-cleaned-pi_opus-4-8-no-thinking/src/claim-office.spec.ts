import { describe, it, expect } from "vitest";
import { quote, claim, insuranceSum } from "./claim-office.js";

describe("Claim Office - quote: base premiums & fee", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], { contractIndex: 0 })).toBe(5);
  });
  it("single sword (newcomer, first insurance) -> 100 base + 10 first + 5 fee = 115 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], { contractIndex: 0 }),
    ).toBe(115);
  });
  it("single amulet -> 60 base + 6 first + 5 fee = 71 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], { contractIndex: 0 }),
    ).toBe(71);
  });
  it("single staff -> 80 base + 8 first + 5 fee = 93 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], { contractIndex: 0 }),
    ).toBe(93);
  });
  it("single potion -> 40 base + 4 first + 5 fee = 49 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], { contractIndex: 0 }),
    ).toBe(49);
  });
});

describe("Claim Office - quote: component building blocks (base premium)", () => {
  it("2 runes -> 50 G base premium (quote: 50 + 5 first + 5 fee = 60)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], {
        contractIndex: 0,
      }),
    ).toBe(60);
  });
  it("3 runes -> 60 G base premium (block applies) (quote: 60 + 6 + 5 = 71)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        { contractIndex: 0 },
      ),
    ).toBe(71);
  });
  it("4 runes -> 100 G base premium (no block - requires exactly 3) (quote 115)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        Array.from({ length: 4 }, () => ({ type: "rune" })),
        { contractIndex: 0 },
      ),
    ).toBe(115);
  });
  it("7 runes -> 175 G base premium (quote 175 + 17.5 + 5 = 197.5 -> 198 rounded)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        Array.from({ length: 7 }, () => ({ type: "rune" })),
        { contractIndex: 0 },
      ),
    ).toBe(198);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types) (quote 87.5 -> 88 rounded)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        { contractIndex: 0 },
      ),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks) (quote 137)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        { contractIndex: 0 },
      ),
    ).toBe(137);
  });
});

describe("Claim Office - quote: item-specific modifiers", () => {
  it("cursed sword (steel, ench 3), newcomer -> 165 G (100+50 curse+10 first+5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { contractIndex: 0 },
      ),
    ).toBe(165);
  });
  it("sword enchantment 5 -> high-enchantment surcharge applies (100+30+10+5=145)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(145);
  });
  it("sword enchantment 4 -> no high-enchantment surcharge (115)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(115);
  });
  it("cursed sword enchantment 5 -> both curse and high-enchantment surcharges apply (100+50+30+10+5=195)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        { contractIndex: 0 },
      ),
    ).toBe(195);
  });
});

describe("Claim Office - quote: policy-wide modifiers & scope", () => {
  it("cursed sword + plain amulet -> curse surcharge only on cursed item base (160 base + 50 curse + 16 first + 5 fee = 231)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        { contractIndex: 0 },
      ),
    ).toBe(231);
  });
  it("customer with exactly 2 years -> loyalty discount applies (100 - 20 loyalty + 10 first + 5 fee = 95)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 2 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(95);
  });
  it("first insurance surcharge applies per quote regardless of history (long-standing, first quote: 100 - 20 + 10 + 5 = 95)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(95);
  });
  it("15% follow-up discount applies to contracts after the first (newcomer sword, contractIndex 1: 100 + 10 - 15 + 5 = 100)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { contractIndex: 1 },
      ),
    ).toBe(100);
  });
});

describe("Claim Office - quote: rounding in MHPCO's favor", () => {
  it("premium yielding 197.5 G -> 198 G (rounded up)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        Array.from({ length: 7 }, () => ({ type: "rune" })),
        { contractIndex: 0 },
      ),
    ).toBe(198);
  });
  it("intermediate amounts kept as fractions; only final premium rounded (5 runes: 125 + 12.5 + 5 = 142.5 -> 143)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        Array.from({ length: 5 }, () => ({ type: "rune" })),
        { contractIndex: 0 },
      ),
    ).toBe(143);
  });
});

describe("Claim Office - quote: integration examples", () => {
  it("newcomer with cursed sword (steel, ench 3) -> 165 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { contractIndex: 0 },
      ),
    ).toBe(165);
  });
  it("long-standing customer's second contract, cursed sword (steel, ench 7) -> 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { contractIndex: 1 },
      ),
    ).toBe(160);
  });
});

describe("Claim Office - quote: unknown item type", () => {
  it("quote with unknown item type throws", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], {
        contractIndex: 0,
      }),
    ).toThrow();
  });
});

describe("Claim Office - claim: insurance sum & cap", () => {
  it("policy of two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSum(items)).toBe(2000);
  });
  it("policy of sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("cursed sword -> insurance sum 1000 G (cap 2000, based on unmodified insurance value)", () => {
    expect(
      insuranceSum([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]),
    ).toBe(1000);
  });
  it("policy of sword + 3 runes block -> insurance sum 1750 G (block affects premium only)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
});

describe("Claim Office - claim: standard reimbursement & deductible", () => {
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (500-100 deductible)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    };
    expect(claim(policyItems, incident).payout).toBe(400);
  });
  it("rune (value 250), damage 200 -> payout 100 (200-100, no special clause)", () => {
    const policyItems = [{ type: "rune" }];
    const incident = {
      cause: "theft",
      damages: [{ itemType: "rune", amount: 200 }],
    };
    expect(claim(policyItems, incident).payout).toBe(100);
  });
});

describe("Claim Office - claim: special clauses", () => {
  it("dragon sword, ench 8, damage 1000 -> payout 400 (50% clause then deductible)", () => {
    const policyItems = [
      { type: "sword", material: "dragon", enchantment: 8, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policyItems, incident).payout).toBe(400);
  });
  it("dragon sword, ench 9, damage 1000 -> payout 400 (both clauses; 50% wins, then deductible)", () => {
    const policyItems = [
      { type: "sword", material: "dragon", enchantment: 9, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policyItems, incident).payout).toBe(400);
  });
  it("dragon sword, ench 5, damage 800 -> payout 700 (dragon clause full, then deductible)", () => {
    const policyItems = [
      { type: "sword", material: "dragon", enchantment: 5, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 800 }],
    };
    expect(claim(policyItems, incident).payout).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 -> payout 400 (high-ench 50% then deductible)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policyItems, incident).payout).toBe(400);
  });
});

describe("Claim Office - claim: deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per item)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policyItems, incident).payout).toBe(600);
  });
  it("two swords damaged, two sword entries -> each separate damage with own deductible (500 each -> 800)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(claim(policyItems, incident).payout).toBe(800);
  });
  it("more damage entries of a type than covered -> claim rejected (throws)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => claim(policyItems, incident)).toThrow();
  });
});

describe("Claim Office - claim: cap exhaustion", () => {
  it("sword cap 2000; first claim 1500 -> payout 1400, remaining 600", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const result = claim(policyItems, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword cap 2000; second claim 1500 -> payout 600, remaining 0 (reduced to remaining cap)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const result = claim(policyItems, incident, 600);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe("Claim Office - claim: rounding in MHPCO's favor", () => {
  it("payout yielding 350.5 G -> 350 G (rounded down) (ench 8, damage 901: 450.5 - 100 = 350.5)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 8, cursed: false },
    ];
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 901 }],
    };
    expect(claim(policyItems, incident).payout).toBe(350);
  });
});

describe("Claim Office - claim: validation errors", () => {
  it("damage references item not in policy -> claim rejected (throws)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 200 }],
    };
    expect(() => claim(policyItems, incident)).toThrow();
  });
  it("damage entry with negative amount -> claim rejected (throws)", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: -200 }],
    };
    expect(() => claim(policyItems, incident)).toThrow();
  });
});
