// cli.ts
import { processScenario } from "./claim-office.js";

const ITEM_TYPE_MAP: Record<string, string> = {
  sword: "Sword",
  amulet: "Amulet",
  staff: "Staff",
  potion: "Potion",
  rune: "Rune",
  moonstone: "Moonstone",
};

const normalizeItemType = (type: string): string =>
  ITEM_TYPE_MAP[type.toLowerCase()] ?? type;

const normalizeItem = (item: any) => ({
  ...item,
  type: normalizeItemType(item.type),
});

const normalizeDamage = (damage: any) => ({
  ...damage,
  itemType: normalizeItemType(damage.itemType),
});

const normalizeStep = (step: any) => {
  if (step.op === "quote") {
    return {
      type: "quote",
      items: (step.items ?? []).map(normalizeItem),
    };
  }
  if (step.op === "claim") {
    return {
      type: "claim",
      policy: step.policy,
      incident: {
        ...step.incident,
        damages: (step.incident?.damages ?? []).map(normalizeDamage),
      },
    };
  }
  throw new Error(`Unknown step op: ${step.op}`);
};

const normalizeCustomer = (customer: any) => ({
  name: customer?.name ?? "",
  years: customer?.yearsWithMHPCO ?? customer?.years ?? 0,
  contracts: customer?.contracts ?? 0,
});

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async () => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const normalized = {
      customer: normalizeCustomer(scenario.customer),
      steps: (scenario.steps ?? []).map(normalizeStep),
    };
    const output = processScenario(normalized);
    process.stdout.write(JSON.stringify(output));
    process.stdout.write("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
};

main();
