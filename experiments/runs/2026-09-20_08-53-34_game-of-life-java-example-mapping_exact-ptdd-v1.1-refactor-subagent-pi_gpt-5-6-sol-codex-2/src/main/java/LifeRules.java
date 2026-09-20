final class LifeRules {
    private LifeRules() {
    }

    static boolean willBeAlive(boolean currentlyAlive, int livingNeighborCount) {
        return livingNeighborCount == 3
                || livingNeighborCount == 2 && currentlyAlive;
    }
}
