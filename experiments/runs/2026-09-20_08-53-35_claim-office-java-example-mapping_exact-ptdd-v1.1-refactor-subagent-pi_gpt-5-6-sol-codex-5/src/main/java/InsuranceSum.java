final class InsuranceSum {
    private InsuranceSum() { }

    static int forItems(Iterable<InsuredItem> items) {
        int total = 0;
        for (InsuredItem item : items) {
            total += InsuranceValue.forItemType(item.type());
        }
        return total;
    }
}
