type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

export type { Scenario, Step, Item, ClaimStep, QuoteStep };

const ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE = 25;
const COMPONENT_VALUE = 250;
const COMPONENT_BLOCK_BASE = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function basePremiumFor(item: Item, group: Item[]): number {
  if (isComponent(item.type)) {
    const count = group.filter((g) => g.type === item.type).length;
    if (count === 3) return COMPONENT_BLOCK_BASE / 3;
    return COMPONENT_BASE;
  }
  if (ITEM_BASE[item.type] === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return ITEM_BASE[item.type];
}

function valueFor(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_VALUE;
  if (ITEM_VALUE[item.type] === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return ITEM_VALUE[item.type];
}

function roundUp(n: number): number {
  return Math.ceil(n - 1e-9);
}

function roundDown(n: number): number {
  return Math.floor(n + 1e-9);
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  capRemaining: number;
}

export function run(scenario: Scenario): { results: unknown[] } {
  const results: unknown[] = [];
  const policies: Policy[] = [];
  let contractCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      contractCount += 1;
      const items = step.items;

      const itemPremiums = items.map((item) => ({
        base: basePremiumFor(item, items),
        item,
      }));

      const policyBase = itemPremiums.reduce((sum, p) => sum + p.base, 0);

      let itemSurcharge = 0;
      for (const { base, item } of itemPremiums) {
        if (item.cursed) itemSurcharge += base * 0.5;
        if ((item.enchantment ?? 0) >= 5) itemSurcharge += base * 0.3;
      }

      let policyWide = 0;
      if (scenario.customer.yearsWithMHPCO >= 2) policyWide -= policyBase * 0.2;
      policyWide += policyBase * 0.1;
      if (contractCount > 1) policyWide -= policyBase * 0.15;

      const beforeFee = policyBase + itemSurcharge + policyWide;
      const premium = roundUp(beforeFee + 5);

      let insuranceSum = 0;
      for (const item of items) {
        insuranceSum += valueFor(item);
      }

      policies.push({
        items,
        insuranceSum,
        capRemaining: insuranceSum * 2,
      });

      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      const damages = step.incident.damages;

      for (const d of damages) {
        if (d.amount < 0) throw new Error("negative damage amount");
        if (!policy.items.some((it) => it.type === d.itemType)) {
          throw new Error(`item ${d.itemType} not part of policy`);
        }
      }

      const counts: Record<string, number> = {};
      for (const d of damages) counts[d.itemType] = (counts[d.itemType] ?? 0) + 1;
      for (const [type, count] of Object.entries(counts)) {
        const insured = policy.items.filter((it) => it.type === type).length;
        if (count > insured) {
          throw new Error(`claim references more ${type} than insured`);
        }
      }

      let rawPayout = 0;
      for (const d of damages) {
        const item = policy.items.find((it) => it.type === d.itemType)!;
        let reimburse = d.amount;
        if ((item.enchantment ?? 0) >= 8) {
          reimburse = d.amount * 0.5;
        } else if (item.material === "dragon") {
          reimburse = d.amount;
        }
        rawPayout += reimburse - 100;
      }

      const payout = roundDown(Math.min(rawPayout, policy.capRemaining));
      policy.capRemaining -= payout;

      results.push({ payout, remainingCap: policy.capRemaining });
    }
  }

  return { results };
}

export function main(): number {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (c) => chunks.push(typeof c === "string" ? Buffer.from(c) : c));
  process.stdin.on("end", () => {
    try {
      const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const result = run(scenario);
      process.stdout.write(JSON.stringify(result) + "\n");
    } catch (err) {
      process.stderr.write((err instanceof Error ? err.message : String(err)) + "\n");
      process.exitCode = 1;
    }
  });
  return 0;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  main();
}