final class CellFate {
    boolean isAliveInNextGeneration(boolean isAlive, long liveNeighbors) {
        return isAlive
                ? hasSurvivalNeighborCount(liveNeighbors)
                : hasReproductionNeighborCount(liveNeighbors);
    }

    private boolean hasSurvivalNeighborCount(long liveNeighbors) {
        return liveNeighbors == 2 || liveNeighbors == 3;
    }

    private boolean hasReproductionNeighborCount(long liveNeighbors) {
        return liveNeighbors == 3;
    }
}
