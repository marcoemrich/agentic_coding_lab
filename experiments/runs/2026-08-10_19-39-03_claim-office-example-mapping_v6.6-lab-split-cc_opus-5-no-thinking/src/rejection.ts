// How the MHPCO refuses paperwork. Every refusal reads the same way: the kind
// of document being refused, then what is wrong with it — "claim reports a
// negative sword damage of -5", "quote names a broomstick, which the MHPCO
// does not insure".
//
// The convention lives here rather than at each throw site because the two
// documents are refused from two different modules — a quote from pricing.ts,
// a claim from coverage.ts — and neither is the natural owner of the other's
// wording. Keeping the shape in one place is what stops the third rejection
// from inventing a third phrasing.

const rejectionOf =
  (document: string) =>
  (reason: string): Error =>
    new Error(`${document} ${reason}`);

export const quoteRejection = rejectionOf("quote");
export const claimRejection = rejectionOf("claim");
