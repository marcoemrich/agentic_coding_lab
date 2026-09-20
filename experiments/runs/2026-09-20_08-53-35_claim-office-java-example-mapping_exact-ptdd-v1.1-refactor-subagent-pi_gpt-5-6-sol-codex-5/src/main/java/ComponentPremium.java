final class ComponentPremium {
    private static final int UNIT_PREMIUM = 25;
    private static final int BUILDING_BLOCK_SIZE = 3;
    private static final int BUILDING_BLOCK_PREMIUM = 60;

    private ComponentPremium() { }

    static int forAlikeCount(int count) {
        return count == BUILDING_BLOCK_SIZE ? BUILDING_BLOCK_PREMIUM : count * UNIT_PREMIUM;
    }
}
