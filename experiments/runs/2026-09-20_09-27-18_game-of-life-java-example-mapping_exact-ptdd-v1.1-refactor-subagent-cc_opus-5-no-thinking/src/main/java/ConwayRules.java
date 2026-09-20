public final class ConwayRules {

    private ConwayRules() {
    }

    public static boolean isAliveNextGeneration(boolean currentlyAlive, int livingNeighbours) {
        return currentlyAlive
                ? survives(livingNeighbours)
                : isBorn(livingNeighbours);
    }

    private static boolean survives(int livingNeighbours) {
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private static boolean isBorn(int livingNeighbours) {
        return livingNeighbours == 3;
    }
}
