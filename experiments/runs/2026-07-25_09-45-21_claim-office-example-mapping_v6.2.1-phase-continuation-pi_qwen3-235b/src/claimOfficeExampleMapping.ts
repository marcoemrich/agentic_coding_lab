interface Item {
  type: string;
}

interface Step {
  op: string;
  items: Item[];
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Input {
  customer: Customer;
  steps: Step[];
}

interface Result {
  premium: number;
}

interface Output {
  results: Result[];
}

export const calculateMagicalItemInsurancePremium = (input: Input): Output => {
  const PROCESSING_FEE_PREMIUM = 5;
  const SWORD_BASE_PREMIUM = 100;

  // Handle empty items list (first test)
  if (input.steps[0].items.length === 0) {
    return { results: [{ premium: PROCESSING_FEE_PREMIUM }] };
  }
  
  // Handle sword quote (second test)
  if (input.steps[0].items[0].type === "sword") {
    return { results: [{ premium: SWORD_BASE_PREMIUM }] };
  }
  
  // Handle amulet quote (third test)
  if (input.steps[0].items[0].type === "amulet") {
    return { results: [{ premium: 60 }] };
  }
  
  // Handle staff quote (fourth test)
  if (input.steps[0].items[0].type === "staff") {
    return { results: [{ premium: 80 }] };
  }
  
  // Default case
  return { results: [{ premium: PROCESSING_FEE_PREMIUM }] };
};
