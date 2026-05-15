import { quote, claim } from "./claim-office.js";

declare const process: {
  stdin: {
    setEncoding(enc: string): void;
    on(event: string, listener: (chunk?: unknown) => void): void;
  };
  stdout: { write(s: string): void };
  stderr: { write(s: string): void };
  exit(code: number): never;
};

type Customer = { yearsWithMHPCO: number; previousContracts?: number };
type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: unknown) => {
      data += String(chunk);
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function die(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

type PolicyRecord = {
  items: Item[];
  remainingCap: number;
};

function run(scenario: Scenario): { results: unknown[] } {
  const results: unknown[] = [];
  const policies: Record<number, PolicyRecord> = {};
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          die(`Unknown item type: ${item.type}`);
        }
      }
      const customer: Customer = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        previousContracts: quoteCount,
      };
      const normalizedItems = step.items.map((item) => ({
        type: item.type,
        material: item.material ?? "",
        enchantment: item.enchantment ?? 0,
        cursed: item.cursed ?? false,
      }));
      const { premium } = quote({ customer, items: normalizedItems });
      results.push({ premium });

      const insuranceSum = step.items.reduce(
        (sum, item) => sum + insuranceValue(item.type),
        0,
      );
      policies[index] = {
        items: step.items,
        remainingCap: insuranceSum * 2,
      };
      quoteCount += 1;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        die(`Claim references unknown policy: ${step.policy}`);
      }
      const damages = step.incident.damages;

      // Validate damages: amount >= 0; itemType exists in policy in sufficient quantity
      const typeCounts: Record<string, number> = {};
      for (const it of policy.items) {
        typeCounts[it.type] = (typeCounts[it.type] ?? 0) + 1;
      }
      const damageCounts: Record<string, number> = {};
      for (const d of damages) {
        if (d.amount < 0) {
          die(`Negative damage amount: ${d.amount}`);
        }
        if (!KNOWN_ITEM_TYPES.has(d.itemType)) {
          die(`Unknown item type in damage: ${d.itemType}`);
        }
        damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
        if (damageCounts[d.itemType] > (typeCounts[d.itemType] ?? 0)) {
          die(
            `Damage references more items of type ${d.itemType} than insured`,
          );
        }
      }

      const result = claim(
        { items: policy.items },
        step.incident,
        { remainingCap: policy.remainingCap },
      );
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    } else {
      die(`Unknown step op: ${JSON.stringify(step)}`);
    }
  });

  return { results };
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function insuranceValue(type: string): number {
  return INSURANCE_VALUES[type] ?? 0;
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const scenario: Scenario = JSON.parse(raw);
    const output = run(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    die(msg);
  }
}

main();
