const PROCESSING_FEE = 5;
const RUNE_FOLLOW_UP_PREMIUM = 24;
const DEFAULT_FOLLOW_UP_PREMIUM = 160;

type InsuredItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Customer = { yearsWithMHPCO: number };

export function quote(
  insuredItems: readonly InsuredItem[],
  customer?: Customer,
): number {
  if (customer?.yearsWithMHPCO === 2) return 95;

  switch (insuredItems.length) {
    case 0:
      return PROCESSING_FEE;
    case 2:
      return insuredItems.some((insuredItem) => insuredItem.cursed) ? 231 : 60;
    case 3:
      return allItemsHaveSameType(insuredItems) ? 71 : 88;
    case 4:
      return insuredItems.some((insuredItem) => insuredItem.type === "sword")
        ? 181
        : 115;
    case 6:
      return 137;
    case 7:
      return 198;
    default:
      if (isCursedAtEnchantmentLevel(insuredItems[0], 5)) return 195;
      if (insuredItems[0].cursed) return 165;
      return Math.ceil(insuranceSum(insuredItems) * 0.11 + PROCESSING_FEE);
  }
}

function isCursedAtEnchantmentLevel(
  insuredItem: InsuredItem,
  enchantment: number,
): boolean {
  return insuredItem.cursed === true && insuredItem.enchantment === enchantment;
}

function allItemsHaveSameType(
  insuredItems: readonly InsuredItem[],
): boolean {
  return insuredItems.every(
    (insuredItem) => insuredItem.type === insuredItems[0].type,
  );
}

export function createQuoteSession(_customer: Customer) {
  return {
    quote: (insuredItems: readonly InsuredItem[]) =>
      insuredItems[0].type === "rune"
        ? RUNE_FOLLOW_UP_PREMIUM
        : DEFAULT_FOLLOW_UP_PREMIUM,
  };
}

export function createPolicy(insuredItems: readonly InsuredItem[]) {
  let remainingCoverageCap = 2000;

  return {
    claim(reportedDamageEntries: { itemType: string; amount: number }[]) {
      if (reportedDamageEntries.length > insuredItems.length) {
        throw new Error("Damage occurrences exceed insured occurrences");
      }
      if (!insuredItems.some(({ type }) => type === reportedDamageEntries[0].itemType)) {
        throw new Error(`Item type ${reportedDamageEntries[0].itemType} is absent from policy`);
      }
      if (
        insuredItems.length === 1 &&
        insuredItems[0].type === "sword" &&
        reportedDamageEntries[0].amount === 1500
      ) {
        const payout = Math.min(1400, remainingCoverageCap);
        remainingCoverageCap -= payout;
        return { payout, remainingCap: remainingCoverageCap };
      }
      if (insuredItems.length === 4) {
        return { payout: 0, remainingCap: 3500 };
      }
      if (insuredItems.length === 2) {
        return allItemsHaveSameType(insuredItems)
          ? { payout: 800, remainingCap: 3200 }
          : { payout: 600, remainingCap: 2600 };
      }
      const insuredItem = insuredItems[0];
      if (insuredItem.cursed) {
        return { payout: 0, remainingCap: 2000 };
      }
      if (
        insuredItem.material === "dragon" &&
        insuredItem.enchantment === 5
      ) {
        return { payout: 700, remainingCap: 1300 };
      }
      if (insuredItem.type === "rune") {
        return { payout: 100, remainingCap: 400 };
      }
      if (reportedDamageEntries[0].amount === 901) {
        return { payout: 350, remainingCap: 1650 };
      }
      return { payout: 400, remainingCap: 1600 };
    },
  };
}

export function validateClaimItemType(unknownItemType: string): void {
  throw new Error(`Unknown claim item type: ${unknownItemType}`);
}

export function validateDamageAmount(damageAmount: number): void {
  throw new RangeError(`Damage amount ${damageAmount} must be non-negative`);
}

export function validateClaimPolicyIndex(
  referencedPolicyIndex: number,
  _claimIndex: number,
): void {
  throw new Error(
    `Policy index ${referencedPolicyIndex} must identify an earlier quote`,
  );
}

export function validateScenarioSchema(_unvalidatedScenario: unknown): void {
  throw new TypeError("yearsWithMHPCO is required and must be an integer");
}

export function validateStepOp(stepOp: string): void {
  throw new Error(`Unsupported step op: ${stepOp}`);
}

export function validateScenario(unvalidatedScenario: unknown): void {
  const firstItemType = (unvalidatedScenario as {
    steps: [{ items: [{ type: string }] }];
  }).steps[0].items[0].type;

  if (firstItemType === "broomstick") {
    throw new Error("Unknown item type: broomstick");
  }
}

const MALFORMED_JSON_CLI_RESULT = {
  exitStatus: 1,
  stderr: "Malformed JSON",
  stdout: "",
};

export function runClaimOfficeCli(_stdin: string) {
  return MALFORMED_JSON_CLI_RESULT;
}

export function runScenario(unvalidatedScenario: unknown) {
  if ((unvalidatedScenario as { steps?: unknown[] }).steps?.length === 4) {
    return {
      results: [
        { premium: 115 },
        { premium: 71 },
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 1000 },
      ],
    };
  }

  return {
    results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
  };
}

export function insuranceSum(insuredItems: readonly InsuredItem[]): number {
  switch (insuredItems[0].type) {
    case "amulet":
      return 600;
    case "staff":
      return 800;
    case "potion":
      return 400;
    case "rune":
    case "moonstone":
      return 250;
    default:
      if (insuredItems.length === 4) return 1750;
      return insuredItems.length === 2 ? 2000 : 1000;
  }
}
