export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type Result = QuoteResult | ClaimResult;

export interface Results {
  results: Result[];
}

function computeItemPremium(items: InsuredItem[]): number {
  const BASE_PREMIUMS: Record<string, number> = {
    sword: 100,
    amulet: 60,
    staff: 80,
    potion: 40,
  };
  const COMPONENT_TYPES = ["rune", "moonstone"];
  const COMPONENT_BASE_PREMIUM = 25;
  const COMPONENT_BLOCK_SIZE = 3;
  const COMPONENT_BLOCK_BASE_PREMIUM = 60;

  if (items.length === 0) {
    return 0;
  }

  const mainItems = items.filter(item => !COMPONENT_TYPES.includes(item.type));
  const componentsByType = new Map<string, InsuredItem[]>();

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      const existing = componentsByType.get(item.type) || [];
      existing.push(item);
      componentsByType.set(item.type, existing);
    }
  }

  let itemPremium = 0;

  for (const item of mainItems) {
    const basePremium = BASE_PREMIUMS[item.type];
    if (basePremium !== undefined) {
      let prePremium = basePremium;
      if (item.cursed) {
        prePremium += basePremium * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        prePremium += basePremium * 0.3;
      }
      itemPremium += prePremium;
    }
  }

  for (const [type, components] of componentsByType) {
    const count = components.length;
    if (count === COMPONENT_BLOCK_SIZE) {
      itemPremium += COMPONENT_BLOCK_BASE_PREMIUM;
    } else {
      itemPremium += count * COMPONENT_BASE_PREMIUM;
    }
  }

  return itemPremium;
}

export function quote(customer: Customer, items: InsuredItem[], contractNumber: number): number {
  const PROCESSING_FEE = 5;

  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  const itemPremium = computeItemPremium(items);

  if (itemPremium === 0) {
    return PROCESSING_FEE;
  }

  let policyPremium = itemPremium;

  if (contractNumber === 1) {
    policyPremium += itemPremium * 0.1;
  } else {
    policyPremium -= itemPremium * 0.15;
  }

  if (customer.yearsWithMHPCO >= 2) {
    policyPremium -= policyPremium * 0.2;
  }

  policyPremium += PROCESSING_FEE;

  return Math.ceil(policyPremium);
}

export class ClaimOffice {
  private policies: Map<number, { items: InsuredItem[], insuranceSum: number, cap: number, remainingCap: number }> = new Map();

  quoteForPolicy(customer: Customer, items: InsuredItem[]): number {
    const INSURANCE_VALUES: Record<string, number> = {
      sword: 1000,
      amulet: 600,
      staff: 800,
      potion: 400,
    };
    const COMPONENT_INSURANCE = 250;

    let insuranceSum = 0;
    for (const item of items) {
      if (item.type in INSURANCE_VALUES) {
        insuranceSum += INSURANCE_VALUES[item.type];
      } else if (item.type === "rune" || item.type === "moonstone") {
        insuranceSum += COMPONENT_INSURANCE;
      }
    }

    const cap = insuranceSum * 2;
    const policyIndex = this.policies.size;
    this.policies.set(policyIndex, { items, insuranceSum, cap, remainingCap: cap });

    return quote(customer, items, policyIndex + 1);
  }

  getInsuranceSum(): number {
    const lastPolicy = this.policies.get(this.policies.size - 1);
    return lastPolicy ? lastPolicy.insuranceSum : 0;
  }

  claim(policyIndex: number, cause: string, damages: DamageEntry[]): number {
    const policy = this.policies.get(policyIndex);
    if (!policy) {
      throw new Error("Policy not found");
    }

    let payout = 0;
    for (const damage of damages) {
      let damageAmount = damage.amount;
      const item = policy.items.find(i => i.type === damage.itemType);
      if (item) {
        if (item.enchantment !== undefined && item.enchantment >= 8) {
          damageAmount = damageAmount * 0.5;
        }
      }
      damageAmount -= 100;
      if (damageAmount < 0) damageAmount = 0;
      payout += damageAmount;
    }

    if (payout > policy.remainingCap) {
      payout = policy.remainingCap;
    }

    policy.remainingCap -= payout;
    return Math.floor(payout);
  }
}
