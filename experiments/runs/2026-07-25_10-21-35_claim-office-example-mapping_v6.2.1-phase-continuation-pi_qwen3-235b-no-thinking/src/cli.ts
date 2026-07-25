import { claimOfficeExampleMapping } from './claimOfficeExampleMapping.js';

// Read JSON from stdin
const chunks: string[] = [];
process.stdin.on('data', (chunk) => {
  chunks.push(chunk.toString());
});

process.stdin.on('end', () => {
  try {
    // Parse input JSON
    const input = JSON.parse(chunks.join(''));
    
    // Process the input
    const result = claimOfficeExampleMapping(input);
    
    // Write result as JSON to stdout
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    // If there's an error, write error message to stderr
    process.stderr.write(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
});
