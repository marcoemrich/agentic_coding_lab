import { describe, it, expect } from "vitest";
import { claimOffice } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // =====================================================
  // QUOTE: Base premiums for individual items
  // =====================================================

  describe("quote — base premiums for individual items", () => {
    it("should return premium 115 G for a single sword (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });

    it("should return premium 71 G for a single amulet (60 base + 6 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(71);
    });

    it("should return premium 93 G for a single staff (80 base + 8 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(93);
    });

    it("should return premium 49 G for a single potion (40 base + 4 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "potion", material: "liquid", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(49);
    });

    it("should return premium 33 G for a single rune component (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(33);
    });

    it("should return premium 33 G for a single moonstone component (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(33);
    });
  });

  // =====================================================
  // QUOTE: Building block of 3 alike components
  // =====================================================

  describe("quote — building block of 3 alike components", () => {
    it("should return 60 G for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result[0].premium).toBe(60);
    });

    it("should return 73 G for 3 runes (60 block base + 7.5 first insurance on 75 policy base + 5 fee, rounded up)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result[0].premium).toBe(73);
    });

    it("should return 115 G for 4 runes (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });

    it("should return 198 G for 7 runes (175 base + 17.5 first insurance + 5 fee, rounded up)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(198);
    });

    it("should return 88 G for 2 runes + 1 moonstone (75 base + 7.5 first insurance + 5 fee, rounded up)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result[0].premium).toBe(88);
    });

    it("should return 140 G for 3 runes + 3 moonstones (120 block base + 15 first insurance on 150 policy base + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(140);
    });
  });

  // =====================================================
  // QUOTE: Processing fee
  // =====================================================

  describe("quote — processing fee", () => {
    it("should return premium 5 G for an empty item list (only processing fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [],
          },
        ],
      });
      expect(result[0].premium).toBe(5);
    });
  });

  // =====================================================
  // QUOTE: Cursed item surcharge (item-specific modifier)
  // =====================================================

  describe("quote — cursed item surcharge", () => {
    it("should add 50% risk surcharge for a cursed sword — premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(165);
    });

    it("should not add cursed surcharge for a non-cursed sword — premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });
  });

  // =====================================================
  // QUOTE: High enchantment surcharge (item-specific modifier)
  // =====================================================

  describe("quote — high enchantment surcharge", () => {
    it("should add 30% surcharge for sword with enchantment 5 — premium 145 G (100 base + 30 enchantment + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(145);
    });

    it("should not add enchantment surcharge for sword with enchantment 4 — premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });

    it("should add 30% surcharge for sword with enchantment 9 — premium 145 G (100 base + 30 enchantment + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(145);
    });
  });

  // =====================================================
  // QUOTE: Combined item-specific modifiers (cursed + high enchantment)
  // =====================================================

  describe("quote — combined item-specific modifiers", () => {
    it("should apply both cursed and enchantment surcharges for cursed sword with enchantment 5 — premium 195 G (100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(195);
    });

    it("should apply only curse surcharge for cursed sword with enchantment 4 — premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: true },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(165);
    });
  });

  // =====================================================
  // QUOTE: Modifier scope on multi-item policies
  // =====================================================

  describe("quote — modifier scope on multi-item policies", () => {
    it("should apply cursed surcharge only to the cursed item — cursed sword + plain amulet = 231 G (100 + 60 base + 50 curse on sword + 16 first insurance on 160 policy base + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(231);
    });
  });

  // =====================================================
  // QUOTE: Policy-wide modifiers — loyalty discount
  // =====================================================

  describe("quote — loyalty discount", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years — sword premium 95 G (100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(95);
    });

    it("should apply 20% loyalty discount for customer with 3 years — sword premium 95 G (100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(95);
    });

    it("should not apply loyalty discount for customer with 1 year — sword premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });
  });

  // =====================================================
  // QUOTE: Policy-wide modifiers — first insurance surcharge
  // =====================================================

  describe("quote — first insurance surcharge", () => {
    it("should apply 10% first insurance surcharge on policy base premium — sword premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(115);
    });
  });

  // =====================================================
  // QUOTE: Policy-wide modifiers — follow-up contract discount
  // =====================================================

  describe("quote — follow-up contract discount", () => {
    it("should apply 15% follow-up discount on second quote — sword on second quote = 100 G (100 base + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result[1].premium).toBe(100);
    });
  });

  // =====================================================
  // QUOTE: Rounding in MHPCO's favor
  // =====================================================

  describe("quote — rounding premiums up", () => {
    it("should round premium up when calculation yields a fraction — e.g. 197.5 G rounds to 198 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(198);
    });
  });

  // =====================================================
  // QUOTE: Integration example — newcomer with cursed sword
  // =====================================================

  describe("quote — integration: newcomer with cursed sword", () => {
    it("should return 165 G for newcomer (0 years, no previous contract) with cursed sword (steel, enchantment 3) — (100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      expect(result[0].premium).toBe(165);
    });
  });

  // =====================================================
  // QUOTE: Integration example — long-standing customer second contract
  // =====================================================

  describe("quote — integration: long-standing customer second contract", () => {
    it("should return 160 G for 3-year customer on second quote with cursed sword (steel, enchantment 7) — (100 base + 50 curse + 30 enchant - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(result[1].premium).toBe(160);
    });
  });

  // =====================================================
  // QUOTE: Edge cases / errors
  // =====================================================

  describe("quote — edge cases", () => {
    it("should reject unknown item type (e.g. 'broomstick') with non-zero exit and error to stderr", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              type: "quote",
              items: [
                { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
              ],
            },
          ],
        })
      ).toThrow();
    });
  });

  // =====================================================
  // CLAIM: Standard reimbursement (no special clauses)
  // =====================================================

  describe("claim — standard reimbursement", () => {
    it("should return payout 400 G for regular sword (steel, enchantment 3) with 500 G damage — full reimbursement minus 100 G deductible", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(400);
      expect(result[1].remainingCap).toBe(1600);
    });

    it("should return payout 100 G for rune with 200 G damage — full reimbursement minus 100 G deductible", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [{ type: "rune" }],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(100);
      expect(result[1].remainingCap).toBe(400);
    });
  });

  // =====================================================
  // CLAIM: Deductible per damage event
  // =====================================================

  describe("claim — deductible per damage event", () => {
    it("should apply 100 G deductible per damaged item — sword 500 G + amulet 300 G = payout 600 G (deductible applied once per item)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(600);
      expect(result[1].remainingCap).toBe(2600);
    });
  });

  // =====================================================
  // CLAIM: Enchantment >= 8 reimbursement at 50%
  // =====================================================

  describe("claim — high enchantment reimbursement", () => {
    it("should reimburse at 50% for steel sword with enchantment 9, damage 1000 G — payout 400 G (500 - 100 deductible)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "spell",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(400);
    });
  });

  // =====================================================
  // CLAIM: Dragon material — full reimbursement
  // =====================================================

  describe("claim — dragon material reimbursement", () => {
    it("should fully reimburse dragon-material sword with enchantment 5, damage 800 G — payout 700 G (800 - 100 deductible)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(700);
    });
  });

  // =====================================================
  // CLAIM: Both clauses — enchantment >= 8 AND dragon material
  // =====================================================

  describe("claim — enchantment >= 8 AND dragon material", () => {
    it("should apply 50% rule when both clauses apply — dragon-material sword enchantment 9, damage 1000 G — payout 400 G (50% wins: 500 - 100)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "spell",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(400);
    });

    it("should apply 50% rule for dragon-material sword with exactly enchantment 8, damage 1000 G — payout 400 G (50% first: 500 - 100)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "spell",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(400);
    });
  });

  // =====================================================
  // CLAIM: Rounding payouts down
  // =====================================================

  describe("claim — rounding payouts down", () => {
    it("should round payout down when calculation yields a fraction — e.g. 350.5 G rounds to 350 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "spell",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(350);
    });
  });

  // =====================================================
  // CLAIM: Multiple items of the same type
  // =====================================================

  describe("claim — multiple items of the same type", () => {
    it("should treat each damage entry as separate with its own deductible — two swords insured, both damaged", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result[1].payout).toBe(800);
      expect(result[1].remainingCap).toBe(3200);
    });

    it("should reject claim when damages contain more entries of a type than insured — two sword damages but only one sword insured", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              type: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              type: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
  });

  // =====================================================
  // CLAIM: Cap (2x insurance sum)
  // =====================================================

  describe("claim — cap", () => {
    it("should cap total payout at 2x insurance sum — sword + amulet = insurance sum 1600 G, cap 3200 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      expect(result[1].remainingCap).toBe(3100);
    });

    it("should base cap on unmodified insurance value — cursed sword cap is 2000 G (2 x 1000), not affected by premium modifiers", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      expect(result[1].remainingCap).toBe(1900);
    });

    it("should base insurance sum on item count not block discount — sword + 3 runes = insurance sum 1750 G (1000 + 3x250)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      expect(result[1].remainingCap).toBe(3400);
    });
  });

  // =====================================================
  // CLAIM: Cap exhaustion over successive claims
  // =====================================================

  describe("claim — cap exhaustion over successive claims", () => {
    it("should return payout 1400 G and remainingCap 600 G on first claim of 1500 G damage against sword (cap 2000 G)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { type: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] } },
          { type: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result[1].payout).toBe(1400);
      expect(result[1].remainingCap).toBe(600);
    });

    it("should return payout 600 G and remainingCap 0 G on second claim of 1500 G damage when only 600 G cap remains", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { type: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] } },
          { type: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result[2].payout).toBe(600);
      expect(result[2].remainingCap).toBe(0);
    });
  });

  // =====================================================
  // CLAIM: Edge cases / errors
  // =====================================================

  describe("claim — edge cases", () => {
    it("should reject claim for item not in policy — amulet damaged when only sword insured", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              type: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              type: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });

    it("should reject claim with negative damage amount — amount: -200", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              type: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              type: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
  });

  // =====================================================
  // CLI: input/output format
  // =====================================================

  describe("CLI — input/output format", () => {
    it("should read JSON from stdin and write JSON results to stdout with correct shape", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      const stdout = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
        cwd: "/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4",
      });
      const result = JSON.parse(stdout.trim());
      expect(result).toEqual({ results: [{ premium: 59 }] });
    });

    it("should process sequential steps where claim references earlier quote by zero-based step index", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      const stdout = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
        cwd: "/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4",
      });
      const result = JSON.parse(stdout.trim());
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });

    it("should exit with non-zero status and write error to stderr for unknown item type", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      try {
        execSync(`echo '${input}' | npx tsx src/cli.ts`, {
          encoding: "utf-8",
          cwd: "/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4",
        });
        throw new Error("Expected execSync to throw but it did not");
      } catch (err: any) {
        expect(err.status).not.toBe(0);
        expect(err.stderr.length).toBeGreaterThan(0);
        expect(err.stdout).toBe("");
      }
    });

    it("should exit with non-zero status and write error to stderr for claim referencing item not in policy", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      try {
        execSync(`echo '${input}' | npx tsx src/cli.ts`, {
          encoding: "utf-8",
          cwd: "/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4",
        });
        throw new Error("Expected execSync to throw but it did not");
      } catch (err: any) {
        expect(err.status).not.toBe(0);
        expect(err.stderr.length).toBeGreaterThan(0);
        expect(err.stdout).toBe("");
      }
    });

    it("should exit with non-zero status and write error to stderr for negative damage amount", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });
      try {
        execSync(`echo '${input}' | npx tsx src/cli.ts`, {
          encoding: "utf-8",
          cwd: "/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4",
        });
        throw new Error("Expected execSync to throw but it did not");
      } catch (err: any) {
        expect(err.status).not.toBe(0);
        expect(err.stderr.length).toBeGreaterThan(0);
        expect(err.stdout).toBe("");
      }
    });
  });
});
