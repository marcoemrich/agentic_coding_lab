import { claimOfficeMapping } from './claim-office-mapping.js';

async function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  
  try {
    const inputData = JSON.parse(input);
    const result = claimOfficeMapping(inputData);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('Error processing input:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
