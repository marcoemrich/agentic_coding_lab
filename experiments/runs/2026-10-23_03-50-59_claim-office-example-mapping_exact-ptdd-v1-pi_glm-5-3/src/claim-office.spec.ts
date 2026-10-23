import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import { runScenario, type Scenario } from "./claim-office.js";

/** The observable contract of one CLI invocation. */
interface CliOutcome {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Runs a scenario through the domain entry point.
 * Fails the active test if the run rejects or misbehaves.
 */
function expectSuccess(scenario: Scenario): unknown[] {
  const results = runScenario(scenario);
  if (!Array.isArray(results)) {
    throw new Error("expected runScenario to return an array of results");
  }
  return results;
}

const CLI_TIMEOUT_MS = 60_000;

/**
 * Runs a scenario JSON through the claim-office CLI (src/cli.ts) via tsx
 * and resolves the observable CLI contract: exit code, stdout, stderr.
 */
function runCli(scenario: unknown): Promise<CliOutcome> {
  return new Promise((resolve, reject) => {
    const child = spawn("node_modules/.bin/tsx", ["src/cli.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("CLI subprocess timed out"));
    }, CLI_TIMEOUT_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error: Error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (exitCode: number | null) => {
      clearTimeout(timer);
      resolve({ exitCode, stdout, stderr });
    });
    child.stdin.write(JSON.stringify(scenario));
    child.stdin.end();
  });
}

const newCustomer = { yearsWithMHPCO: 0 };

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums and the processing fee ---

  it(
    "quote: empty item list for a new customer yields premium 5 G (only the 5 G processing fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [] }],
      });
      expect(results).toEqual([{ premium: 5 }]);
    }
  );
  it(
    "quote: single plain sword yields premium 115 G (100 base + 10 first-insurance surcharge + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    }
  );
  it(
    "quote: single plain amulet yields premium 71 G (60 base + 6 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(results).toEqual([{ premium: 71 }]);
    }
  );
  it(
    "quote: single plain staff yields premium 93 G (80 base + 8 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(results).toEqual([{ premium: 93 }]);
    }
  );
  it(
    "quote: single plain potion yields premium 49 G (40 base + 4 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(results).toEqual([{ premium: 49 }]);
    }
  );
  it(
    "quote: single rune yields premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 rounded up in MHPCO's favor)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 33 }]);
    }
  );
  it(
    "quote: single moonstone yields premium 33 G (component priced like a rune: 25 base + 2.5 + 5 fee, rounded up)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });
      expect(results).toEqual([{ premium: 33 }]);
    }
  );

  // --- Quote: building blocks of 3 alike components ---

  it(
    "quote: two runes yield premium 60 G (50 G base premium: 2 x 25, no block; + 5 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 60 }]);
    }
  );
  it(
    "quote: three runes yield premium 71 G (building block of exactly 3 alike components: 60 G base premium + 6 + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(results).toEqual([{ premium: 71 }]);
    }
  );
  it(
    "quote: four runes yield premium 115 G (no block for 4: 100 G base premium + 10 + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }]);
    }
  );
  it(
    "quote: seven runes yield premium 198 G (175 G base premium + 17.5 first insurance + 5 fee = 197.5 rounded up)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        ],
      });
      expect(results).toEqual([{ premium: 198 }]);
    }
  );
  it(
    "quote: 2 runes + 1 moonstone yield premium 88 G (75 G base premium: no block because types differ; 87.5 rounded up)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });
      expect(results).toEqual([{ premium: 88 }]);
    }
  );
  it(
    "quote: 3 runes + 3 moonstones yield premium 137 G (two separate blocks: 120 G base premium + 12 + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ] },
        ],
      });
      expect(results).toEqual([{ premium: 137 }]);
    }
  );

  // --- Quote: item-specific and policy-wide modifiers ---

  it(
    "quote: newcomer (0 years, first contract) with a cursed steel sword (enchantment 3) yields premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 165 }]);
    }
  );
  it(
    "quote: plain sword with enchantment exactly 5 yields premium 145 G (100 + 30 high-enchantment surcharge + 10 + 5)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        ],
      });
      expect(results).toEqual([{ premium: 145 }]);
    }
  );
  it(
    "quote: cursed sword with enchantment exactly 5 yields premium 195 G (both surcharges apply: 100 + 50 curse + 30 high enchantment + 10 + 5)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 195 }]);
    }
  );
  it(
    "quote: plain sword with enchantment 4 yields premium 115 G (no high-enchantment surcharge below level 5)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }]);
    }
  );
  it(
    "quote: cursed sword with enchantment 4 yields premium 165 G (curse surcharge applies, high-enchantment surcharge does not)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 165 }]);
    }
  );
  it(
    "quote: cursed sword plus plain amulet yields premium 231 G (curse surcharge 50 % applies only to the sword's 100 G base, not the 160 G policy total: 160 + 50 + 16 first insurance + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ] },
        ],
      });
      expect(results).toEqual([{ premium: 231 }]);
    }
  );
  it(
    "quote: customer with exactly 2 years with MHPCO gets the loyalty discount (plain sword: 100 - 20 loyalty + 10 first insurance + 5 fee = 95 G)",
    () => {
      const results = expectSuccess({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        ],
      });
      expect(results).toEqual([{ premium: 95 }]);
    }
  );
  it(
    "quote: customer with 1 year gets no loyalty discount (plain sword: 115 G)",
    () => {
      const results = expectSuccess({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }]);
    }
  );
  it(
    "quote: second contract in the same scenario gets the 15 % follow-up discount (two sword quotes: first 115 G, second 100 - 15 + 10 + 5 = 100 G)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    }
  );
  it(
    "quote: long-standing customer's second contract with a cursed sword (enchantment 7) yields premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)",
    () => {
      const results = expectSuccess({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 95 }, { premium: 160 }]);
    }
  );

  // --- Claim: reimbursement clauses and deductible ---

  it(
    "claim: regular steel sword (enchantment 3), damage 500 G -> payout 400 G, remainingCap 1600 (full reimbursement minus 100 G deductible; cap 2 x 1000)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
    }
  );
  it(
    "claim: damage 200 G to an insured rune -> payout 100 G, remainingCap 400 (runes have no enchantment level or material, so no special clause; cap 2 x 250)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "frost", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
    }
  );
  it(
    "claim: dragon-material sword with enchantment exactly 8, damage 1000 G -> payout 400 G, remainingCap 1600 (high-enchantment clause applies, then deductible: 500 - 100)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    }
  );
  it(
    "claim: dragon-material sword enchantment 9, damage 1000 G -> payout 400 G, remainingCap 1600 (both clauses apply; the 50 % rule wins: 500 - 100)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    }
  );
  it(
    "claim: dragon-material sword enchantment 5, damage 800 G -> payout 700 G, remainingCap 1300 (only the dragon-material clause applies: full reimbursement, then deductible: 800 - 100)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
    }
  );
  it(
    "claim: steel sword enchantment 9, damage 1000 G -> payout 400 G, remainingCap 1600 (only the high-enchantment clause applies: 50 % first, then deductible: 500 - 100)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    }
  );
  it(
    "claim: dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G, remainingCap 2600 (the 100 G deductible applies once per damaged item; cap 2 x 1600)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
    }
  );
  it(
    "claim: policy covers two swords; two sword damage entries (400 G, 300 G) -> payout 500 G, remainingCap 3500 (each entry is a separate damage with its own deductible; cap 2 x 2000)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
            { itemType: "sword", amount: 400 },
            { itemType: "sword", amount: 300 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 225 }, { payout: 500, remainingCap: 3500 }]);
    }
  );

  // --- Claim: payout cap ---

  it(
    "claim: policy covers two swords; single sword damage 4200 G -> payout 4000 G, remainingCap 0 (cap = 2 x insurance sum 2000 G)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
            { itemType: "sword", amount: 4200 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 225 }, { payout: 4000, remainingCap: 0 }]);
    }
  );
  it(
    "claim: policy covers sword + amulet; sword damage 3400 G -> payout 3200 G, remainingCap 0 (insurance sum 1600 G, cap 3200 G)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: 3400 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 181 }, { payout: 3200, remainingCap: 0 }]);
    }
  );
  it(
    "claim: policy covers sword + 3 runes (a block); sword damage 3600 G -> payout 3500 G, remainingCap 0 (block discount affects the premium only; insurance sum 1750 G, cap 3500 G)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: 3600 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 181 }, { payout: 3500, remainingCap: 0 }]);
    }
  );
  it(
    "claim: cursed sword, damage 5000 G -> payout 2000 G, remainingCap 0 (cap is based on the unmodified insurance value 1000 G; premium modifiers do not raise the cap)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "curse backlash", damages: [
            { itemType: "sword", amount: 5000 },
          ] } },
        ],
      });
      expect(results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
    }
  );
  it(
    "claim: two successive claims of 1500 G each on an insured sword -> first payout 1400 G with remainingCap 600, second payout 600 G with remainingCap 0 (desired 1400 reduced to the remaining cap)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(results).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    }
  );
  it(
    "claim: steel sword enchantment 9, damage 901 G -> payout 350 G, remainingCap 1650 (450.5 - 100 = 350.5 rounded down in MHPCO's favor)",
    () => {
      const results = expectSuccess({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 901 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
    }
  );

  // --- CLI contract (subprocess: exit codes, stdout, stderr) ---

  it(
    'CLI: schema example end-to-end - customer 5 years, amulet (silver, enchantment 2), quote then claim of 200 G -> exit 0 and stdout {"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}',
    async () => {
      const { exitCode, stdout } = await runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(exitCode).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    },
    CLI_TIMEOUT_MS
  );
  it(
    "CLI: quote containing an unknown item type (broomstick) -> non-zero exit, error description on stderr, no results written to stdout",
    async () => {
      const { exitCode, stdout, stderr } = await runCli({
        customer: newCustomer,
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.length).toBeGreaterThan(0);
    },
    CLI_TIMEOUT_MS
  );
  it(
    "CLI: claim references a damaged amulet when only a sword is insured -> non-zero exit, error description on stderr, no results on stdout",
    async () => {
      const { exitCode, stdout, stderr } = await runCli({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      });
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.length).toBeGreaterThan(0);
    },
    CLI_TIMEOUT_MS
  );
  it(
    "CLI: claim damage entry with unknown itemType (broomstick) -> non-zero exit, error description on stderr, no results on stdout",
    async () => {
      const { exitCode, stdout, stderr } = await runCli({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } },
        ],
      });
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.length).toBeGreaterThan(0);
    },
    CLI_TIMEOUT_MS
  );
  it(
    "CLI: claim damage entry with amount -200 -> non-zero exit, error description on stderr, no results on stdout",
    async () => {
      const { exitCode, stdout, stderr } = await runCli({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.length).toBeGreaterThan(0);
    },
    CLI_TIMEOUT_MS
  );
  it(
    "CLI: two sword damage entries against a policy covering only one sword -> non-zero exit, error description on stderr, no results on stdout (the whole claim is rejected)",
    async () => {
      const { exitCode, stdout, stderr } = await runCli({
        customer: newCustomer,
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
            { itemType: "sword", amount: 400 },
            { itemType: "sword", amount: 300 },
          ] } },
        ],
      });
      expect(exitCode).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.length).toBeGreaterThan(0);
    },
    CLI_TIMEOUT_MS
  );
});
