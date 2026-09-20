/**
 * What the MHPCO has on file about a customer's contracts so far. The office keeps
 * this tally per customer: it decides whether a new contract is the customer's first
 * or a follow-up, which is the only thing the premium calculation asks of it.
 */
public final class ContractHistory {

    private int contractsWritten;

    /** Every contract after the customer's first is a follow-up contract. */
    public boolean nextContractIsFollowUp() {
        return contractsWritten > 0;
    }

    /** The office notes in the file that it has written another contract. */
    public void recordContractWritten() {
        contractsWritten++;
    }
}
