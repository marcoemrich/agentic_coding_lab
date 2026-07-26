<!--
Vendored from Matt Pocock's skills collection — https://github.com/mattpocock/skills
Path: skills/engineering/tdd/  ·  License: MIT (see ../../../LICENSE.upstream)
Retrieved: 2026-05-26. Snapshot of the skill as of that date; upstream has since evolved.
Included unmodified as an external comparison baseline for RQ-pocock-vs-v62.
Not authored by this project.
-->

# Interface Design for Testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results, don't produce side effects**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area**
   - Fewer methods = fewer tests needed
   - Fewer params = simpler test setup
