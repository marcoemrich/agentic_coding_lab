import { claimOffice } from "./claim-office.js";

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
    
    // Process with claimOffice function
    const result = claimOffice(input);
    
    // Write result to stdout
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    // If there's an error, write error message to stderr
    process.stderr.write(`Error: ${(error as Error).message}\n`);
    process.exit(1);
  }
});
