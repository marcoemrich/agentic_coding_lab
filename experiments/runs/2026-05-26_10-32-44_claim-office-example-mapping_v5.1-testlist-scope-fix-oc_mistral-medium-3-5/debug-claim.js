// Debug claim processing
const scenario = {
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
  ]
};

// Import the function
import { processScenario } from "./src/claim-office.js";

const result = processScenario(scenario);
console.log("Result:", JSON.stringify(result, null, 2));
