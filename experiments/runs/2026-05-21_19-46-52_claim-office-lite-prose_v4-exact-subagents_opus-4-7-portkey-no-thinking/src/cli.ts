import { processScenario, type Scenario, type Step, type Item } from "./claim-office.js";

type JsonItem = {
  type: Item["kind"];
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type JsonQuoteStep = { op: "quote"; items: JsonItem[] };

type JsonClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
};

type JsonStep = JsonQuoteStep | JsonClaimStep;

type JsonScenario = {
  customer: { yearsWithMHPCO: number };
  steps: JsonStep[];
};

function toItem(json: JsonItem): Item {
  return {
    kind: json.type,
    cursed: json.cursed,
    enchantment: json.enchantment,
    material: json.material,
  };
}

function toStep(json: JsonStep): Step {
  if (json.op === "quote") {
    return { kind: "quote", items: json.items.map(toItem) };
  }
  return {
    kind: "claim",
    policy: json.policy,
    incident: {
      cause: json.incident.cause,
      damages: json.incident.damages,
    },
  };
}

function toScenario(json: JsonScenario): Scenario {
  return {
    customer: json.customer,
    steps: json.steps.map(toStep),
  };
}

function toJsonResult(result: unknown): Record<string, number> {
  const r = result as { kind: "quote" | "claim"; premium?: number; payout?: number };
  if (r.kind === "quote") {
    return { premium: r.premium ?? 0 };
  }
  return { payout: r.payout ?? 0 };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const input = await readStdin();
  const jsonScenario = JSON.parse(input) as JsonScenario;
  const scenario = toScenario(jsonScenario);
  const { results } = processScenario(scenario);
  const output = { results: results.map(toJsonResult) };
  process.stdout.write(JSON.stringify(output));
}

main().catch((err: unknown) => {
  process.stderr.write(`${String(err)}\n`);
  process.exit(1);
});
