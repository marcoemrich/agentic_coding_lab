import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { quote, claim } from "./claim-office.js";

describe("Claim Office - Quote Operation", () => {
  describe("base premium calculation", () => {
    it("should return 5 G for an empty item list (processing fee only)", () => {
      const items: never[] = [];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(5);
    });
    it("should return base premium plus processing fee for a single sword", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(71);
    });
    it("should return base premium plus processing fee for a single staff", () => {
      const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(93);
    });
    it("should return base premium plus processing fee for a single potion", () => {
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(49);
    });
    it("should return base premium plus processing fee for a single rune component", () => {
      const items = [{ type: "rune" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(33);
    });
    it("should return base premium plus processing fee for a single moonstone component", () => {
      const items = [{ type: "moonstone" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(33);
    });
    it("should return sum of base premiums plus processing fee for multiple different items", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(181);
    });
  });

  describe("component block discount", () => {
    it("should charge 2 x 25 G for 2 runes (no block)", () => {
      const items = [{ type: "rune" }, { type: "rune" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(60);
    });
    it("should charge 60 G for exactly 3 runes (block discount)", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(71);
    });
    it("should charge 4 x 25 G for 4 runes (no block)", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(115);
    });
    it("should charge 60 G for exactly 3 moonstones (block discount)", () => {
      const items = [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(71);
    });
    it("should charge 75 G for 2 runes and 1 moonstone (no block, different types)", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(88);
    });
    it("should charge 120 G for 3 runes and 3 moonstones (two separate blocks)", () => {
      const items = [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("should apply +50% surcharge for a cursed item", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(165);
    });
    it("should apply +30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(145);
    });
    it("should apply both cursed and highly enchanted surcharges to the same item", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(195);
    });
  });

  describe("policy-wide modifiers", () => {
    it("should apply +10% first insurance surcharge to each item", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "staff", material: "wood", enchantment: 0, cursed: false },
      ];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      // sword base 100 + 10% = 110, staff base 80 + 10% = 88, total = 198 + 5 fee = 203
      expect(result).toBe(203);
    });
    it("should apply -20% loyalty discount for customer with 2 or more years", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 2 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      // Policy base premium = 100 (sword)
      // First insurance surcharge = +10% of 100 = +10
      // Loyalty discount = -20% of 100 = -20
      // Total = 100 + 10 - 20 = 90 + 5 fee = 95
      expect(result).toBe(95);
    });
    it("should apply -15% follow-up discount for non-first contract", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 2;

      const result = quote(items, customer, contractNumber);

      // Policy base premium = 100 (sword)
      // First insurance surcharge = +10% of 100 = +10
      // Follow-up discount = -15% of 100 = -15
      // No loyalty discount (0 years)
      // Total = 100 + 10 - 15 = 95 + 5 fee = 100
      expect(result).toBe(100);
    });
    it("should apply multiple policy-wide modifiers together in correct order", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const customer = { yearsAsCustomer: 3 };
      const contractNumber = 2;

      const result = quote(items, customer, contractNumber);

      // Policy base premium = 100 (sword)
      // First insurance surcharge = +10% of 100 = +10
      // Loyalty discount = -20% of 100 = -20
      // Follow-up discount = -15% of 100 = -15
      // Total = 100 + 10 - 20 - 15 = 75 + 5 fee = 80
      expect(result).toBe(80);
    });
  });

  describe("rounding and processing fee", () => {
    it("should round up premium to whole G in MHPCO's favor", () => {
      // Single rune (base 25) with loyalty discount
      // policyBasePremium = 25
      // firstInsuranceSurcharge = 25 * 0.10 = 2.5
      // loyaltyDiscount = 25 * 0.20 = 5
      // totalPremium = 25 + 2.5 - 5 = 22.5
      // Math.ceil(22.5) = 23
      // + 5 processing fee = 28
      const items = [{ type: "rune" }];
      const customer = { yearsAsCustomer: 2 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(28);
    });
    it("should add 5 G processing fee after all other calculations", () => {
      // rune (base 25) with follow-up discount for a non-first contract
      // policyBasePremium = 25
      // firstInsuranceSurcharge = 25 * 0.10 = 2.5
      // followUpDiscount = 25 * 0.15 = 3.75
      // totalPremium = 25 + 2.5 - 3.75 = 23.75
      // Math.ceil(23.75) = 24  (rounding happens first)
      // 24 + 5 = 29            (then processing fee added)
      const items = [{ type: "rune" }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 2;

      const result = quote(items, customer, contractNumber);

      expect(result).toBe(29);
    });
  });

  describe("integration examples", () => {
    it("should compute 165 G for newcomer with cursed steel sword (enchantment 3)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      const customer = { yearsAsCustomer: 0 };
      const contractNumber = 1;

      const result = quote(items, customer, contractNumber);

      // base 100 + curse 50 + first insurance 10 = 160 + 5 fee = 165
      expect(result).toBe(165);
    });
    it("should compute 160 G for long-standing second contract with cursed highly-enchanted sword", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
      const customer = { yearsAsCustomer: 3 };
      const contractNumber = 2;

      const result = quote(items, customer, contractNumber);

      // base 100 + curse 50 + enchantment 30 + first insurance 10 - loyalty 20 - follow-up 15 = 155 + 5 fee = 160
      expect(result).toBe(160);
    });
  });
});

describe("Claim Office - Claim Operation", () => {
  describe("standard reimbursement", () => {
    it("should reimburse damage minus 100 G deductible for a standard item", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 500 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse 0 G when damage is less than or equal to deductible", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 100 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 0, remainingCap: 2000 });
    });
  });

  describe("special reimbursement clauses", () => {
    it("should reimburse at 50% of damage for enchantment >= 8 item (before deductible)", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 1000 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse full damage for dragon material item (before deductible)", () => {
      const policyItems = [
        { type: "sword", material: "dragon", enchantment: 5, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 800 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% rule when item has both enchantment >= 8 and dragon material", () => {
      const policyItems = [
        { type: "sword", material: "dragon", enchantment: 9, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 1000 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("payout cap", () => {
    it("should cap total payout at 2x insurance sum of the policy", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 2500 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should reduce remaining cap after successive claims", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];

      // First claim: 1500 G damage, payout = 1500 - 100 deductible = 1400
      const firstResult = claim(policyItems, [{ itemType: "sword", amount: 1500 }], 0);
      expect(firstResult).toEqual({ payout: 1400, remainingCap: 600 });

      // Second claim: 1500 G damage again, payout = min(1400, 600) = 600
      const secondResult = claim(policyItems, [{ itemType: "sword", amount: 1500 }], 1400);
      expect(secondResult).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("deductible per damage event", () => {
    it("should apply 100 G deductible per damaged item in a claim", () => {
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      // payout = (500 - 100) + (300 - 100) = 400 + 200 = 600
      // insuranceSum = 1000 + 600 = 1600, cap = 3200
      // remainingCap = 3200 - 600 = 2600
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("payout rounding", () => {
    it("should round down payout to whole G", () => {
      // Sword with enchantment 9 (>= 8), damage 501 G
      // effectiveAmount = 501 * 0.5 = 250.5
      // payout = max(0, 250.5 - 100) = 150.5
      // Math.floor(150.5) = 150 (rounded down in MHPCO's favor)
      // insuranceSum = 1000, cap = 2000
      // remainingCap = 2000 - 150 = 1850
      const policyItems = [
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ];
      const damages = [{ itemType: "sword", amount: 501 }];
      const previousPayouts = 0;

      const result = claim(policyItems, damages, previousPayouts);

      expect(result).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });
});

describe("Claim Office - CLI", () => {
  describe("basic input/output", () => {
    it("should read JSON from stdin and write results JSON to stdout", () => {
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

      const stdout = execSync("npx tsx src/cli.ts", {
        input,
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      const result = JSON.parse(stdout);
      expect(result).toEqual({ results: [{ premium: 59 }] });
    });
    it("should process sequential steps where claims reference policies by step index", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });

      const stdout = execSync("npx tsx src/cli.ts", {
        input,
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      const result = JSON.parse(stdout);
      expect(result).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    });
  });

  describe("error handling", () => {
    it("should exit with non-zero status and stderr message for unknown item type", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      });

      let thrown = false;
      try {
        execSync("npx tsx src/cli.ts", {
          input,
          encoding: "utf-8",
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error: any) {
        thrown = true;
        expect(error.status).not.toBe(0);
        expect(error.stderr.toString()).toMatch(/unknown|unsupported|invalid/i);
      }

      expect(thrown).toBe(true);
    });
    it("should exit with non-zero status and stderr message for damage to uninsured item", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      let thrown = false;
      try {
        execSync("npx tsx src/cli.ts", {
          input,
          encoding: "utf-8",
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error: any) {
        thrown = true;
        expect(error.status).not.toBe(0);
        expect(error.stderr.toString()).toMatch(/uninsured|not covered|not in policy|unknown/i);
      }

      expect(thrown).toBe(true);
    });
    it("should exit with non-zero status and stderr message for more damages than insured items", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      let thrown = false;
      try {
        execSync("npx tsx src/cli.ts", {
          input,
          encoding: "utf-8",
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error: any) {
        thrown = true;
        expect(error.status).not.toBe(0);
        expect(error.stderr.toString()).toMatch(/more damages than|exceeds|too many|count/i);
      }

      expect(thrown).toBe(true);
    });
    it("should exit with non-zero status and stderr message for negative damage amount", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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

      let thrown = false;
      try {
        execSync("npx tsx src/cli.ts", {
          input,
          encoding: "utf-8",
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error: any) {
        thrown = true;
        expect(error.status).not.toBe(0);
        expect(error.stderr.toString()).toMatch(/negative|invalid|damage amount/i);
      }

      expect(thrown).toBe(true);
    });
  });
});
