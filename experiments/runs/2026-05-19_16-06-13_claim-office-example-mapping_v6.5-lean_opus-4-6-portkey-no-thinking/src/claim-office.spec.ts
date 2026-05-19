import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("empty item list returns premium of 5 G (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("single sword returns premium of 115 G (100 base + 10 first insurance + 5 fee)");
    it.todo("single amulet returns premium of 71 G (60 base + 6 first insurance + 5 fee)");
    it.todo("single staff returns premium of 93 G (80 base + 8 first insurance + 5 fee)");
    it.todo("single potion returns premium of 49 G (40 base + 4 first insurance + 5 fee)");
    it.todo("single rune component returns premium of 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)");
  });

  describe("Quote - component block pricing", () => {
    it.todo("2 runes return premium of 61 G (50 base + 5 first insurance + 5 fee, rounded up)");
    it.todo("3 alike runes return premium of 72 G (60 block base + 6 first insurance + 5 fee, rounded up)");
    it.todo("4 runes return premium of 116 G (100 base + 10 first insurance + 5 fee, rounded up)");
    it.todo("3 runes + 3 moonstones return two blocks at 120 base premium");
  });

  describe("Quote - cursed surcharge", () => {
    it.todo("cursed sword adds 50% surcharge to that item's base premium");
  });

  describe("Quote - high enchantment surcharge", () => {
    it.todo("sword with enchantment 5 adds 30% surcharge to that item's base premium");
    it.todo("sword with enchantment 4 does not add high-enchantment surcharge");
  });

  describe("Quote - cursed and high enchantment combined", () => {
    it.todo("cursed sword with enchantment 5 applies both surcharges to item base premium");
  });

  describe("Quote - modifier scope on multi-item policy", () => {
    it.todo("cursed sword and plain amulet: cursed surcharge applies only to sword's base premium");
  });

  describe("Quote - loyalty discount", () => {
    it.todo("customer with 2+ years gets 20% loyalty discount on policy base premium");
    it.todo("customer with less than 2 years gets no loyalty discount");
  });

  describe("Quote - follow-up contract discount", () => {
    it.todo("second quote in scenario gets 15% follow-up discount on policy base premium");
  });

  describe("Quote - integration: newcomer with cursed sword", () => {
    it.todo("newcomer with cursed steel sword enchantment 3 pays 165 G");
  });

  describe("Quote - integration: long-standing customer second contract", () => {
    it.todo("3-year customer second quote with cursed enchantment-7 sword pays 160 G");
  });

  describe("Quote - rounding", () => {
    it.todo("premium is rounded up to whole G in MHPCO's favor");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("regular sword damage 500 G returns payout 400 G (full minus 100 deductible)");
    it.todo("rune damage 200 G returns payout 100 G (full minus 100 deductible)");
  });

  describe("Claim - high enchantment reimbursement", () => {
    it.todo("sword enchantment 8+ damage reimbursed at 50% then deductible applied");
  });

  describe("Claim - dragon material reimbursement", () => {
    it.todo("dragon-material sword damage is fully reimbursed minus deductible");
  });

  describe("Claim - both enchantment and dragon material", () => {
    it.todo("dragon-material sword enchantment 9 uses 50% rule then deductible");
    it.todo("dragon-material sword enchantment 5 uses full reimbursement then deductible");
  });

  describe("Claim - deductible per item", () => {
    it.todo("multiple damaged items each get their own 100 G deductible");
  });

  describe("Claim - cap", () => {
    it.todo("total payout per policy is capped at 2x insurance sum");
    it.todo("successive claims exhaust the cap progressively");
  });

  describe("Claim - payout rounding", () => {
    it.todo("payout is rounded down to whole G in MHPCO's favor");
  });

  describe("Validation", () => {
    it.todo("unknown item type in quote throws error");
    it.todo("damage to item not in policy throws error");
    it.todo("more damages of a type than policy covers throws error");
    it.todo("negative damage amount throws error");
  });
});
