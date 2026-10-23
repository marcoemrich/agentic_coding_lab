import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type QuoteItem } from "./claim-office.js";

function runCli(input: string): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input,
    encoding: "utf8",
  });
}

function quotePremium(items: readonly QuoteItem[], yearsWithMHPCO = 0): number {
  const outcome = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (outcome.results[0] as { premium: number }).premium;
}

// MHPCO Claim Office — complete inactive test list (spec: prompt.md).
// Domain tests drive the scenario processor directly; error-contract tests
// (marked CLI) observe the `claim-office` CLI: non-zero exit status and an
// error description on stderr with no `results` on stdout, exactly as the
// specification establishes.

describe("MHPCO claim office", () => {
  describe("quote: base premiums (newcomer, 0 years, first contract)", () => {
    it("1. empty item list -> premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
    it("2. plain sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("3. plain amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("4. plain staff -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("5. plain potion -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
    it("6. single rune component -> premium 33 G (25 base, 32.5 before fee rounds up)", () => {
      expect(quotePremium([{ type: "rune" }])).toBe(33);
    });
  });

  describe("quote: building block of 3 alike components", () => {
    it("7. 2 runes -> premium 60 G (50 base, no block)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("8. 3 runes -> premium 71 G (block base 60)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("9. 4 runes -> premium 115 G (100 base; block requires exactly 3)", () => {
      const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
      expect(quotePremium(fourRunes)).toBe(115);
    });
    it("10. 7 runes -> premium 198 G (175 base, 197.5 rounded up in MHPCO's favor)", () => {
      const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quotePremium(sevenRunes)).toBe(198);
    });
    it("11. 2 runes + 1 moonstone -> premium 88 G (75 base, no block: different types; 87.5 rounds up)", () => {
      expect(
        quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      ).toBe(88);
    });
    it("12. 3 runes + 3 moonstones -> premium 137 G (120 base: two separate blocks)", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];
      expect(quotePremium(items)).toBe(137);
    });
  });

  describe("quote: item-specific modifiers apply to the affected item only", () => {
    it("13. cursed sword + plain amulet -> premium 231 G (policy base 160, curse adds 50 on sword only; first insurance 10% of policy base; 210+16+5)", () => {
      expect(
        quotePremium([
          { type: "sword", cursed: true },
          { type: "amulet" },
        ]),
      ).toBe(231);
    });
    it("14. sword enchantment exactly 5 -> premium 145 G (100+30 surcharge, first insurance 10 on policy base, +5 fee)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("15. sword enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("16. cursed sword enchantment 5 -> premium 195 G (both surcharges: 100+50+30, first insurance 10, +5 fee)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("17. customer with exactly 2 years -> premium 95 G for plain sword (20% loyalty discount applies)", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("18. customer with 1 year -> premium 115 G for plain sword (no loyalty discount)", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("19. second quote in scenario -> 15% follow-up contract discount: first sword quote 115 G, second 100 G", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect((outcome.results[0] as { premium: number }).premium).toBe(115);
      expect((outcome.results[1] as { premium: number }).premium).toBe(100);
    });
  });

  describe("quote: integration examples", () => {
    it("20. newcomer with cursed steel sword enchantment 3 -> premium 165 G", () => {
      expect(
        quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
      ).toBe(165);
    });
    it("21. 3-year customer's second quote, cursed sword enchantment 7 -> premium 160 G (first insurance still applies per item)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect((outcome.results[1] as { premium: number }).premium).toBe(160);
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("22. steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600 (cap 2000)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("23. rune, damage 200 -> payout 100, remainingCap 400 (cap 500; no special clause for components)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("24. dragon attack damages sword (500) and amulet (300) -> payout 600, remainingCap 2600 (deductible once per damage entry, cap 3200)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
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
      expect(outcome.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim: enchantment >= 8 clause and dragon material", () => {
    it("25. steel sword enchantment 9, damage 1000 -> payout 400 (50% then deductible)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("26. dragon sword enchantment exactly 8, damage 1000 -> payout 400 (threshold applies, 50% then deductible)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("27. dragon sword enchantment 9, damage 1000 -> payout 400 (both clauses; the 50% rule wins)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("28. dragon sword enchantment 5, damage 800 -> payout 700 (full reimbursement, then deductible)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("claim: cap is twice the insurance sum of unmodified values", () => {
    it("29. cursed sword, damage 500 -> payout 400, remainingCap 1600 (cap 2000 from unmodified insurance value)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("30. sword + 3 rune block, sword damage 200 -> payout 100, remainingCap 3400 (insurance sum 1750; block affects premium only)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("31. two swords, both damaged 500 and 300 -> payout 600, remainingCap 3400 (insurance sum 2000, cap 4000; separate deductibles)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
      expect(outcome.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("32. staff policy, damage 200 -> payout 100, remainingCap 1500 (insurance value 800, cap 1600)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "staff", amount: 200 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("33. potion policy, damage 200 -> payout 100, remainingCap 700 (insurance value 400, cap 800)", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spill", damages: [{ itemType: "potion", amount: 200 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 100, remainingCap: 700 });
    });
    it("34. cap exhaustion: sword, claim 1500 -> payout 1400 remaining 600; second claim 1500 -> payout 600 remaining 0", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(outcome.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(outcome.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("35. payout rounds down in MHPCO's favor: steel sword enchantment 9, damage 901 -> 450.5 - 100 = 350.5 -> payout 350", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "duel", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      expect((outcome.results[1] as { payout: number }).payout).toBe(350);
    });
  });

  describe("multi-step scenarios", () => {
    it("36. schema example: 5-year customer, quote amulet (silver, enchantment 2) -> premium 59; claim damage 200 -> payout 100, remainingCap 1100", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
      expect(outcome.results[0]).toEqual({ premium: 59 });
      expect(outcome.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });

  describe("CLI contract", () => {
    it("37. CLI writes {results} JSON to stdout and exits 0 for a valid scenario", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      );
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout) as {
        results: [{ premium: number }, { payout: number; remainingCap: number }];
      };
      expect(parsed.results).toEqual([
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
    it("38. CLI: quote with unknown item type (broomstick) -> non-zero exit, error on stderr, no results on stdout", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("39. CLI: claim damaging an item not part of the policy -> non-zero exit, error on stderr", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("40. CLI: claim with an unknown damage item type -> non-zero exit, error on stderr", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
            },
          ],
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("41. CLI: claim with negative damage amount -> non-zero exit, error on stderr", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("42. CLI: more damage entries of a type than insured (two sword damages, one sword) -> non-zero exit, whole claim rejected", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
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
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
  });
});
