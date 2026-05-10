export interface Item {
  type: "sword" | "amulet" | "staff" | "potion" | "component";
  count?: number;
}

export interface Policy {
  id: string;
  premiumSum: number;
}

const itemBasePremiums: Record<Item["type"], number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const getComponentPremium = (count: number | undefined): number => {
  return count === 3 ? 35 : 25;
};

const getItemPremium = (item: Item): number => {
  if (item.type === "component") {
    return getComponentPremium(item.count);
  }
  return itemBasePremiums[item.type];
};

const policies: Map<string, Policy> = new Map();
const CLAIM_DEDUCTIBLE = 100;

export function quote(items: Item[]): number {
  return items.reduce((total, item) => total + getItemPremium(item), 0);
}

export function createPolicy(items: Item[]): Policy {
  const id = Math.random().toString(36).substring(2, 11);
  const premiumSum = quote(items);
  const policy: Policy = { id, premiumSum };
  policies.set(id, policy);
  return policy;
}

export function claim(
  policyId: string,
  damage: number
): { policyId: string; payout: number; error: string } {
  const policy = policies.get(policyId);
  if (!policy) {
    return {
      policyId,
      payout: 0,
      error: "Policy not found",
    };
  }
  const payoutBeforeCap = Math.max(0, damage - CLAIM_DEDUCTIBLE);
  const maxPayout = policy.premiumSum * 2;
  const payout = Math.min(payoutBeforeCap, maxPayout);
  return {
    policyId,
    payout,
    error: "",
  };
}
