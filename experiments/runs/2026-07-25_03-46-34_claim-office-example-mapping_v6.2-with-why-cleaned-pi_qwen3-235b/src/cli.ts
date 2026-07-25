import { processClaim } from "./claim-processor.js";

async function main() {
  let inputData = '';
  process.stdin.setEncoding('utf8');
  
  process.stdin.on('data', (chunk) => {
    inputData += chunk;
  });
  
  process.stdin.on('end', () => {
    try {
      const inputJson = JSON.parse(inputData);
      const result = processClaim(inputJson);
      process.stdout.write(JSON.stringify(result));
    } catch (error) {
      process.stderr.write(`Error: ${error.message}\n`);
      process.exit(1);
    }
  });
}

main().catch(err => {
  process.stderr.write(`Unexpected error: ${err.message}\n`);
  process.exit(1);
});