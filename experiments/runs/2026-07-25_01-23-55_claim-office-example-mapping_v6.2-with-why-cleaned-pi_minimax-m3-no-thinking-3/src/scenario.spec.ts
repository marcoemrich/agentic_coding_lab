import { describe, it } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario -- multi-step scenario processing", () => {
  // ----- Happy path: quote then claim -----

  it.todo("single quote -> result with premium");
  it.todo("quote then claim on that policy -> result with premium and payout + remainingCap");

  // ----- Cap exhaustion across multiple claims -----

  it.todo("quote then two successive claims -> second claim capped at remaining cap");

  // ----- CLI error cases (must throw -- CLI converts to non-zero exit + stderr) -----

  it.todo("quote with unknown item type -> throws");
  it.todo("claim with unknown item type in damage -> throws");
  it.todo("claim with negative damage amount -> throws");
  it.todo("claim references a damage entry whose item type is not in the policy -> throws");
  it.todo("claim has more damages of a given type than the policy covers -> throws");
});

// Placeholder so the import resolves while only it.todo entries exist.
import { runScenario as _runScenarioPlaceholder } from "./scenario.js";
void _runScenarioPlaceholder;
