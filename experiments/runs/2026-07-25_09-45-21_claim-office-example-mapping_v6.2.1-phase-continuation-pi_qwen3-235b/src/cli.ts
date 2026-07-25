import { claimOfficeExampleMapping } from "./claimOfficeExampleMapping.js";

// Read JSON from stdin
const chunks: string[] = [];
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (chunk) => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  try {
    // Parse input JSON
    const input = JSON.parse(chunks.join(""));
    
    // Process with the main function
    const result = claimOfficeExampleMapping(input);
    
    // Write result to stdout
    process.stdout.write(JSON.stringify(result));
  } catch (error: unknown) {
    // On error, output error message to stderr and exit with code 1
    const message = error instanceof Error ? error.message : "Unknown error";
    process.stderr.write(message + "\n");
    process.exit(1);
  }
});
