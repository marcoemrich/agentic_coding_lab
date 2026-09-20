final class LifeRules {
    boolean isAliveInNextGeneration(boolean isCurrentlyAlive, long liveNeighbors) {
        return isCurrentlyAlive
                ? survivesWith(liveNeighbors)
                : isBornWith(liveNeighbors);
    }

    private boolean survivesWith(long liveNeighbors) {
        return liveNeighbors == 2 || liveNeighbors == 3;
    }

    private boolean isBornWith(long liveNeighbors) {
        return liveNeighbors == 3;
    }
}
