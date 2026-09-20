final class PayoutRounding {
    private PayoutRounding() { }

    static int downToWholeG(int amountInHalfG) {
        return amountInHalfG / 2;
    }
}
