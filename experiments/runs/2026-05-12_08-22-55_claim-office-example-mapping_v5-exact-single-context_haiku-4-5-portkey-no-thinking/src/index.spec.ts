import { describe, it, expect } from "vitest";
import { quote, claim } from "./index.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Operation", () => {
    it.todo("should return processing fee for empty item list");
    it.todo("should calculate premium for a single sword");
    it.todo("should calculate premium for a single amulet");
    it.todo("should calculate premium for multiple different items");
    it.todo("should calculate premium for multiple items of same type");
  });

  describe("Claim Operation", () => {
    it.todo("should calculate payout with deductible for simple damage");
    it.todo("should apply cap to payout across multiple claims");
  });
});
