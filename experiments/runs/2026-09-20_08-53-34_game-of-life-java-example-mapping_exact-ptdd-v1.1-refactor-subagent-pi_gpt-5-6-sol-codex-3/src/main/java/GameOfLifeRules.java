final class GameOfLifeRules {
    private GameOfLifeRules() {
    }

    static boolean survives(int liveNeighbors) {
        return liveNeighbors == 2 || liveNeighbors == 3;
    }

    static boolean isBorn(boolean currentlyAlive, int liveNeighbors) {
        return !currentlyAlive && liveNeighbors == 3;
    }
}
