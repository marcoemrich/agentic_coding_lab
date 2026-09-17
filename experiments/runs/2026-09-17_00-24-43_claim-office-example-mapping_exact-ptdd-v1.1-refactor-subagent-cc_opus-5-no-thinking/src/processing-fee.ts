/**
 * MHPCO's processing fee.
 *
 * This module owns one ruling of the office's: what it charges for handling the
 * paperwork of a policy. The fee is a flat charge for the office's trouble, not
 * a rating of what is insured or of who insures it — which is why it is neither
 * an item risk surcharge nor a policy-wide modifier, and why it is untouched by
 * every discount and surcharge: it is added after all of them, at the very end.
 */

/** MHPCO charges a flat fee for the handling of every policy it writes. */
const PROCESSING_FEE_G = 5;

/** What MHPCO charges for handling one policy's paperwork. */
export function processingFee(): number {
  return PROCESSING_FEE_G;
}
