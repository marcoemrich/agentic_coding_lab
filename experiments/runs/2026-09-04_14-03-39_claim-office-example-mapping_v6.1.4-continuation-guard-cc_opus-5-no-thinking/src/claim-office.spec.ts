import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { runScenario } from "./claim-office.js";

type CliRun = { stdout: string; stderr: string; exitCode: number };

// Exercises the real stdin/stdout contract by running the CLI as a child
// process, rather than importing it.
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", "src/cli.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk));
    child.stderr.on("data", (chunk: Buffer) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (exitCode) =>
      resolve({ stdout, stderr, exitCode: exitCode ?? 0 }),
    );

    child.stdin.end(input);
  });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      } as const;

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    });
    it("a single sword → base premium 100 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      } as const;

      // 100 base + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      } as const;

      // 60 base + 6 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      } as const;

      // 80 base + 8 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      } as const;

      // 40 base + 4 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune → base premium 25 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      } as const;

      // 25 base + 2.5 first insurance = 27.5 → 28 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      } as const;

      // 25 base + 2.5 first insurance = 27.5 → 28 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      } as const;

      // 50 base + 5 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      } as const;

      // 60 block base + 6 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      } as const;

      // 100 base + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium (no block — block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      } as const;

      // 175 base + 17.5 first insurance = 192.5 → 193 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      } as const;

      // 75 base + 7.5 first insurance = 82.5 → 83 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
            ],
          },
        ],
      } as const;

      // 120 base + 12 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("a cursed sword → 100 G base + 50 G curse surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      } as const;

      // 100 base + 50 curse + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("a sword with enchantment 5 → 100 G base + 30 G high-enchantment surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      } as const;

      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    });
    it("a sword with enchantment 4 → no high-enchantment surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      } as const;

      // 100 base + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("a cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      } as const;

      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
    });
    it("a cursed sword with enchantment 4 → only the curse surcharge applies (100 + 50)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 4 }],
          },
        ],
      } as const;

      // 100 base + 50 curse + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      } as const;

      // 100 base + 10 first insurance − 20 loyalty + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      } as const;

      // 100 base + 10 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("every quote carries a 10 % first-insurance surcharge", () => {
      const quoteAnAmulet = {
        op: "quote",
        items: [{ type: "amulet" }],
      } as const;

      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteAnAmulet, quoteAnAmulet],
      } as const;

      // Each item in a quote is treated as a first insurance regardless of
      // customer history, so the 6 G surcharge is present in both premiums —
      // the second merely also earns the follow-up discount.
      // first: 60 + 6 + 5 = 71; second: 60 + 6 − 9 + 5 = 62
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 71 }, { premium: 62 }],
      });
    });
    it("the second quote of a scenario gets a 15 % follow-up contract discount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      } as const;

      // first: 100 + 10 + 5; second: 100 + 10 − 15 + 5
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("a 5 G processing fee is added to every premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        ],
      } as const;

      // 160 base + 16 first insurance + 5 fee — charged once per policy,
      // not once per item.
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword (100 G) + plain amulet (60 G) → curse surcharge is 50 G (50 % of the cursed item only), policy base 210 G before further modifiers and fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true }, { type: "amulet" }],
          },
        ],
      } as const;

      // 160 policy base + 50 curse (50 % of the sword's 100, not of the 160
      // policy total) + 16 first insurance + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("a premium calculation that yields a half G → rounded up in the MHPCO's favour", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 5 }, () => ({ type: "rune" })),
              { type: "sword" },
              { type: "sword" },
            ],
          },
        ],
      } as const;

      // 325 base + 32.5 first insurance = 357.5 → 358 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 363 }] });
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, first contract) with a cursed steel sword (enchantment 3) → premium 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      } as const;

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed sword (enchantment 7) → premium 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      } as const;

      // first quote: 100 base + 10 first insurance − 20 loyalty + 5 fee = 95
      // second quote: 100 base + 50 curse + 30 high enchantment − 20 loyalty
      //               + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (deductible only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
      } as const;

      // 500 damage − 100 deductible; cap 2×1000 = 2000, so 1600 remains
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      } as const;

      // 200 − 100 deductible; cap 2×250 = 500, so 400 remains
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      } as const;

      // premium: 100 + 30 high enchantment + 10 first insurance + 5 fee = 145
      // payout: full reimbursement 800 − 100 deductible; cap 2000
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      } as const;

      // premium: 100 + 30 high enchantment + 10 first insurance + 5 fee = 145
      // payout: 50 % of 1000 = 500, then − 100 deductible = 400; cap 2000
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      } as const;

      // exactly 8 triggers the halving clause: 500 − 100 deductible
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it(
      "dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)",
      () => {
        const scenario = {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "dragon", enchantment: 9 }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "sword", amount: 1000 }],
              },
            },
          ],
        } as const;

        // both clauses apply; the 50 % rule wins: 500 − 100 deductible
        expect(runScenario(scenario)).toEqual({
          results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
        });
      },
    );
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damages an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (deductible applies once per damaged item)", () => {
      const scenario = {
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
      } as const;

      // (500 − 100) + (300 − 100) = 600; cap 2×1600 = 3200
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      } as const;

      // 50 % of 901 = 450.5, − 100 deductible = 350.5 → 350 (rounded down)
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
  });

  describe("claim — cap exhaustion", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      } as const;

      // insurance sum 1000 + 600 = 1600 → cap 3200; payout 100 leaves 3100
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
      });
    });
    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      } as const;

      // cap rests on the unmodified insurance value: 2×1000, not on the 165 premium
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
      });
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
      const scenario = {
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
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      } as const;

      // premium: 100 + 60 block = 160 base + 16 first insurance + 5 fee = 181
      // insurance sum 1000 + 3×250 = 1750 (undiscounted) → cap 3500
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
      });
    });
    it("a sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      } as const;

      // 1500 − 100 = 1400, within the 2000 cap
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
      });
    });
    it("a sword policy (cap 2000 G), second successive claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
      const claim = {
        op: "claim",
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      } as const;

      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      } as const;

      // the second claim's desired 1400 is reduced to the remaining 600
      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      } as const;

      // both swords count: insurance sum 2000 → cap 4000
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
      });
    });
    it("two sword damage entries against a policy with two swords → each entry gets its own deductible", () => {
      const scenario = {
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
      } as const;

      // (500 − 100) + (300 − 100) = 600; cap 4000
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    });
    it("more damage entries of a type than the policy covers → the claim is rejected with an error", () => {
      const scenario = {
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
      } as const;

      // two sword damages, but only one sword insured
      expect(() => runScenario(scenario)).toThrow(/sword/);
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (e.g. broomstick) → error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      } as const;

      expect(() => runScenario(scenario)).toThrow(/broomstick/);
    });
    it("claim referencing an item that is not part of the policy → error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      } as const;

      // The spec asks only that the claim be rejected and the offending item
      // named; it does not fix the wording. An uncovered type has an insured
      // count of zero, so in practice the count rule refuses it first.
      expect(() => runScenario(scenario)).toThrow(/amulet/);
    });
    it("claim referencing a damaged item with an unknown type → error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      } as const;

      expect(() => runScenario(scenario)).toThrow(/broomstick/);
    });
    it("claim with a damage entry of amount -200 → error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      } as const;

      expect(() => runScenario(scenario)).toThrow(/-200|negative/);
    });
  });

  describe("CLI", () => {
    it(
      "reads a scenario from stdin and writes {results: [...]} to stdout, one result per step in order",
      async () => {
        const scenario = {
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [
                {
                  type: "amulet",
                  material: "silver",
                  enchantment: 2,
                  cursed: false,
                },
              ],
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
        };

        const { stdout } = await runCli(JSON.stringify(scenario));

        // 60 base + 6 first insurance − 12 loyalty = 54 + 5 fee = 59
        // 200 − 100 deductible = 100; cap 2×600 = 1200 → 1100 remains
        expect(JSON.parse(stdout)).toEqual({
          results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
        });
      },
      30000,
    );
    it(
      "exits with a non-zero status code and writes to stderr on an invalid scenario",
      async () => {
        const scenario = {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        };

        const { stderr, exitCode } = await runCli(JSON.stringify(scenario));

        expect(exitCode).not.toBe(0);
        expect(stderr).toContain("broomstick");
        // A described failure, not a crash: no unhandled-rejection noise and
        // no stack trace.
        expect(stderr).not.toMatch(/unhandled|at .*\.ts:\d+/i);
      },
      30000,
    );
    it(
      "writes no results to stdout when the scenario is invalid",
      async () => {
        const scenario = {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        };

        const { stdout } = await runCli(JSON.stringify(scenario));

        expect(stdout).toBe("");
      },
      30000,
    );
  });
});
