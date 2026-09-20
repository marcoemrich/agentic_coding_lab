final class LifeRules {
    boolean survives(long liveNeighborCount) {
        return liveNeighborCount == 2 || liveNeighborCount == 3;
    }

    boolean isBorn(long liveNeighborCount) {
        return liveNeighborCount == 3;
    }
}
