import { MHPCO } from './mhpco.js';
import { Scenario, ScenarioOutput, Result, ClaimResult, QuoteResult } from './types.js';

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');

    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(data);
    });

    process.stdin.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);

    const mhpco = new MHPCO(scenario.customer);
    const results: Result[] = [];

    for (const step of scenario.steps) {
      if (step.op === 'quote') {
        const premium = mhpco.quote(step.items);
        results.push({ premium });
      } else if (step.op === 'claim') {
        const { payout, remainingCap } = mhpco.claim(
          step.policy,
          step.incident.damages
        );
        results.push({ payout, remainingCap });
      }
    }

    const output: ScenarioOutput = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    console.error('Error processing request:', error);
    process.exit(1);
  }
}

main();
