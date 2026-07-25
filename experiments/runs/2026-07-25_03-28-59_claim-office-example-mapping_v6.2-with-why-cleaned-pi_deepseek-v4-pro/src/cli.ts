import { processScenario } from "./claim-office.js";

export function handleIO(input: string): string {
  const parsed = JSON.parse(input);
  const result = processScenario(parsed);
  return JSON.stringify(result);
}