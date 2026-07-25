import { describe, it, expect } from "vitest";
import { processScenario } from "./scenario.js";

describe("Scenario processing", () => {
  describe("Step ordering and policy tracking", () => {
    it.todo("quote step returns premium in results");
    it.todo("claim step returns payout and remainingCap");
    it.todo(
      "multi-step scenario processes steps sequentially and tracks policies by step index",
    );
    it.todo(
      "second quote increments contractCount (follow-up discount kicks in for the same customer)",
    );
  });

  describe("Error propagation from quote", () => {
    it.todo("quote with unknown item type: throws and writes error");
  });

  describe("Error propagation from claim", () => {
    it.todo(
      "claim with damage for item not in policy: throws and writes error",
    );
    it.todo("claim with negative damage amount: throws and writes error");
    it.todo(
      "claim with more damage entries of a type than items in policy: throws and writes error",
    );
  });
});
