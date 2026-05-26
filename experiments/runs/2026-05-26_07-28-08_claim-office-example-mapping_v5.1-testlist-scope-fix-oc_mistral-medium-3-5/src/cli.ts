import { readFileSync } from "fs";

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);

const basePremiums: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const componentTypes = new Set(["rune", "moonstone"]);

const insuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Array<{ type: string; cursed?: boolean; enchantment?: number; material?: string }>;
  itemBasePremiums: number;
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const policies: Policy[] = [];

const results = scenario.steps.map((step: any, index: number) => {
  if (step.op === "quote") {
    const items = step.items as Array<{ type: string; cursed?: boolean; enchantment?: number; material?: string }>;
    const customer = scenario.customer;
    
    for (const item of items) {
      if (!basePremiums[item.type] && !componentTypes.has(item.type)) {
        process.stderr.write(`Error: Unknown item type "${item.type}"\n`);
        process.exit(1);
      }
    }
    
    const quoteNum = scenario.steps.filter((s: any, i: number) => i <= index && s.op === "quote").length;
    
    const componentCounts: Record<string, number> = {};
    items.forEach(item => {
      if (componentTypes.has(item.type)) {
        componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
      }
    });
    
    let itemBasePremiums = 0;
    const usedInBlock = new Set<string>();
    
    for (const [type, count] of Object.entries(componentCounts)) {
      if (count === 3) {
        itemBasePremiums += 60;
        usedInBlock.add(type);
      }
    }
    
    for (const item of items) {
      if (componentTypes.has(item.type)) {
        if (!usedInBlock.has(item.type)) {
          itemBasePremiums += basePremiums[item.type];
        }
      } else {
        itemBasePremiums += basePremiums[item.type] || 0;
      }
    }
    
    let itemModifiers = 0;
    for (const item of items) {
      if (item.cursed) {
        itemModifiers += basePremiums[item.type] * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemModifiers += basePremiums[item.type] * 0.3;
      }
    }
    
    let policyBase = itemBasePremiums;
    
    if (customer.yearsWithMHPCO >= 2) {
      policyBase -= itemBasePremiums * 0.2;
    }
    
    policyBase += itemBasePremiums * 0.1;
    
    if (quoteNum > 1) {
      policyBase -= itemBasePremiums * 0.15;
    }
    
    const premium = Math.ceil(policyBase + itemModifiers + 5);
    
    const insuranceSum = items.reduce((sum, item) => sum + (insuranceValues[item.type] || 0), 0);
    const cap = insuranceSum * 2;
    
    policies.push({
      items,
      itemBasePremiums,
      insuranceSum,
      cap,
      remainingCap: cap
    });
    
    return { premium };
  } else if (step.op === "claim") {
    const policy = policies[step.policy];
    const damages = step.incident.damages as Array<{ itemType: string; amount: number }>;
    
    const damageCounts: Record<string, number> = {};
    damages.forEach(damage => {
      damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
    });
    
    const policyItemCounts: Record<string, number> = {};
    policy.items.forEach(item => {
      policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
    });
    
    for (const [itemType, count] of Object.entries(damageCounts)) {
      if (count > (policyItemCounts[itemType] || 0)) {
        process.stderr.write(`Error: More damage entries for ${itemType} than policy covers\n`);
        process.exit(1);
      }
    }
    
    let totalPayout = 0;
    
    for (const damage of damages) {
      const policyItem = policy.items.find(item => item.type === damage.itemType);
      if (!policyItem) {
        process.stderr.write(`Error: Damage item ${damage.itemType} not found in policy\n`);
        process.exit(1);
      }
      
      if (damage.amount < 0) {
        process.stderr.write(`Error: Negative damage amount ${damage.amount}\n`);
        process.exit(1);
      }
      
      let reimbursement = damage.amount;
      
      if (policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
        reimbursement *= 0.5;
      }
      
      if (policyItem.material === "dragon") {
        reimbursement = damage.amount;
      }
      
      if (policyItem.enchantment !== undefined && policyItem.enchantment >= 8 && policyItem.material === "dragon") {
        reimbursement = damage.amount * 0.5;
      }
      
      reimbursement -= 100;
      
      if (reimbursement < 0) reimbursement = 0;
      
      totalPayout += reimbursement;
    }
    
    totalPayout = Math.floor(totalPayout);
    
    const payout = Math.min(totalPayout, policy.remainingCap);
    const remainingCap = policy.remainingCap - payout;
    
    policy.remainingCap = remainingCap;
    
    return { payout, remainingCap };
  }
  return { premium: 5 };
});

console.log(JSON.stringify({ results }));

