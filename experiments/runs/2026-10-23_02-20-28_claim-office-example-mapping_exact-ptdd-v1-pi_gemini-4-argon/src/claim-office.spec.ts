import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";
import { runCli } from "./cli.js";

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a single plain sword for a newcomer as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes each main item type using its price-list base premium: amulet (60 G -> 71 G), staff (80 G -> 93 G), potion (40 G -> 49 G)", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      }),
    ).toEqual({ results: [{ premium: 71 }] });
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      }),
    ).toEqual({ results: [{ premium: 93 }] });
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      }),
    ).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes at 25 G each (50 G base -> 60 G total for a newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes a building block of exactly 3 runes at the special 60 G base premium (71 G total for a newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without the block discount at 100 G base premium (115 G total for a newcomer)", () => {
    const output = processScenario({
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
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base premium and rounds 197.5 G up to 198 G in the MHPCO's favor", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("treats alike components strictly by exact type: 2 runes + 1 moonstone has 75 G base premium (88 G total for a newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("applies separate building blocks to 3 runes + 3 moonstones for 120 G base premium (137 G total for a newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
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
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });
  it("adds a 50% curse surcharge to a cursed sword for a newcomer: 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds a 30% high-enchantment surcharge when enchantment is at least 5 (sword with enchantment 5 -> 145 G, enchantment 4 -> 115 G)", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 145 }] });
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 4, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("stacks curse and high-enchantment surcharges on the same item (cursed sword with enchantment 5 -> 195 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 195 }] });
  });
  it("scopes item-specific surcharges only to the affected item on a multi-item policy (cursed sword 100 G + plain amulet 60 G -> 210 G before policy modifiers and fee, 231 G total)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount when customer has at least 2 years with MHPCO (exactly 2 years on a plain sword -> 95 G)", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      }),
    ).toEqual({ results: [{ premium: 95 }] });
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies the 15% follow-up contract discount and 10% first-insurance surcharge on a long-standing customer's second quote (cursed sword, enchantment 7 -> 160 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion" }],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 41 }, { premium: 160 }],
    });
  });
  it("processes a standard claim with full reimbursement minus 100 G deductible (steel sword enchantment 3, damage 500 G -> payout 400 G, remainingCap 1600 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 3,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("processes a claim on a rune with full reimbursement minus 100 G deductible and 250 G insurance value (damage 200 G -> payout 100 G, remainingCap 400 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });
  it("sets policy cap to twice the insurance sum for each item type: amulet (1200 G), staff (1600 G), potion (800 G), moonstone (500 G)", () => {
    const checkCapForItemType = (itemType: string) =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: itemType }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType, amount: 200 }],
            },
          },
        ],
      }).results[1];

    expect(checkCapForItemType("amulet")).toEqual({
      payout: 100,
      remainingCap: 1100,
    });
    expect(checkCapForItemType("staff")).toEqual({
      payout: 100,
      remainingCap: 1500,
    });
    expect(checkCapForItemType("potion")).toEqual({
      payout: 100,
      remainingCap: 700,
    });
    expect(checkCapForItemType("moonstone")).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("applies the 100 G deductible per damaged item in an incident (sword 500 G + amulet 300 G -> payout 600 G, remainingCap 2600 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
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
    expect(output).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });
  it("reimburses items with enchantment >= 8 at 50% before the 100 G deductible (steel sword enchantment 9, damage 1000 G -> payout 400 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 9,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "arcane overload",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("reimburses dragon-material items with enchantment < 8 in full before deductible (dragon sword enchantment 5, damage 800 G -> payout 700 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 5,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("gives precedence to the 50% high-enchantment clause on dragon-material items with enchantment >= 8 (enchantment 8 and 9, damage 1000 G -> payout 400 G)", () => {
    for (const enchantment of [8, 9]) {
      const output = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "cataclysm",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    }
  });
  it("rounds fractional claim payouts down to whole G in the MHPCO's favor (350.5 G -> 350 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fracture",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });
  it("computes insurance sum from unmodified item values regardless of premium modifiers or 3-component blocks (cursed sword cap 2000 G; sword + 3 runes sum 1750 G, cap 3500 G)", () => {
    const cursedSwordScenario = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse backfire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(cursedSwordScenario).toEqual({
      results: [
        { premium: 165 },
        { payout: 400, remainingCap: 1600 },
      ],
    });

    const swordAndRunesScenario = processScenario({
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
            cause: "theft",
            damages: [{ itemType: "sword", amount: 600 }],
          },
        },
      ],
    });
    expect(swordAndRunesScenario).toEqual({
      results: [
        { premium: 181 },
        { payout: 500, remainingCap: 3000 },
      ],
    });
  });
  it("caps total payout across successive claims at twice the insurance sum (sword cap 2000 G, two 1500 G claims -> first payout 1400 G remaining 600 G, second payout 600 G remaining 0 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "duel",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ambush",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("handles policies covering multiple items of the same type with separate deductibles and combined cap (two swords -> cap 4000 G, two sword damages in one incident)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", enchantment: 3 },
            { type: "sword", enchantment: 9 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 255 },
        { payout: 800, remainingCap: 3200 },
      ],
    });
  });
  it("rejects a quote containing an unknown item type (e.g. broomstick) by throwing an error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type/i);
  });
  it("rejects a claim referencing an item type not covered by the policy or an unknown item type by throwing an error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/not covered/i);

    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/not covered|unknown item type/i);
  });
  it("rejects a claim with more damage entries of an item type than the policy covers (e.g. two sword damages when only one sword is insured) by throwing an error", () => {
    expect(() =>
      processScenario({
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
    ).toThrow(/not covered/i);
  });
  it("rejects a claim containing a negative damage amount (e.g. -200) by throwing an error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/negative|invalid damage amount/i);
  });
  it("executes a valid scenario via the CLI entry point src/cli.ts reading JSON from stdin and writing JSON results to stdout", () => {
    const input = JSON.stringify({
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
    });
    let inProcessStdout = "";
    let inProcessStderr = "";
    const inProcessExitCode = runCli(
      input,
      (text) => {
        inProcessStdout += text;
      },
      (text) => {
        inProcessStderr += text;
      },
    );
    expect(inProcessExitCode).toBe(0);
    expect(inProcessStderr).toBe("");
    expect(JSON.parse(inProcessStdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });

    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input,
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("exits with a non-zero status code, writes an error description to stderr, and writes no results to stdout when the CLI receives an invalid scenario", () => {
    const invalidInputs = [
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
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
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ];

    for (const invalidInput of invalidInputs) {
      let stdout = "";
      let stderr = "";
      const exitCode = runCli(
        invalidInput,
        (text) => {
          stdout += text;
        },
        (text) => {
          stderr += text;
        },
      );
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.trim().length).toBeGreaterThan(0);
    }

    const subprocessResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: invalidInputs[0],
        encoding: "utf8",
      },
    );
    expect(subprocessResult.status).not.toBe(0);
    expect(subprocessResult.stdout).toBe("");
    expect(subprocessResult.stderr.trim().length).toBeGreaterThan(0);
  });
});
