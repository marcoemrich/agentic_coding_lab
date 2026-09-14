/** A claim or quote the MHPCO refuses to process. */
export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}
