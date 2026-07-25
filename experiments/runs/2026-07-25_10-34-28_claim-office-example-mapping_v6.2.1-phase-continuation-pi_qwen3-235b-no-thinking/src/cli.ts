import { claimOfficeExampleMapping } from './claim-office-example-mapping.js';

// Read JSON from stdin
const chunks: string[] = [];
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  chunks.push(chunk);
});

process.stdin.on('end', () => {
  try {
    // Parse input JSON
    const input = JSON.parse(chunks.join(''));
    
    // Process with our function
    const result = claimOfficeExampleMapping(input);
    
    // Write result to stdout
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    // On error, write error message to stderr and exit with error code
    process.stderr.write(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    process.exit(1);
  }
});
