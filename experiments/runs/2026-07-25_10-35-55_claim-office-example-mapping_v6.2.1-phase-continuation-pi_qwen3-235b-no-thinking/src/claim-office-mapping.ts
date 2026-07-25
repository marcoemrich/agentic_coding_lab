export function claimOfficeMapping(input: any): any {
  // TODO: Implement the full logic for quotes and claims
  // This is a placeholder that will be developed through TDD
  
  const results = [];
  
  for (const step of input.steps) {
    if (step.op === "quote") {
      if (step.items && step.items.length === 0) {
        results.push({ premium: 5 });
      }
    }
  }
  
  return { results };
}
