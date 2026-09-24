/** The MHPCO's two counters: the premium office quotes, the claims office
 *  settles. Both read the same item catalogue. */

export { type Item } from "./item-catalog.js";
export { quote, type Customer } from "./premium.js";
export {
  claim,
  createPolicy,
  type ClaimResult,
  type Damage,
  type Incident,
  type Policy,
} from "./settlement.js";
