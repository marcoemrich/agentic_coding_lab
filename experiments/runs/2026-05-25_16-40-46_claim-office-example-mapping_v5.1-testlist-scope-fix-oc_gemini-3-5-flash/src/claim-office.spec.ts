import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office Kata", () => {
  // Quote Operation
  describe("Quote Operation", () => {
    // Edge case: Empty list
    it("empty item list -> premium 5 G (only processing fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: []
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });

    // Unknown item types
    it("quote includes unknown item type (broomstick) -> throws error / exits non-zero", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "broomstick" }
            ]
          }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });

    // Base values in isolation
    it("Sword base premium -> 100 G, value -> 1000 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" }
            ]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("Amulet base premium -> 60 G, value -> 600 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet" }
            ]
          }
        ]
      };
      // 60 G base premium + 10 % first insurance surcharge (6 G) + 5 G fee = 71 G
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("Staff base premium -> 80 G, value -> 800 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff" }]
          }
        ]
      };
      // 80 + 8 (10% surcharge) + 5 fee = 93
      expect(processScenario(scenario).results[0]).toEqual({ premium: 93 });
    });
    it("Potion base premium -> 40 G, value -> 400 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion" }]
          }
        ]
      };
      // 40 + 4 + 5 = 49
      expect(processScenario(scenario).results[0]).toEqual({ premium: 49 });
    });
    it("Single component base premium -> 25 G, value -> 250 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }]
          }
        ]
      };
      // 25 + 2.5 (surcharge) = 27.5. 27.5 + 5 = 32.5 -> ceil is 33
      expect(processScenario(scenario).results[0]).toEqual({ premium: 33 });
    });

    // Alike component building blocks
    it("2 runes -> 50 G base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" }
            ]
          }
        ]
      };
      // Base: 50 G. Surcharge: 10% (5 G). Fee: 5 G. Total = 60 G
      expect(processScenario(scenario).results[0]).toEqual({ premium: 60 });
    });
    it("3 runes -> 60 G base premium (block applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" }
            ]
          }
        ]
      };
      // Base: 60 G. Surcharge: 10% (6 G). Fee: 5 G. Total = 71 G
      expect(processScenario(scenario).results[0]).toEqual({ premium: 71 });
    });
    it("4 runes -> 100 G base premium (no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" }
            ]
          }
        ]
      };
      // Base: 100 G. Surcharge: 10% (10 G). Fee: 5 G. Total = 115 G
      expect(processScenario(scenario).results[0]).toEqual({ premium: 115 });
    });
    it("7 runes -> 175 G base premium (one block of 3 + 4 single runes = 60 + 4 * 25)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }
            ]
          }
        ]
      };
      // Base: 160 G (block of 3 is 60, rest 4 * 25 is 100). Surcharge: 10% (16 G). Fee: 5 G. Total = 181 G
      // Wait, is it 175 G base premium as in prompt: "7 runes → 175 G base premium" ?
      // Wait, why does the prompt say 175 G base premium? Let's check:
      // Oh! A block of 3 alike components has base premium of 60 G.
      // Wait, if 7 runes, can we have TWO blocks?
      // A building block of exactly 3 alike components is offered at 60 G.
      // If we have 7 runes:
      // Can we make a block of 3 (60 G) and another block of 3 (60 G) and 1 single (25 G)?
      // 60 + 60 + 25 = 145 G?
      // Why does prompt say "7 runes -> 175 G base premium"?
      // Let's read: "7 runes -> 175 G base premium"
      // Wait, if 7 runes had one block of 3 (60 G) and 4 single runes (100 G), the sum is 160 G.
      // But prompt says: "7 runes → 175 G base premium"
      // Wait, why 175 G?
      // 7 * 25 = 175 G!
      // "7 runes -> 175 G base premium" -> This means no block was applied, because 7 is not a multiple of 3?
      // Or block requires EXACTLY 3? "A building block of 3 alike components is offered at a special base premium of 60 G."
      // Ah! "no block — block requires exactly 3" under "4 runes -> 100 G base premium".
      // Wait, does "exactly 3" mean if you have 7, you cannot use any blocks? Or that a block has to consist of exactly 3, but you can form blocks from a larger set?
      // If 7 runes, we have 7 of them. Can we form one block of 3, leaving 4?
      // But the prompt says: "7 runes -> 175 G base premium". If we could form a block of 3 (60 G) and 4 singles (100 G), the base premium would be 160 G.
      // But the prompt explicitly states: "7 runes -> 175 G base premium".
      // This implies that if the total count of alike components is not exactly 3 (or a multiple of 3?), blocks are not formed?
      // Wait, "A building block of 3 alike components is offered at a special base premium of 60 G."
      // "4 runes -> 100 G base premium (no block — block requires exactly 3)"
      // "7 runes -> 175 G base premium"
      // "3 runes + 3 moonstones -> 120 G base premium (two separate blocks)"
      // So if count of a component type is 3, it's 60 G. If it is 6, is it 120 G? Yes, "3 runes + 3 moonstones -> 120 G (two separate blocks)", wait, those are different types.
      // But what if we have 6 runes?
      // Let's check how the block rule is defined:
      // "A building block of 3 alike components is offered at a special base premium of 60 G."
      // "4 runes -> 100 G (no block - block requires exactly 3)" -> this says a block requires exactly 3. Meaning, if we have 4 runes, we cannot form a block of 3 and 1 single. We must have exactly 3 runes to get 60 G, otherwise they are priced individually!
      // Yes! "block requires exactly 3" means the entire count of that component type must be a multiple of 3? Or does it mean each group must be exactly 3?
      // If we have 7 runes, the count is 7. If we could group them as (3) + (4) or (3) + (3) + (1), we would get 160 G or 145 G.
      // But the result is 175 G, which is exactly 7 * 25.
      // This means we CANNOT split 7 runes into blocks and singles. If the total number of runes is not a multiple of 3, we cannot apply blocks? Or is it that blocks can only be applied to the total quantity if the total count itself is a multiple of 3?
      // Let's re-read:
      // "7 runes -> 175 G base premium"
      // Yes, 175 G is 7 * 25.
      // If we had 6 runes: is it 120 G (two blocks of 3) or 150 G?
      // If "block requires exactly 3" is interpreted as "the count of that component type must be a multiple of 3 to form blocks", then 6 runes would be 120 G (6 is multiple of 3).
      // If it's literally "the total count of that component type must be exactly 3", then 6 runes would be 150 G (no block can be formed because count is 6, not 3).
      // Wait, is "alike components" defined per type? Yes: "2 runes + 1 moonstone -> 75 G (no block: different types)".
      // So runes and moonstones are separate.
      // Let's implement the logic: for each component type, if the count is a multiple of 3, we can price them in blocks of 3 (60 G per 3)?
      // Wait, if count is 3, premium is 60 G. If count is 6, is it 120 G?
      // Let's look at the wording: "A building block of 3 alike components is offered at a special base premium of 60 G."
      // "4 runes -> 100 G base premium (no block — block requires exactly 3)"
      // This means if count of a component type is 4, no block is applied at all (since we can't divide 4 into blocks of exactly 3 without leaving remainder, or we are not allowed to have any remainder).
      // So, if count % 3 === 0, then we price as (count / 3) * 60.
      // Otherwise, we price as count * 25.
      // Let's check:
      // If count is 3: 3 % 3 === 0 -> 1 * 60 = 60 G.
      // If count is 4: 4 % 3 !== 0 -> 4 * 25 = 100 G.
      // If count is 7: 7 % 3 !== 0 -> 7 * 25 = 175 G.
      // This perfectly matches all examples!
      // Let's write the test with 175 G base premium, which with 10% surcharge (17.5) and 5 G fee would be:
      // 175 + 17.5 + 5 = 197.5 G. In MHPCO's favor, rounded up = 198 G.
      // Wait! Let's check the test expectation.
      expect(processScenario(scenario).results[0]).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone -> 75 G base premium (different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" },
              { type: "moonstone" }
            ]
          }
        ]
      };
      // Base: 75 G. Surcharge: 10% (7.5 G). Fee: 5 G. Total: 75 + 7.5 + 5 = 87.5 -> 88 G
      expect(processScenario(scenario).results[0]).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
            ]
          }
        ]
      };
      // Base: 120 G. Surcharge: 12 G. Fee: 5 G. Total = 137 G
      expect(processScenario(scenario).results[0]).toEqual({ premium: 137 });
    });

    // Modifier scope on multi-item policies
    it("cursed sword (base 100G) and plain amulet (base 60G) -> cursed surcharge applies only to cursed sword -> base premium 160G + 50G surcharge = 210G (excluding fee/other modifiers)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", cursed: true },
              { type: "amulet" }
            ]
          }
        ]
      };
      // Base premium is 100 (sword) + 60 (amulet) = 160.
      // Surcharges:
      // Item-specific modifiers:
      // sword: base 100. cursed adds 50% = 50 G surcharge.
      // amulet: plain, no surcharge.
      // first insurance surcharge is policy-wide or item-wide?
      // Wait, let's look at prompt:
      // "item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item;
      // policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium (the sum of all item base premiums);
      // the processing fee is added at the very end"
      // Wait, let's re-read:
      // "each item in a quote is treated as a first insurance, regardless of customer history."
      // Wait, if first insurance is policy-wide but applies "to each item" or "apply to the policy base premium (the sum of all item base premiums)"?
      // Ah! "policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium"
      // But under "Long-standing customer's second contract", it says:
      // "The first insurance surcharge still applies to the new sword, even though the customer is on a follow-up contract — each item in a quote is treated as a first insurance, regardless of customer history."
      // Wait! If first insurance applies to each item or to the policy base premium?
      // Let's look at "Newcomer with a cursed sword":
      // "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G"
      // Here, 10 G first insurance is 10% of 100 G base.
      // Let's look at "Long-standing customer's second contract":
      // "100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty + 10 G first insurance - 15 G follow-up contract = 155 G + 5 G fee = 160 G"
      // Here:
      // - 100 G base
      // - 50 G curse (50% of 100)
      // - 30 G high enchantment (30% of 100)
      // - 20 G loyalty (20% of 100 base)
      // - 10 G first insurance (10% of 100 base)
      // - 15 G follow-up contract (15% of 100 base)
      // Let's check the modifier definitions in prompt:
      // "- Cursed items add a 50 % risk surcharge.
      //  - Highly enchanted items (enchantment level ≥ 5) add a 30 % risk surcharge.
      //  - Long-standing customers (≥ 2 years of business with MHPCO) receive a 20 % loyalty discount.
      //  - A first insurance carries a 10 % initial assessment surcharge.
      //  - Customers receive a 15 % discount on each contract after their first.
      //  - A 5 G processing fee is added to every premium."
      //
      // Wait, is "first insurance" policy-wide?
      // Let's re-read: "item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item; policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium (the sum of all item base premiums); the processing fee is added at the very end"
      // Let's re-read "Modifier scope on multi-item policies" example carefully:
      // "a policy covers a cursed sword (base premium 100 G) and a plain amulet (base premium 60 G) → policy base premium 160 G; the cursed surcharge adds 50 G (50 % of the cursed sword's base premium, not of the policy total) → 210 G before further modifiers and fee"
      // So policy base premium is 160 G.
      // Cursed surcharge is 50 G.
      // Total before further modifiers and fee = 210 G.
      // What "further modifiers" apply here?
      // Policy-wide modifiers: first insurance!
      // First insurance modifier is 10% policy-wide. It applies to the policy base premium (160 G) -> 16 G.
      // So, if we calculate:
      // Policy base premium = 160 G.
      // Item-specific surcharges = 50 G (cursed sword).
      // Policy-wide modifiers (applied to policy base premium 160 G):
      // - First insurance: +10% of 160 G = +16 G.
      // - (Any loyalty/follow-up? No, customer is newcomer, no follow-up).
      // Fee = 5 G.
      // Total: 160 (base) + 50 (cursed) + 16 (first insurance) + 5 (fee) = 231 G.
      // Let's write the test expecting 231 G!
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 231 });
    });

    // Modifier thresholds & values
    it("customer with exactly 2 years loyalty discount applies (20 % discount)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          }
        ]
      };
      // Base: 100 G.
      // Surcharges: first insurance (10 G).
      // Loyalty discount: 20% of base (100 G) = -20 G.
      // Fee: 5 G.
      // Total = 100 + 10 - 20 + 5 = 95 G.
      expect(processScenario(scenario).results[0]).toEqual({ premium: 95 });
    });
    it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (30 % surcharge)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 5 }]
          }
        ]
      };
      // Base: 100 G.
      // Item-specific: high enchantment = 30 G.
      // Policy-wide: first insurance = 10 G.
      // Fee: 5 G.
      // Total = 100 + 30 + 10 + 5 = 145 G.
      expect(processScenario(scenario).results[0]).toEqual({ premium: 145 });
    });
    it("sword with exactly enchantment 5 and cursed -> both high-enchantment (30 %) and curse (50 %) surcharges apply", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 5, cursed: true }]
          }
        ]
      };
      // Base: 100 G.
      // Item-specific: high enchantment (30 G) + curse (50 G) = 80 G.
      // Policy-wide: first insurance = 10 G.
      // Fee: 5 G.
      // Total = 100 + 80 + 10 + 5 = 195 G.
      expect(processScenario(scenario).results[0]).toEqual({ premium: 195 });
    });
    it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 4 }]
          }
        ]
      };
      // Base: 100 G.
      // Item-specific: none.
      // Policy-wide: first insurance = 10 G.
      // Fee: 5 G.
      // Total = 100 + 10 + 5 = 115 G.
      expect(processScenario(scenario).results[0]).toEqual({ premium: 115 });
    });

    // Integration Examples
    it("Newcomer with a cursed sword (0 years, first insurance, cursed sword) -> should return 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", cursed: true, enchantment: 3 }
            ]
          }
        ]
      };
      // base (100) + curse (50) + first insurance (10) + fee (5) = 165
      expect(processScenario(scenario).results[0]).toEqual({ premium: 165 });
    });
    it("Long-standing customer's second contract (3 years, second contract, cursed sword enchantment 7) -> should return 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }] // First contract of scenario
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", cursed: true, enchantment: 7 }
            ]
          }
        ]
      };
      // Let's check prompt details for "Long-standing customer's second contract":
      // "customer: 3 years with MHPCO; this is the customer's second quote in the scenario"
      // Wait, is contract count tracked sequentially through the scenario?
      // "Customers receive a 15 % discount on each contract after their first."
      // Since steps are processed sequentially, later quotes are follow-up contracts.
      // So the first quote (at index 0) has no follow-up discount.
      // The second quote (at index 1) receives the 15% follow-up contract discount.
      // Let's compute premium for step index 1:
      // Base: 100 G.
      // Item-specific: cursed (+50%) + high enchantment (+30%) = +80 G.
      // Policy-wide: loyalty (-20%) + first insurance (+10%) + follow-up contract (-15%) = -25% of base = -25 G.
      // Fee: 5 G.
      // Total: 100 (base) + 80 (item-specific) - 25 (policy-wide) + 5 (fee) = 160 G.
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  // Claim Operation
  describe("Claim Operation", () => {
    // Edge case / validations
    it("claim references damage entry whose item is not part of policy -> throws error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 100 }]
            }
          }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("claim contains damage entry with negative amount -> throws error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -100 }]
            }
          }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("claim with more damages of a given type than policy covers -> throws error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 }
              ]
            }
          }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });

    // Deductibles
    it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Sword insurance sum is 1000 G, cap is 2000 G. Payout is 500 - 100 = 400 G.
      // Remaining cap: 2000 - 400 = 1600 G.
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Rune insurance sum is 250 G, cap is 500 G. Payout is 200 - 100 = 100 G.
      // Remaining cap: 500 - 100 = 400 G.
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("damage to sword (500 G) and amulet (300 G) -> deductible applies once per damaged item -> payout 600 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }, { type: "amulet" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Payout: (500 - 100) + (300 - 100) = 400 + 200 = 600 G.
      // Policy covers sword (1000) and amulet (600) -> insurance sum 1600 G, cap 3200 G.
      // Remaining cap: 3200 - 600 = 2600 G.
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });

    // Enchantment level / dragon material
    it("damage to item with enchantment level >= 8 reimbursed at 50% -> steel sword, enchantment 9, damage 1000 G -> payout 400 G (500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9 }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // steel sword, enchantment 9: damage is reimbursed at 50% = 500 G.
      // minus deductible: 500 - 100 = 400 G payout.
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to item made of dragon material is fully reimbursed -> dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (800 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon-material", enchantment: 5 }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // dragon material, enchantment 5: fully reimbursed = 800 G.
      // minus deductible: 800 - 100 = 700 G payout.
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("both dragon material and enchantment >= 8: enchantment rule wins -> dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon-material", enchantment: 9 }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // enchantment level 9: reimbursed at 50% = 500 G.
      // minus deductible: 500 - 100 = 400 G payout.
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    // Cap rules
    it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }, { type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 },
                { itemType: "sword", amount: 1000 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Payout: (1000-100) + (1000-100) = 1800 G.
      // Cap is 4000 G.
      // Remaining cap: 4000 - 1800 = 2200 G.
      expect(result.results[1]).toEqual({ payout: 1800, remainingCap: 2200 });
    });
    it("policy covers sword and amulet -> insurance sum 1600 G, cap 3200 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }, { type: "amulet" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 },
                { itemType: "amulet", amount: 600 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Payout: (1000-100) + (600-100) = 1400 G.
      // Cap is 3200 G.
      // Remaining cap: 3200 - 1400 = 1800 G.
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 1800 });
    });
    it("cursed sword (value 1000 G, premium with modifiers 165 G) -> cap 2000 G (premium modifiers do not raise cap)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2200 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Payout: (2200-100) = 2100 G, capped at 2000 G.
      // Remaining cap: 0 G.
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("policy covers sword and 3 runes -> insurance sum 1750 G (block discount affects premium only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" }
            ]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 },
                { itemType: "rune", amount: 250 },
                { itemType: "rune", amount: 250 },
                { itemType: "rune", amount: 250 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      // Payout: (1000-100) + (250-100) * 3 = 900 + 450 = 1350 G.
      // Insurance sum: 1000 + 250 * 3 = 1750 G. Cap: 3500 G.
      // Remaining cap: 3500 - 1350 = 2150 G.
      expect(result.results[1]).toEqual({ payout: 1350, remainingCap: 2150 });
    });
    it("sword insured (value 1000 G, cap 2000 G), two successive claims of 1500 G each -> first claim payouts 1400 G (cap remaining 600 G), second claim payouts 600 G (cap remaining 0 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }]
            }
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  // Rounding rules
  describe("Rounding Rules", () => {
    it("premium calculation yielding 197.5 G -> rounded up to 198 G", () => {
      // Let's design a scenario that yields exactly 197.5 G premium before rounding.
      // E.g., base is 175 G. Surcharge is 10% = 17.5 G. Fee is 5 G.
      // 175 + 17.5 + 5 = 197.5 G.
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }
            ]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(198);
    });
    it("payout calculation yielding 350.5 G -> rounded down to 350 G", () => {
      // Let's design a scenario that yields 350.5 G payout before rounding.
      // If we have steel sword with enchantment 9, damage is 901 G.
      // Reimbursed at 50% = 450.5 G.
      // Minus deductible 100 G = 350.5 G.
      // Rounded down = 350 G.
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9 }]
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 901 }]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(350);
    });
  });
});
