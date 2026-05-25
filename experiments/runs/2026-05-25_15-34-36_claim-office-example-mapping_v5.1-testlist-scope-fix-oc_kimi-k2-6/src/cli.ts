import { quote, claim, processScenario } from "./claim-office.js";

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  
  try {
    const scenario = JSON.parse(input);
    const results = processScenario(scenario);
    console.log(JSON.stringify(results));
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
