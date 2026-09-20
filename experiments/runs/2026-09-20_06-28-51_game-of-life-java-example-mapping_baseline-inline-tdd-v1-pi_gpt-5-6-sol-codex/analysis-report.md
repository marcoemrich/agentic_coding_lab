# Analysis Report: 2026-09-20_06-28-51_game-of-life-java-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-20T08:35:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-java-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 185s |
| Started | 2026-09-20T06:28:52+00:00 |
| Ended | 2026-09-20T06:32:08+00:00 |

## Code Metrics

- **Implementation files**: Cell.java, GameOfLife.java, GameOfLifeCli.java
- **Implementation LOC** (total): 102
- **Test files**: GameOfLifeCliTest.java, GameOfLifeTest.java
- **Test LOC** (total): 111
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (Maven)

```
[[1;34mINFO[m] Scanning for projects...
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--------------------------< [0;36mexample:example[0;1m >---------------------------[m
[[1;34mINFO[m] [1mBuilding example 1.0-SNAPSHOT[m
[[1;34mINFO[m] [1m--------------------------------[ jar ]---------------------------------[m
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.pom
Progress (1): 4.1 kB
Progress (1): 8.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.pom (8.1 kB at 26 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/23/maven-plugins-23.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 9.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/23/maven-plugins-23.pom (9.2 kB at 153 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/22/maven-parent-22.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 30 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/22/maven-parent-22.pom (30 kB at 513 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/11/apache-11.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 15 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/11/apache-11.pom (15 kB at 255 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.jar
Progress (1): 2.3/30 kB
Progress (1): 5.0/30 kB
Progress (1): 7.7/30 kB
Progress (1): 10/30 kB
Progress (1): 13/30 kB
Progress (1): 15/30 kB
Progress (1): 18/30 kB
Progress (1): 21/30 kB
Progress (1): 24/30 kB
Progress (1): 26/30 kB
Progress (1): 30 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.jar (30 kB at 469 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.13.0/maven-compiler-plugin-3.13.0.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 10 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.13.0/maven-compiler-plugin-3.13.0.pom (10 kB at 186 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/41/maven-plugins-41.pom
Progress (1): 4.1 kB
Progress (1): 7.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/41/maven-plugins-41.pom (7.4 kB at 131 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/41/maven-parent-41.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 45 kB
Progress (1): 49 kB
Progress (1): 50 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/41/maven-parent-41.pom (50 kB at 891 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/31/apache-31.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 24 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/31/apache-31.pom (24 kB at 436 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.13.0/maven-compiler-plugin-3.13.0.jar
Progress (1): 3.8/83 kB
Progress (1): 7.8/83 kB
Progress (1): 12/83 kB
Progress (1): 16/83 kB
Progress (1): 20/83 kB
Progress (1): 24/83 kB
Progress (1): 28/83 kB
Progress (1): 32/83 kB
Progress (1): 36/83 kB
Progress (1): 40/83 kB
Progress (1): 45/83 kB
Progress (1): 49/83 kB
Progress (1): 53/83 kB
Progress (1): 57/83 kB
Progress (1): 61/83 kB
Progress (1): 65/83 kB
Progress (1): 69/83 kB
Progress (1): 73/83 kB
Progress (1): 77/83 kB
Progress (1): 81/83 kB
Progress (1): 83 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.13.0/maven-compiler-plugin-3.13.0.jar (83 kB at 1.4 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/3.5.2/maven-surefire-plugin-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 5.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/3.5.2/maven-surefire-plugin-3.5.2.pom (5.7 kB at 102 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire/3.5.2/surefire-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire/3.5.2/surefire-3.5.2.pom (20 kB at 360 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/43/maven-parent-43.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 45 kB
Progress (1): 49 kB
Progress (1): 50 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/43/maven-parent-43.pom (50 kB at 883 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/33/apache-33.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 24 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/33/apache-33.pom (24 kB at 448 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.3/junit-bom-5.10.3.pom
Progress (1): 4.1 kB
Progress (1): 5.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.3/junit-bom-5.10.3.pom (5.6 kB at 96 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/3.5.2/maven-surefire-plugin-3.5.2.jar
Progress (1): 3.2/46 kB
Progress (1): 7.3/46 kB
Progress (1): 11/46 kB
Progress (1): 15/46 kB
Progress (1): 20/46 kB
Progress (1): 24/46 kB
Progress (1): 28/46 kB
Progress (1): 32/46 kB
Progress (1): 36/46 kB
Progress (1): 40/46 kB
Progress (1): 44/46 kB
Progress (1): 46 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/3.5.2/maven-surefire-plugin-3.5.2.jar (46 kB at 841 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.18.3/jackson-databind-2.18.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 21 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.18.3/jackson-databind-2.18.3.pom (21 kB at 350 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-base/2.18.3/jackson-base-2.18.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 12 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-base/2.18.3/jackson-base-2.18.3.pom (12 kB at 228 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-bom/2.18.3/jackson-bom-2.18.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 19 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-bom/2.18.3/jackson-bom-2.18.3.pom (19 kB at 334 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-parent/2.18.1/jackson-parent-2.18.1.pom
Progress (1): 4.1 kB
Progress (1): 6.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/jackson-parent/2.18.1/jackson-parent-2.18.1.pom (6.7 kB at 126 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/oss-parent/61/oss-parent-61.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 23 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/oss-parent/61/oss-parent-61.pom (23 kB at 358 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.2/junit-bom-5.10.2.pom
Progress (1): 4.1 kB
Progress (1): 5.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.2/junit-bom-5.10.2.pom (5.6 kB at 103 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.18.3/jackson-annotations-2.18.3.pom
Progress (1): 4.1 kB
Progress (1): 7.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.18.3/jackson-annotations-2.18.3.pom (7.1 kB at 136 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-core/2.18.3/jackson-core-2.18.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 10 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-core/2.18.3/jackson-core-2.18.3.pom (10 kB at 156 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter/5.12.2/junit-jupiter-5.12.2.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter/5.12.2/junit-jupiter-5.12.2.pom (3.2 kB at 59 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.12.2/junit-bom-5.12.2.pom
Progress (1): 4.1 kB
Progress (1): 5.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.12.2/junit-bom-5.12.2.pom (5.6 kB at 103 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.pom (3.2 kB at 57 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.pom
Progress (1): 2.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.pom (2.0 kB at 34 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.pom
Progress (1): 2.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.pom (2.8 kB at 46 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.pom
Progress (1): 1.5 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.pom (1.5 kB at 28 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-params/5.12.2/junit-jupiter-params-5.12.2.pom
Progress (1): 3.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-params/5.12.2/junit-jupiter-params-5.12.2.pom (3.0 kB at 55 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.pom (3.2 kB at 60 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.pom (3.2 kB at 58 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.18.3/jackson-databind-2.18.3.jar
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.18.3/jackson-annotations-2.18.3.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter/5.12.2/junit-jupiter-5.12.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-core/2.18.3/jackson-core-2.18.3.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.jar
Progress (1): 0/1.7 MB
Progress (1): 0/1.7 MB
Progress (1): 0/1.7 MB
Progress (1): 0/1.7 MB
Progress (1): 0/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.1/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.2/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.3/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.4/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.5/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.6/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.7/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.8/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 0.9/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.0/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (1): 1.1/1.7 MB
Progress (2): 1.1/1.7 MB | 2.3/6.4 kB
Progress (2): 1.1/1.7 MB | 5.0/6.4 kB
Progress (2): 1.1/1.7 MB | 6.4 kB
Progress (2): 1.1/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (2): 1.2/1.7 MB | 6.4 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 2.3/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 5.0/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 5.0/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 7.7/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 7.7/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 10/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 13/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 13/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 16/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 16/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 19/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 21/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 24/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 24/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 27/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 27/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 29/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 32/233 kB
Progress (3): 1.2/1.7 MB | 6.4 kB | 35/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 35/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 37/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 37/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 40/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 43/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 46/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 46/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 48/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 48/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 48/233 kB
Progress (3): 1.3/1.7 MB | 6.4 kB | 48/233 kB
Progress (4): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB
Progress (4): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.3/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 2.3/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 4.5/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 4.5/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 4.5/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 7.3/79 kB | 2.3/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 7.3/79 kB | 5.0/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 7.3/79 kB | 5.0/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 10/79 kB | 5.0/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 10/79 kB | 7.7/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 10/79 kB | 7.7/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 13/79 kB | 7.7/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 13/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 10/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 13/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 13/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 13/598 kB
Progress (5): 1.4/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 13/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 48/233 kB | 16/79 kB | 13/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 48/233 kB | 18/79 kB | 13/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 18/79 kB | 13/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 18/79 kB | 16/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 18/79 kB | 16/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 21/79 kB | 16/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 21/79 kB | 16/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 51/233 kB | 21/79 kB | 19/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 54/233 kB | 21/79 kB | 19/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 54/233 kB | 24/79 kB | 19/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 54/233 kB | 24/79 kB | 21/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 21/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 24/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 24/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 27/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 30/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 58/233 kB | 24/79 kB | 32/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 24/79 kB | 32/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 26/79 kB | 32/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 26/79 kB | 35/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 26/79 kB | 35/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 29/79 kB | 35/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 62/233 kB | 29/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 66/233 kB | 29/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 66/233 kB | 29/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 29/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 32/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 35/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 35/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 37/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 40/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 43/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 46/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 48/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 38/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 41/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 43/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 46/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 49/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 70/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 74/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 78/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.5/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 81/233 kB | 51/79 kB | 52/598 kB
Progress (5): 1.6/1.7 MB | 6.4 kB | 85/233 kB | 51/79 kB | 52/598 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter/5.12.2/junit-jupiter-5.12.2.jar (6.4 kB at 51 kB/s)
Progress (4): 1.6/1.7 MB | 89/233 kB | 51/79 kB | 52/598 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.jar
Progress (4): 1.6/1.7 MB | 93/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 97/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 101/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 105/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 109/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 113/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 117/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 121/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 126/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 130/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 134/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 134/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 138/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 142/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 146/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 148/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 152/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 156/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 156/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.6/1.7 MB | 156/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7/1.7 MB | 156/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 156/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 159/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 163/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 167/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 171/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 175/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 179/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 183/233 kB | 51/79 kB | 52/598 kB
Progress (4): 1.7 MB | 183/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 187/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 192/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 196/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 200/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 204/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 208/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 212/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 216/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 220/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 224/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 228/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 233/233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 233 kB | 54/79 kB | 52/598 kB
Progress (4): 1.7 MB | 233 kB | 54/79 kB | 54/598 kB
Progress (4): 1.7 MB | 233 kB | 58/79 kB | 54/598 kB
Progress (4): 1.7 MB | 233 kB | 62/79 kB | 54/598 kB
Progress (4): 1.7 MB | 233 kB | 62/79 kB | 58/598 kB
Progress (4): 1.7 MB | 233 kB | 66/79 kB | 58/598 kB
Progress (4): 1.7 MB | 233 kB | 66/79 kB | 62/598 kB
Progress (4): 1.7 MB | 233 kB | 70/79 kB | 62/598 kB
Progress (4): 1.7 MB | 233 kB | 70/79 kB | 65/598 kB
Progress (4): 1.7 MB | 233 kB | 74/79 kB | 65/598 kB
Progress (4): 1.7 MB | 233 kB | 74/79 kB | 69/598 kB
Progress (4): 1.7 MB | 233 kB | 78/79 kB | 69/598 kB
Progress (4): 1.7 MB | 233 kB | 78/79 kB | 73/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 73/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 77/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 81/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 85/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 89/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 93/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 97/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 101/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 106/598 kB
Progress (4): 1.7 MB | 233 kB | 79 kB | 110/598 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 110/598 kB | 2.3/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 114/598 kB | 2.3/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 114/598 kB | 5.0/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 118/598 kB | 5.0/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 118/598 kB | 7.7/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 122/598 kB | 7.7/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 122/598 kB | 10/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 126/598 kB | 10/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 126/598 kB | 13/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 130/598 kB | 13/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 132/598 kB | 13/14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 132/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 136/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 140/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 145/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 149/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 153/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 157/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 161/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 165/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 169/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 173/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 177/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 181/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 186/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 190/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 194/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 198/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 200/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 204/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 208/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 212/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 216/598 kB | 14 kB
Progress (5): 1.7 MB | 233 kB | 79 kB | 220/598 kB | 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.18.3/jackson-databind-2.18.3.jar (1.7 MB at 10 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.jar
Progress (4): 233 kB | 79 kB | 224/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 229/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 233/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 237/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 241/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 245/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 249/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 253/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 257/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 261/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 265/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 270/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 274/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 278/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 282/598 kB | 14 kB
Progress (4): 233 kB | 79 kB | 286/598 kB | 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.jar (233 kB at 1.4 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.jar
Progress (3): 79 kB | 290/598 kB | 14 kB
Progress (3): 79 kB | 294/598 kB | 14 kB
Progress (3): 79 kB | 298/598 kB | 14 kB
Progress (3): 79 kB | 302/598 kB | 14 kB
Progress (3): 79 kB | 306/598 kB | 14 kB
Progress (3): 79 kB | 311/598 kB | 14 kB
Progress (3): 79 kB | 315/598 kB | 14 kB
Progress (3): 79 kB | 319/598 kB | 14 kB
Progress (3): 79 kB | 323/598 kB | 14 kB
Progress (3): 79 kB | 327/598 kB | 14 kB
Progress (3): 79 kB | 331/598 kB | 14 kB
Progress (3): 79 kB | 335/598 kB | 14 kB
Progress (3): 79 kB | 339/598 kB | 14 kB
Progress (3): 79 kB | 343/598 kB | 14 kB
Progress (3): 79 kB | 347/598 kB | 14 kB
Progress (3): 79 kB | 351/598 kB | 14 kB
Progress (3): 79 kB | 355/598 kB | 14 kB
Progress (3): 79 kB | 360/598 kB | 14 kB
Progress (3): 79 kB | 364/598 kB | 14 kB
Progress (3): 79 kB | 368/598 kB | 14 kB
Progress (3): 79 kB | 372/598 kB | 14 kB
Progress (3): 79 kB | 376/598 kB | 14 kB
Progress (3): 79 kB | 380/598 kB | 14 kB
Progress (3): 79 kB | 384/598 kB | 14 kB
Progress (3): 79 kB | 388/598 kB | 14 kB
Progress (3): 79 kB | 392/598 kB | 14 kB
Progress (3): 79 kB | 396/598 kB | 14 kB
Progress (3): 79 kB | 400/598 kB | 14 kB
Progress (3): 79 kB | 405/598 kB | 14 kB
Progress (3): 79 kB | 409/598 kB | 14 kB
Progress (3): 79 kB | 413/598 kB | 14 kB
Progress (3): 79 kB | 417/598 kB | 14 kB
Progress (3): 79 kB | 421/598 kB | 14 kB
Progress (3): 79 kB | 425/598 kB | 14 kB
Progress (3): 79 kB | 429/598 kB | 14 kB
Progress (3): 79 kB | 433/598 kB | 14 kB
Progress (3): 79 kB | 437/598 kB | 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.18.3/jackson-annotations-2.18.3.jar (79 kB at 446 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-params/5.12.2/junit-jupiter-params-5.12.2.jar
Progress (2): 441/598 kB | 14 kB
Progress (2): 446/598 kB | 14 kB
Progress (2): 450/598 kB | 14 kB
Progress (2): 454/598 kB | 14 kB
Progress (2): 458/598 kB | 14 kB
Progress (2): 462/598 kB | 14 kB
Progress (2): 466/598 kB | 14 kB
Progress (2): 470/598 kB | 14 kB
Progress (2): 474/598 kB | 14 kB
Progress (2): 478/598 kB | 14 kB
Progress (2): 482/598 kB | 14 kB
Progress (2): 487/598 kB | 14 kB
Progress (2): 491/598 kB | 14 kB
Progress (2): 495/598 kB | 14 kB
Progress (2): 499/598 kB | 14 kB
Progress (2): 503/598 kB | 14 kB
Progress (2): 507/598 kB | 14 kB
Progress (2): 511/598 kB | 14 kB
Progress (2): 515/598 kB | 14 kB
Progress (2): 519/598 kB | 14 kB
Progress (2): 523/598 kB | 14 kB
Progress (2): 527/598 kB | 14 kB
Progress (2): 532/598 kB | 14 kB
Progress (2): 536/598 kB | 14 kB
Progress (2): 540/598 kB | 14 kB
Progress (2): 544/598 kB | 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.jar (14 kB at 79 kB/s)
Progress (1): 548/598 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.jar
Progress (1): 552/598 kB
Progress (1): 556/598 kB
Progress (1): 560/598 kB
Progress (1): 564/598 kB
Progress (1): 568/598 kB
Progress (1): 573/598 kB
Progress (1): 577/598 kB
Progress (1): 581/598 kB
Progress (1): 585/598 kB
Progress (1): 589/598 kB
Progress (2): 589/598 kB | 3.2/152 kB
Progress (2): 593/598 kB | 3.2/152 kB
Progress (2): 597/598 kB | 3.2/152 kB
Progress (2): 598 kB | 3.2/152 kB
Progress (2): 598 kB | 7.3/152 kB
Progress (2): 598 kB | 11/152 kB
Progress (2): 598 kB | 15/152 kB
Progress (2): 598 kB | 20/152 kB
Progress (2): 598 kB | 24/152 kB
Progress (2): 598 kB | 28/152 kB
Progress (2): 598 kB | 32/152 kB
Progress (2): 598 kB | 36/152 kB
Progress (2): 598 kB | 40/152 kB
Progress (2): 598 kB | 44/152 kB
Progress (2): 598 kB | 48/152 kB
Progress (2): 598 kB | 52/152 kB
Progress (2): 598 kB | 56/152 kB
Progress (2): 598 kB | 61/152 kB
Progress (2): 598 kB | 65/152 kB
Progress (2): 598 kB | 69/152 kB
Progress (2): 598 kB | 73/152 kB
Progress (2): 598 kB | 77/152 kB
Progress (2): 598 kB | 81/152 kB
Progress (2): 598 kB | 85/152 kB
Progress (2): 598 kB | 89/152 kB
Progress (2): 598 kB | 93/152 kB
Progress (2): 598 kB | 97/152 kB
Progress (2): 598 kB | 101/152 kB
Progress (2): 598 kB | 106/152 kB
Progress (2): 598 kB | 110/152 kB
Progress (2): 598 kB | 114/152 kB
Progress (2): 598 kB | 118/152 kB
Progress (2): 598 kB | 122/152 kB
Progress (2): 598 kB | 126/152 kB
Progress (2): 598 kB | 130/152 kB
Progress (2): 598 kB | 134/152 kB
Progress (2): 598 kB | 138/152 kB
Progress (2): 598 kB | 142/152 kB
Progress (2): 598 kB | 147/152 kB
Progress (2): 598 kB | 151/152 kB
Progress (2): 598 kB | 152 kB
Progress (3): 598 kB | 152 kB | 4.1/6.8 kB
Progress (3): 598 kB | 152 kB | 6.8 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 2.3/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 5.0/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 7.7/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 10/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 13/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 16/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 19/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 21/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 24/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 27/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 30/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 34/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 38/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 42/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 46/292 kB
Progress (4): 598 kB | 152 kB | 6.8 kB | 50/292 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 3.8/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 7.8/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 11/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 15/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 20/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 24/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 28/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 32/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 36/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 40/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 44/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 48/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 52/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 56/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 50/292 kB | 61/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 54/292 kB | 61/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 56/292 kB | 61/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 60/292 kB | 61/602 kB
Progress (5): 598 kB | 152 kB | 6.8 kB | 65/292 kB | 61/602 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-core/2.18.3/jackson-core-2.18.3.jar (598 kB at 2.7 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.jar
Progress (4): 152 kB | 6.8 kB | 69/292 kB | 61/602 kB
Progress (4): 152 kB | 6.8 kB | 73/292 kB | 61/602 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.jar (152 kB at 678 kB/s)
Progress (3): 6.8 kB | 77/292 kB | 61/602 kB
Progress (3): 6.8 kB | 81/292 kB | 61/602 kB
Progress (3): 6.8 kB | 85/292 kB | 61/602 kB
Progress (3): 6.8 kB | 89/292 kB | 61/602 kB
Progress (3): 6.8 kB | 93/292 kB | 61/602 kB
Progress (3): 6.8 kB | 93/292 kB | 65/602 kB
Progress (3): 6.8 kB | 93/292 kB | 69/602 kB
Progress (3): 6.8 kB | 93/292 kB | 73/602 kB
Progress (3): 6.8 kB | 93/292 kB | 77/602 kB
Progress (3): 6.8 kB | 93/292 kB | 79/602 kB
Progress (3): 6.8 kB | 93/292 kB | 83/602 kB
Progress (3): 6.8 kB | 97/292 kB | 83/602 kB
Progress (3): 6.8 kB | 97/292 kB | 87/602 kB
Progress (3): 6.8 kB | 101/292 kB | 87/602 kB
Progress (3): 6.8 kB | 101/292 kB | 91/602 kB
Progress (3): 6.8 kB | 106/292 kB | 91/602 kB
Progress (3): 6.8 kB | 106/292 kB | 95/602 kB
Progress (3): 6.8 kB | 110/292 kB | 95/602 kB
Progress (3): 6.8 kB | 110/292 kB | 99/602 kB
Progress (3): 6.8 kB | 110/292 kB | 104/602 kB
Progress (3): 6.8 kB | 110/292 kB | 108/602 kB
Progress (3): 6.8 kB | 110/292 kB | 112/602 kB
Progress (3): 6.8 kB | 110/292 kB | 116/602 kB
Progress (3): 6.8 kB | 110/292 kB | 120/602 kB
Progress (3): 6.8 kB | 110/292 kB | 124/602 kB
Progress (3): 6.8 kB | 110/292 kB | 128/602 kB
Progress (3): 6.8 kB | 110/292 kB | 130/602 kB
Progress (3): 6.8 kB | 110/292 kB | 134/602 kB
Progress (3): 6.8 kB | 114/292 kB | 134/602 kB
Progress (3): 6.8 kB | 118/292 kB | 134/602 kB
Progress (3): 6.8 kB | 122/292 kB | 134/602 kB
Progress (3): 6.8 kB | 124/292 kB | 134/602 kB
Progress (3): 6.8 kB | 128/292 kB | 134/602 kB
Progress (3): 6.8 kB | 132/292 kB | 134/602 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.jar (6.8 kB at 29 kB/s)
Progress (2): 136/292 kB | 134/602 kB
Progress (2): 139/292 kB | 134/602 kB
Progress (2): 143/292 kB | 134/602 kB
Progress (2): 147/292 kB | 134/602 kB
Progress (2): 151/292 kB | 134/602 kB
Progress (2): 155/292 kB | 134/602 kB
Progress (2): 159/292 kB | 134/602 kB
Progress (2): 163/292 kB | 134/602 kB
Progress (2): 167/292 kB | 134/602 kB
Progress (2): 172/292 kB | 134/602 kB
Progress (2): 176/292 kB | 134/602 kB
Progress (2): 180/292 kB | 134/602 kB
Progress (2): 184/292 kB | 134/602 kB
Progress (2): 188/292 kB | 134/602 kB
Progress (2): 192/292 kB | 134/602 kB
Progress (2): 196/292 kB | 134/602 kB
Progress (2): 196/292 kB | 138/602 kB
Progress (2): 196/292 kB | 143/602 kB
Progress (2): 196/292 kB | 147/602 kB
Progress (2): 196/292 kB | 151/602 kB
Progress (2): 196/292 kB | 155/602 kB
Progress (2): 196/292 kB | 159/602 kB
Progress (2): 196/292 kB | 163/602 kB
Progress (2): 196/292 kB | 167/602 kB
Progress (2): 200/292 kB | 167/602 kB
Progress (2): 204/292 kB | 167/602 kB
Progress (2): 208/292 kB | 167/602 kB
Progress (2): 213/292 kB | 167/602 kB
Progress (2): 213/292 kB | 171/602 kB
Progress (2): 213/292 kB | 175/602 kB
Progress (2): 213/292 kB | 179/602 kB
Progress (2): 213/292 kB | 184/602 kB
Progress (2): 217/292 kB | 184/602 kB
Progress (2): 221/292 kB | 184/602 kB
Progress (2): 225/292 kB | 184/602 kB
Progress (2): 229/292 kB | 184/602 kB
Progress (2): 229/292 kB | 188/602 kB
Progress (2): 229/292 kB | 192/602 kB
Progress (2): 229/292 kB | 196/602 kB
Progress (2): 229/292 kB | 200/602 kB
Progress (2): 233/292 kB | 200/602 kB
Progress (2): 237/292 kB | 200/602 kB
Progress (2): 241/292 kB | 200/602 kB
Progress (2): 241/292 kB | 204/602 kB
Progress (2): 245/292 kB | 204/602 kB
Progress (2): 245/292 kB | 208/602 kB
Progress (2): 245/292 kB | 212/602 kB
Progress (2): 245/292 kB | 216/602 kB
Progress (2): 249/292 kB | 216/602 kB
Progress (2): 253/292 kB | 216/602 kB
Progress (2): 258/292 kB | 216/602 kB
Progress (2): 262/292 kB | 216/602 kB
Progress (2): 262/292 kB | 220/602 kB
Progress (2): 266/292 kB | 220/602 kB
Progress (2): 266/292 kB | 224/602 kB
Progress (2): 266/292 kB | 229/602 kB
Progress (2): 266/292 kB | 233/602 kB
Progress (2): 266/292 kB | 237/602 kB
Progress (2): 266/292 kB | 241/602 kB
Progress (2): 266/292 kB | 245/602 kB
Progress (2): 266/292 kB | 249/602 kB
Progress (2): 266/292 kB | 253/602 kB
Progress (2): 266/292 kB | 257/602 kB
Progress (2): 270/292 kB | 257/602 kB
Progress (2): 270/292 kB | 261/602 kB
Progress (2): 270/292 kB | 265/602 kB
Progress (2): 270/292 kB | 269/602 kB
Progress (2): 274/292 kB | 269/602 kB
Progress (2): 274/292 kB | 273/602 kB
Progress (2): 278/292 kB | 273/602 kB
Progress (2): 282/292 kB | 273/602 kB
Progress (2): 286/292 kB | 273/602 kB
Progress (2): 290/292 kB | 273/602 kB
Progress (2): 292 kB | 273/602 kB
Progress (2): 292 kB | 278/602 kB
Progress (2): 292 kB | 282/602 kB
Progress (2): 292 kB | 286/602 kB
Progress (2): 292 kB | 290/602 kB
Progress (3): 292 kB | 290/602 kB | 4.1/256 kB
Progress (3): 292 kB | 290/602 kB | 7.7/256 kB
Progress (3): 292 kB | 290/602 kB | 12/256 kB
Progress (3): 292 kB | 294/602 kB | 12/256 kB
Progress (3): 292 kB | 298/602 kB | 12/256 kB
Progress (3): 292 kB | 302/602 kB | 12/256 kB
Progress (3): 292 kB | 306/602 kB | 12/256 kB
Progress (3): 292 kB | 310/602 kB | 12/256 kB
Progress (3): 292 kB | 314/602 kB | 12/256 kB
Progress (3): 292 kB | 319/602 kB | 12/256 kB
Progress (3): 292 kB | 323/602 kB | 12/256 kB
Progress (3): 292 kB | 327/602 kB | 12/256 kB
Progress (3): 292 kB | 331/602 kB | 12/256 kB
Progress (3): 292 kB | 335/602 kB | 12/256 kB
Progress (3): 292 kB | 335/602 kB | 16/256 kB
Progress (3): 292 kB | 339/602 kB | 16/256 kB
Progress (3): 292 kB | 339/602 kB | 20/256 kB
Progress (3): 292 kB | 339/602 kB | 24/256 kB
Progress (3): 292 kB | 339/602 kB | 28/256 kB
Progress (3): 292 kB | 343/602 kB | 28/256 kB
Progress (3): 292 kB | 343/602 kB | 32/256 kB
Progress (3): 292 kB | 347/602 kB | 32/256 kB
Progress (3): 292 kB | 347/602 kB | 36/256 kB
Progress (3): 292 kB | 351/602 kB | 36/256 kB
Progress (3): 292 kB | 351/602 kB | 40/256 kB
Progress (3): 292 kB | 355/602 kB | 40/256 kB
Progress (3): 292 kB | 355/602 kB | 44/256 kB
Progress (3): 292 kB | 355/602 kB | 48/256 kB
Progress (3): 292 kB | 355/602 kB | 52/256 kB
Progress (3): 292 kB | 355/602 kB | 56/256 kB
Progress (3): 292 kB | 355/602 kB | 60/256 kB
Progress (3): 292 kB | 360/602 kB | 60/256 kB
Progress (3): 292 kB | 364/602 kB | 60/256 kB
Progress (3): 292 kB | 368/602 kB | 60/256 kB
Progress (3): 292 kB | 372/602 kB | 60/256 kB
Progress (3): 292 kB | 372/602 kB | 65/256 kB
Progress (3): 292 kB | 372/602 kB | 69/256 kB
Progress (3): 292 kB | 372/602 kB | 73/256 kB
Progress (3): 292 kB | 372/602 kB | 77/256 kB
Progress (3): 292 kB | 372/602 kB | 81/256 kB
Progress (3): 292 kB | 372/602 kB | 85/256 kB
Progress (3): 292 kB | 372/602 kB | 89/256 kB
Progress (3): 292 kB | 372/602 kB | 93/256 kB
Progress (3): 292 kB | 376/602 kB | 93/256 kB
Progress (3): 292 kB | 380/602 kB | 93/256 kB
Progress (3): 292 kB | 384/602 kB | 93/256 kB
Progress (3): 292 kB | 388/602 kB | 93/256 kB
Progress (3): 292 kB | 388/602 kB | 97/256 kB
Progress (3): 292 kB | 388/602 kB | 101/256 kB
Progress (3): 292 kB | 388/602 kB | 106/256 kB
Progress (3): 292 kB | 388/602 kB | 110/256 kB
Progress (3): 292 kB | 388/602 kB | 114/256 kB
Progress (3): 292 kB | 388/602 kB | 118/256 kB
Progress (3): 292 kB | 388/602 kB | 122/256 kB
Progress (3): 292 kB | 388/602 kB | 126/256 kB
Progress (3): 292 kB | 392/602 kB | 126/256 kB
Progress (3): 292 kB | 396/602 kB | 126/256 kB
Progress (3): 292 kB | 400/602 kB | 126/256 kB
Progress (3): 292 kB | 400/602 kB | 130/256 kB
Progress (3): 292 kB | 405/602 kB | 130/256 kB
Progress (3): 292 kB | 405/602 kB | 134/256 kB
Progress (3): 292 kB | 405/602 kB | 138/256 kB
Progress (3): 292 kB | 405/602 kB | 142/256 kB
Progress (3): 292 kB | 409/602 kB | 142/256 kB
Progress (3): 292 kB | 413/602 kB | 142/256 kB
Progress (3): 292 kB | 417/602 kB | 142/256 kB
Progress (3): 292 kB | 417/602 kB | 147/256 kB
Progress (3): 292 kB | 421/602 kB | 147/256 kB
Progress (3): 292 kB | 421/602 kB | 151/256 kB
Progress (3): 292 kB | 421/602 kB | 155/256 kB
Progress (3): 292 kB | 421/602 kB | 159/256 kB
Progress (3): 292 kB | 425/602 kB | 159/256 kB
Progress (3): 292 kB | 429/602 kB | 159/256 kB
Progress (3): 292 kB | 433/602 kB | 159/256 kB
Progress (3): 292 kB | 437/602 kB | 159/256 kB
Progress (3): 292 kB | 437/602 kB | 163/256 kB
Progress (3): 292 kB | 437/602 kB | 167/256 kB
Progress (3): 292 kB | 437/602 kB | 171/256 kB
Progress (3): 292 kB | 437/602 kB | 175/256 kB
Progress (3): 292 kB | 437/602 kB | 179/256 kB
Progress (3): 292 kB | 437/602 kB | 183/256 kB
Progress (3): 292 kB | 437/602 kB | 187/256 kB
Progress (3): 292 kB | 441/602 kB | 187/256 kB
Progress (3): 292 kB | 441/602 kB | 192/256 kB
Progress (3): 292 kB | 446/602 kB | 192/256 kB
Progress (3): 292 kB | 450/602 kB | 192/256 kB
Progress (3): 292 kB | 454/602 kB | 192/256 kB
Progress (3): 292 kB | 454/602 kB | 196/256 kB
Progress (3): 292 kB | 454/602 kB | 200/256 kB
Progress (3): 292 kB | 454/602 kB | 204/256 kB
Progress (3): 292 kB | 454/602 kB | 208/256 kB
Progress (3): 292 kB | 454/602 kB | 212/256 kB
Progress (3): 292 kB | 454/602 kB | 216/256 kB
Progress (3): 292 kB | 458/602 kB | 216/256 kB
Progress (3): 292 kB | 458/602 kB | 220/256 kB
Progress (3): 292 kB | 462/602 kB | 220/256 kB
Progress (3): 292 kB | 462/602 kB | 224/256 kB
Progress (3): 292 kB | 466/602 kB | 224/256 kB
Progress (3): 292 kB | 470/602 kB | 224/256 kB
Progress (3): 292 kB | 470/602 kB | 228/256 kB
Progress (3): 292 kB | 470/602 kB | 233/256 kB
Progress (3): 292 kB | 470/602 kB | 237/256 kB
Progress (3): 292 kB | 470/602 kB | 241/256 kB
Progress (3): 292 kB | 470/602 kB | 245/256 kB
Progress (3): 292 kB | 470/602 kB | 249/256 kB
Progress (3): 292 kB | 474/602 kB | 249/256 kB
Progress (3): 292 kB | 478/602 kB | 249/256 kB
Progress (3): 292 kB | 478/602 kB | 253/256 kB
Progress (3): 292 kB | 482/602 kB | 253/256 kB
Progress (3): 292 kB | 482/602 kB | 256 kB
Progress (3): 292 kB | 486/602 kB | 256 kB
Progress (3): 292 kB | 490/602 kB | 256 kB
Progress (3): 292 kB | 494/602 kB | 256 kB
Progress (3): 292 kB | 498/602 kB | 256 kB
Progress (3): 292 kB | 503/602 kB | 256 kB
Progress (3): 292 kB | 507/602 kB | 256 kB
Progress (3): 292 kB | 511/602 kB | 256 kB
Progress (3): 292 kB | 515/602 kB | 256 kB
Progress (3): 292 kB | 519/602 kB | 256 kB
Progress (3): 292 kB | 523/602 kB | 256 kB
Progress (3): 292 kB | 527/602 kB | 256 kB
Progress (3): 292 kB | 531/602 kB | 256 kB
Progress (3): 292 kB | 535/602 kB | 256 kB
Progress (3): 292 kB | 539/602 kB | 256 kB
Progress (3): 292 kB | 543/602 kB | 256 kB
Progress (3): 292 kB | 548/602 kB | 256 kB
Progress (3): 292 kB | 552/602 kB | 256 kB
Progress (3): 292 kB | 556/602 kB | 256 kB
Progress (3): 292 kB | 560/602 kB | 256 kB
Progress (3): 292 kB | 564/602 kB | 256 kB
Progress (3): 292 kB | 568/602 kB | 256 kB
Progress (3): 292 kB | 572/602 kB | 256 kB
Progress (3): 292 kB | 576/602 kB | 256 kB
Progress (3): 292 kB | 580/602 kB | 256 kB
Progress (3): 292 kB | 584/602 kB | 256 kB
Progress (3): 292 kB | 589/602 kB | 256 kB
Progress (3): 292 kB | 593/602 kB | 256 kB
Progress (3): 292 kB | 597/602 kB | 256 kB
Progress (3): 292 kB | 601/602 kB | 256 kB
Progress (3): 292 kB | 602 kB | 256 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.jar (292 kB at 1.1 MB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.jar (256 kB at 888 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/jupiter/junit-jupiter-params/5.12.2/junit-jupiter-params-5.12.2.jar (602 kB at 2.0 MB/s)
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:resources[m [1m(default-resources)[m @ [36mexample[0;1m ---[m
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.pom
Progress (1): 1.5 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.pom (1.5 kB at 18 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven/2.0.6/maven-2.0.6.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 9.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven/2.0.6/maven-2.0.6.pom (9.0 kB at 129 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/5/maven-parent-5.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 15 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/5/maven-parent-5.pom (15 kB at 227 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/3/apache-3.pom
Progress (1): 3.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/3/apache-3.pom (3.4 kB at 50 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.pom
Progress (1): 2.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.pom (2.6 kB at 40 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.pom
Progress (1): 2.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.pom (2.0 kB at 29 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.pom
Progress (1): 3.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.pom (3.0 kB at 44 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.4.1/plexus-utils-1.4.1.pom
Progress (1): 1.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.4.1/plexus-utils-1.4.1.pom (1.9 kB at 27 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/1.0.11/plexus-1.0.11.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 9.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/1.0.11/plexus-1.0.11.pom (9.0 kB at 128 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.pom
Progress (1): 3.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.pom (3.9 kB at 61 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-containers/1.0.3/plexus-containers-1.0.3.pom
Progress (1): 492 B

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-containers/1.0.3/plexus-containers-1.0.3.pom (492 B at 7.2 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/1.0.4/plexus-1.0.4.pom
Progress (1): 4.1 kB
Progress (1): 5.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/1.0.4/plexus-1.0.4.pom (5.7 kB at 81 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/junit/junit/3.8.1/junit-3.8.1.pom
Progress (1): 998 B

Downloaded from central: https://repo.maven.apache.org/maven2/junit/junit/3.8.1/junit-3.8.1.pom (998 B at 13 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.0.4/plexus-utils-1.0.4.pom
Progress (1): 4.1 kB
Progress (1): 6.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.0.4/plexus-utils-1.0.4.pom (6.9 kB at 101 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1-alpha-2/classworlds-1.1-alpha-2.pom
Progress (1): 3.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1-alpha-2/classworlds-1.1-alpha-2.pom (3.1 kB at 39 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.pom
Progress (1): 2.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.pom (2.0 kB at 28 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.pom
Progress (1): 2.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.pom (2.6 kB at 37 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.pom
Progress (1): 1.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.pom (1.9 kB at 27 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.pom
Progress (1): 1.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.pom (1.6 kB at 22 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.pom
Progress (1): 1.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.pom (1.9 kB at 21 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.pom
Progress (1): 4.1 kB
Progress (1): 6.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.pom (6.7 kB at 83 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.pom
Progress (1): 1.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.pom (1.9 kB at 29 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.pom
Progress (1): 1.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.pom (1.8 kB at 27 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.6/maven-reporting-2.0.6.pom
Progress (1): 1.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.6/maven-reporting-2.0.6.pom (1.4 kB at 19 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.pom
Progress (1): 424 B

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.pom (424 B at 6.2 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia/1.0-alpha-7/doxia-1.0-alpha-7.pom
Progress (1): 3.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia/1.0-alpha-7/doxia-1.0-alpha-7.pom (3.9 kB at 61 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.pom
Progress (1): 1.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.pom (1.7 kB at 25 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.pom
Progress (1): 2.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.pom (2.1 kB at 31 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.pom
Progress (1): 2.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.pom (2.0 kB at 30 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.pom
Progress (1): 4.1 kB
Progress (1): 7.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.pom (7.1 kB at 92 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.pom
Progress (1): 1.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.pom (1.3 kB at 18 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.pom
Progress (1): 3.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.pom (3.3 kB at 46 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.pom
Progress (1): 3.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.pom (3.3 kB at 53 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.6/plexus-2.0.6.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 17 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.6/plexus-2.0.6.pom (17 kB at 233 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.pom
Progress (1): 4.1 kB
Progress (1): 5.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.pom (5.8 kB at 78 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/17/maven-shared-components-17.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 8.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/17/maven-shared-components-17.pom (8.7 kB at 126 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 26 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom (26 kB at 377 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/10/apache-10.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 15 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/10/apache-10.pom (15 kB at 218 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.15/plexus-utils-1.5.15.pom
Progress (1): 4.1 kB
Progress (1): 6.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.15/plexus-utils-1.5.15.pom (6.8 kB at 102 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.2/plexus-2.0.2.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.2/plexus-2.0.2.pom (12 kB at 176 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.12/plexus-interpolation-1.12.pom
Progress (1): 889 B

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.12/plexus-interpolation-1.12.pom (889 B at 14 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-components/1.1.14/plexus-components-1.1.14.pom
Progress (1): 4.1 kB
Progress (1): 5.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-components/1.1.14/plexus-components-1.1.14.pom (5.8 kB at 79 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.pom
Progress (1): 2.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.pom (2.9 kB at 37 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/sonatype/spice/spice-parent/10/spice-parent-10.pom
Progress (1): 3.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/sonatype/spice/spice-parent/10/spice-parent-10.pom (3.0 kB at 37 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/sonatype/forge/forge-parent/3/forge-parent-3.pom
Progress (1): 4.1 kB
Progress (1): 5.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/sonatype/forge/forge-parent/3/forge-parent-3.pom (5.0 kB at 74 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.8/plexus-utils-1.5.8.pom
Progress (1): 4.1 kB
Progress (1): 8.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.8/plexus-utils-1.5.8.pom (8.1 kB at 117 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.pom
Progress (1): 890 B

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.pom (890 B at 13 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-components/1.1.15/plexus-components-1.1.15.pom
Progress (1): 2.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-components/1.1.15/plexus-components-1.1.15.pom (2.8 kB at 44 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.3/plexus-2.0.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 15 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/2.0.3/plexus-2.0.3.pom (15 kB at 203 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.jar
Progress (1): 4.1/35 kB
Progress (2): 4.1/35 kB | 4.1/116 kB
Progress (2): 7.7/35 kB | 4.1/116 kB
Progress (2): 12/35 kB | 4.1/116 kB
Progress (2): 12/35 kB | 7.7/116 kB
Progress (2): 16/35 kB | 7.7/116 kB
Progress (2): 16/35 kB | 12/116 kB
Progress (2): 16/35 kB | 16/116 kB
Progress (2): 20/35 kB | 16/116 kB
Progress (2): 24/35 kB | 16/116 kB
Progress (2): 28/35 kB | 16/116 kB
Progress (2): 28/35 kB | 20/116 kB
Progress (2): 32/35 kB | 20/116 kB
Progress (2): 32/35 kB | 24/116 kB
Progress (2): 32/35 kB | 28/116 kB
Progress (2): 32/35 kB | 32/116 kB
Progress (2): 35 kB | 32/116 kB
Progress (2): 35 kB | 36/116 kB
Progress (2): 35 kB | 40/116 kB
Progress (2): 35 kB | 45/116 kB
Progress (2): 35 kB | 49/116 kB
Progress (2): 35 kB | 53/116 kB
Progress (2): 35 kB | 57/116 kB
Progress (2): 35 kB | 61/116 kB
Progress (2): 35 kB | 65/116 kB
Progress (2): 35 kB | 69/116 kB
Progress (2): 35 kB | 73/116 kB
Progress (3): 35 kB | 73/116 kB | 4.1/13 kB
Progress (3): 35 kB | 77/116 kB | 4.1/13 kB
Progress (3): 35 kB | 81/116 kB | 4.1/13 kB
Progress (3): 35 kB | 81/116 kB | 7.7/13 kB
Progress (3): 35 kB | 86/116 kB | 7.7/13 kB
Progress (3): 35 kB | 86/116 kB | 12/13 kB
Progress (3): 35 kB | 90/116 kB | 12/13 kB
Progress (3): 35 kB | 90/116 kB | 13 kB
Progress (3): 35 kB | 94/116 kB | 13 kB
Progress (3): 35 kB | 98/116 kB | 13 kB
Progress (3): 35 kB | 102/116 kB | 13 kB
Progress (3): 35 kB | 106/116 kB | 13 kB
Progress (3): 35 kB | 110/116 kB | 13 kB
Progress (3): 35 kB | 114/116 kB | 13 kB
Progress (3): 35 kB | 116 kB | 13 kB
Progress (4): 35 kB | 116 kB | 13 kB | 4.1/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 7.2/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 11/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 15/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 20/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 24/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 28/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 32/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 36/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 40/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 44/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 48/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 52/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 56/57 kB
Progress (4): 35 kB | 116 kB | 13 kB | 57 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 3.2/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 7.3/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 11/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 15/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 20/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 24/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 28/29 kB
Progress (5): 35 kB | 116 kB | 13 kB | 57 kB | 29 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.jar (116 kB at 2.0 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.jar (35 kB at 587 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.jar (13 kB at 198 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.jar (57 kB at 796 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.jar (29 kB at 381 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.jar
Progress (1): 4.1/152 kB
Progress (1): 7.7/152 kB
Progress (1): 11/152 kB
Progress (1): 15/152 kB
Progress (1): 20/152 kB
Progress (1): 24/152 kB
Progress (1): 28/152 kB
Progress (1): 32/152 kB
Progress (1): 36/152 kB
Progress (1): 40/152 kB
Progress (1): 44/152 kB
Progress (1): 48/152 kB
Progress (1): 52/152 kB
Progress (1): 56/152 kB
Progress (1): 61/152 kB
Progress (1): 65/152 kB
Progress (1): 69/152 kB
Progress (1): 73/152 kB
Progress (1): 77/152 kB
Progress (1): 81/152 kB
Progress (1): 85/152 kB
Progress (1): 89/152 kB
Progress (1): 93/152 kB
Progress (1): 97/152 kB
Progress (1): 101/152 kB
Progress (1): 106/152 kB
Progress (1): 110/152 kB
Progress (1): 114/152 kB
Progress (1): 118/152 kB
Progress (1): 122/152 kB
Progress (1): 126/152 kB
Progress (1): 130/152 kB
Progress (1): 134/152 kB
Progress (1): 138/152 kB
Progress (1): 142/152 kB
Progress (2): 142/152 kB | 4.1/21 kB
Progress (2): 147/152 kB | 4.1/21 kB
Progress (2): 147/152 kB | 7.7/21 kB
Progress (2): 151/152 kB | 7.7/21 kB
Progress (2): 152 kB | 7.7/21 kB
Progress (2): 152 kB | 12/21 kB
Progress (2): 152 kB | 16/21 kB
Progress (2): 152 kB | 20/21 kB
Progress (2): 152 kB | 21 kB
Progress (3): 152 kB | 21 kB | 3.1/9.9 kB
Progress (3): 152 kB | 21 kB | 7.2/9.9 kB
Progress (3): 152 kB | 21 kB | 9.9 kB
Progress (4): 152 kB | 21 kB | 9.9 kB | 3.1/5.9 kB
Progress (4): 152 kB | 21 kB | 9.9 kB | 5.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.jar (152 kB at 1.3 MB/s)
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 4.1/24 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.jar
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 7.7/24 kB
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 11/24 kB
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 15/24 kB
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 20/24 kB
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 24/24 kB
Progress (4): 21 kB | 9.9 kB | 5.9 kB | 24 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.jar (21 kB at 182 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.jar (9.9 kB at 80 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.jar (5.9 kB at 43 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.jar (24 kB at 174 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.jar
Progress (1): 4.1/30 kB
Progress (1): 7.7/30 kB
Progress (1): 12/30 kB
Progress (1): 16/30 kB
Progress (1): 20/30 kB
Progress (1): 24/30 kB
Progress (1): 28/30 kB
Progress (1): 30 kB
Progress (2): 30 kB | 3.2/14 kB
Progress (2): 30 kB | 7.3/14 kB
Progress (2): 30 kB | 11/14 kB
Progress (2): 30 kB | 14 kB
Progress (3): 30 kB | 14 kB | 4.1/37 kB
Progress (3): 30 kB | 14 kB | 7.7/37 kB
Progress (3): 30 kB | 14 kB | 11/37 kB
Progress (3): 30 kB | 14 kB | 15/37 kB
Progress (3): 30 kB | 14 kB | 20/37 kB
Progress (3): 30 kB | 14 kB | 24/37 kB
Progress (3): 30 kB | 14 kB | 28/37 kB
Progress (3): 30 kB | 14 kB | 32/37 kB
Progress (3): 30 kB | 14 kB | 36/37 kB
Progress (3): 30 kB | 14 kB | 37 kB

Downloaded from central: https://repo.maven.apache.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.jar (30 kB at 183 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.jar
Progress (3): 14 kB | 37 kB | 4.1/38 kB
Progress (3): 14 kB | 37 kB | 7.7/38 kB
Progress (3): 14 kB | 37 kB | 12/38 kB
Progress (3): 14 kB | 37 kB | 16/38 kB
Progress (3): 14 kB | 37 kB | 20/38 kB
Progress (3): 14 kB | 37 kB | 24/38 kB
Progress (3): 14 kB | 37 kB | 28/38 kB
Progress (3): 14 kB | 37 kB | 32/38 kB
Progress (3): 14 kB | 37 kB | 36/38 kB
Progress (3): 14 kB | 37 kB | 38 kB
Progress (4): 14 kB | 37 kB | 38 kB | 4.1/13 kB
Progress (4): 14 kB | 37 kB | 38 kB | 7.7/13 kB
Progress (4): 14 kB | 37 kB | 38 kB | 11/13 kB
Progress (4): 14 kB | 37 kB | 38 kB | 13 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.jar (14 kB at 73 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.jar
Progress (4): 37 kB | 38 kB | 13 kB | 4.1/87 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.jar (37 kB at 191 kB/s)
Progress (3): 38 kB | 13 kB | 7.7/87 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.jar
Progress (3): 38 kB | 13 kB | 12/87 kB
Progress (3): 38 kB | 13 kB | 16/87 kB
Progress (3): 38 kB | 13 kB | 20/87 kB
Progress (3): 38 kB | 13 kB | 24/87 kB
Progress (3): 38 kB | 13 kB | 28/87 kB
Progress (3): 38 kB | 13 kB | 32/87 kB
Progress (3): 38 kB | 13 kB | 36/87 kB
Progress (3): 38 kB | 13 kB | 40/87 kB
Progress (3): 38 kB | 13 kB | 45/87 kB
Progress (3): 38 kB | 13 kB | 49/87 kB
Progress (3): 38 kB | 13 kB | 53/87 kB
Progress (3): 38 kB | 13 kB | 57/87 kB
Progress (3): 38 kB | 13 kB | 61/87 kB
Progress (3): 38 kB | 13 kB | 65/87 kB
Progress (3): 38 kB | 13 kB | 69/87 kB
Progress (3): 38 kB | 13 kB | 73/87 kB
Progress (3): 38 kB | 13 kB | 77/87 kB
Progress (3): 38 kB | 13 kB | 81/87 kB
Progress (3): 38 kB | 13 kB | 86/87 kB

Downloaded from central: https://repo.maven.apache.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.jar (38 kB at 195 kB/s)
Progress (2): 13 kB | 87 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.jar (13 kB at 66 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.jar
Progress (2): 87 kB | 4.1/86 kB
Progress (2): 87 kB | 7.7/86 kB
Progress (2): 87 kB | 12/86 kB
Progress (2): 87 kB | 16/86 kB
Progress (3): 87 kB | 16/86 kB | 4.1/10 kB
Progress (3): 87 kB | 20/86 kB | 4.1/10 kB
Progress (3): 87 kB | 20/86 kB | 7.7/10 kB
Progress (3): 87 kB | 24/86 kB | 7.7/10 kB
Progress (3): 87 kB | 24/86 kB | 10 kB
Progress (3): 87 kB | 28/86 kB | 10 kB
Progress (3): 87 kB | 32/86 kB | 10 kB
Progress (3): 87 kB | 36/86 kB | 10 kB
Progress (3): 87 kB | 40/86 kB | 10 kB
Progress (3): 87 kB | 45/86 kB | 10 kB
Progress (3): 87 kB | 49/86 kB | 10 kB
Progress (3): 87 kB | 53/86 kB | 10 kB
Progress (3): 87 kB | 57/86 kB | 10 kB
Progress (3): 87 kB | 61/86 kB | 10 kB
Progress (3): 87 kB | 65/86 kB | 10 kB
Progress (3): 87 kB | 69/86 kB | 10 kB
Progress (3): 87 kB | 73/86 kB | 10 kB
Progress (3): 87 kB | 77/86 kB | 10 kB
Progress (3): 87 kB | 81/86 kB | 10 kB
Progress (3): 87 kB | 86/86 kB | 10 kB
Progress (3): 87 kB | 86 kB | 10 kB
Progress (4): 87 kB | 86 kB | 10 kB | 4.1/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 7.7/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 12/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 16/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 20/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 24/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 28/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 32/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 36/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 40/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 45/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 49/49 kB
Progress (4): 87 kB | 86 kB | 10 kB | 49 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.jar (87 kB at 383 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/junit/junit/3.8.1/junit-3.8.1.jar
Progress (4): 86 kB | 10 kB | 49 kB | 4.1/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 7.7/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 12/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 16/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 20/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 24/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 28/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 32/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 36/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 40/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 45/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 49/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 53/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 57/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 61/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 65/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 69/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 73/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 77/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 81/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 86/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 90/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 94/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 98/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 102/194 kB
Progress (4): 86 kB | 10 kB | 49 kB | 106/194 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.jar (10 kB at 41 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.jar
Progress (3): 86 kB | 49 kB | 110/194 kB
Progress (3): 86 kB | 49 kB | 114/194 kB
Progress (3): 86 kB | 49 kB | 118/194 kB
Progress (3): 86 kB | 49 kB | 122/194 kB
Progress (3): 86 kB | 49 kB | 126/194 kB
Progress (3): 86 kB | 49 kB | 131/194 kB
Progress (3): 86 kB | 49 kB | 135/194 kB
Progress (3): 86 kB | 49 kB | 139/194 kB
Progress (3): 86 kB | 49 kB | 143/194 kB
Progress (3): 86 kB | 49 kB | 147/194 kB
Progress (3): 86 kB | 49 kB | 151/194 kB
Progress (3): 86 kB | 49 kB | 155/194 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.jar (86 kB at 347 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.jar
Progress (2): 49 kB | 159/194 kB
Progress (2): 49 kB | 163/194 kB
Progress (2): 49 kB | 167/194 kB
Progress (2): 49 kB | 172/194 kB
Progress (2): 49 kB | 176/194 kB
Progress (2): 49 kB | 180/194 kB
Progress (2): 49 kB | 184/194 kB
Progress (2): 49 kB | 188/194 kB
Progress (2): 49 kB | 192/194 kB
Progress (2): 49 kB | 194 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.jar (49 kB at 193 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.jar
Progress (2): 194 kB | 4.1/121 kB
Progress (2): 194 kB | 7.7/121 kB
Progress (2): 194 kB | 12/121 kB
Progress (2): 194 kB | 16/121 kB
Progress (2): 194 kB | 20/121 kB
Progress (2): 194 kB | 24/121 kB
Progress (2): 194 kB | 28/121 kB
Progress (2): 194 kB | 32/121 kB
Progress (2): 194 kB | 36/121 kB
Progress (2): 194 kB | 40/121 kB
Progress (2): 194 kB | 45/121 kB
Progress (2): 194 kB | 49/121 kB
Progress (2): 194 kB | 53/121 kB
Progress (2): 194 kB | 57/121 kB
Progress (2): 194 kB | 61/121 kB
Progress (2): 194 kB | 65/121 kB
Progress (2): 194 kB | 69/121 kB
Progress (2): 194 kB | 73/121 kB
Progress (2): 194 kB | 77/121 kB
Progress (2): 194 kB | 81/121 kB
Progress (2): 194 kB | 86/121 kB
Progress (2): 194 kB | 90/121 kB
Progress (2): 194 kB | 94/121 kB
Progress (2): 194 kB | 98/121 kB
Progress (2): 194 kB | 102/121 kB
Progress (2): 194 kB | 106/121 kB
Progress (2): 194 kB | 110/121 kB
Progress (2): 194 kB | 114/121 kB
Progress (2): 194 kB | 118/121 kB
Progress (2): 194 kB | 121 kB
Progress (3): 194 kB | 121 kB | 4.1/223 kB
Progress (3): 194 kB | 121 kB | 7.7/223 kB
Progress (3): 194 kB | 121 kB | 11/223 kB
Progress (3): 194 kB | 121 kB | 15/223 kB
Progress (3): 194 kB | 121 kB | 20/223 kB
Progress (3): 194 kB | 121 kB | 24/223 kB
Progress (3): 194 kB | 121 kB | 28/223 kB
Progress (3): 194 kB | 121 kB | 32/223 kB
Progress (3): 194 kB | 121 kB | 36/223 kB
Progress (3): 194 kB | 121 kB | 40/223 kB
Progress (3): 194 kB | 121 kB | 44/223 kB
Progress (3): 194 kB | 121 kB | 48/223 kB
Progress (4): 194 kB | 121 kB | 48/223 kB | 4.1/43 kB
Progress (4): 194 kB | 121 kB | 52/223 kB | 4.1/43 kB
Progress (4): 194 kB | 121 kB | 56/223 kB | 4.1/43 kB
Progress (4): 194 kB | 121 kB | 56/223 kB | 7.7/43 kB
Progress (4): 194 kB | 121 kB | 61/223 kB | 7.7/43 kB
Progress (4): 194 kB | 121 kB | 61/223 kB | 12/43 kB
Progress (4): 194 kB | 121 kB | 61/223 kB | 16/43 kB
Progress (4): 194 kB | 121 kB | 65/223 kB | 16/43 kB
Progress (4): 194 kB | 121 kB | 69/223 kB | 16/43 kB
Progress (4): 194 kB | 121 kB | 69/223 kB | 20/43 kB
Progress (4): 194 kB | 121 kB | 73/223 kB | 20/43 kB
Progress (4): 194 kB | 121 kB | 73/223 kB | 24/43 kB
Progress (4): 194 kB | 121 kB | 77/223 kB | 24/43 kB
Progress (4): 194 kB | 121 kB | 77/223 kB | 28/43 kB
Progress (4): 194 kB | 121 kB | 81/223 kB | 28/43 kB
Progress (4): 194 kB | 121 kB | 81/223 kB | 32/43 kB
Progress (4): 194 kB | 121 kB | 85/223 kB | 32/43 kB
Progress (4): 194 kB | 121 kB | 85/223 kB | 36/43 kB
Progress (4): 194 kB | 121 kB | 89/223 kB | 36/43 kB
Progress (4): 194 kB | 121 kB | 89/223 kB | 40/43 kB
Progress (4): 194 kB | 121 kB | 93/223 kB | 40/43 kB
Progress (4): 194 kB | 121 kB | 93/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 97/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 101/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 106/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 110/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 114/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 118/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 122/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 126/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 130/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 134/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 138/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 142/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 147/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 151/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 155/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 159/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 163/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 167/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 171/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 175/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 179/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 183/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 187/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 192/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 196/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 200/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 204/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 208/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 212/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 216/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 220/223 kB | 43 kB
Progress (4): 194 kB | 121 kB | 223 kB | 43 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.jar (194 kB at 694 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.jar
Progress (4): 121 kB | 223 kB | 43 kB | 4.1/6.8 kB
Progress (4): 121 kB | 223 kB | 43 kB | 6.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/junit/junit/3.8.1/junit-3.8.1.jar (121 kB at 406 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.jar (43 kB at 141 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.jar (223 kB at 729 kB/s)
Progress (2): 6.8 kB | 3.2/61 kB
Progress (2): 6.8 kB | 7.3/61 kB
Progress (2): 6.8 kB | 11/61 kB
Progress (2): 6.8 kB | 15/61 kB
Progress (2): 6.8 kB | 20/61 kB
Progress (2): 6.8 kB | 24/61 kB
Progress (2): 6.8 kB | 28/61 kB
Progress (2): 6.8 kB | 32/61 kB
Progress (2): 6.8 kB | 36/61 kB
Progress (2): 6.8 kB | 40/61 kB
Progress (2): 6.8 kB | 44/61 kB
Progress (2): 6.8 kB | 48/61 kB
Progress (2): 6.8 kB | 52/61 kB
Progress (2): 6.8 kB | 56/61 kB
Progress (2): 6.8 kB | 61/61 kB
Progress (2): 6.8 kB | 61 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.jar (6.8 kB at 21 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.jar (61 kB at 177 kB/s)
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_06-28-51_game-of-life-java-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/3.4.2/maven-shared-utils-3.4.2.pom
Progress (1): 4.1 kB
Progress (1): 5.9 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/3.4.2/maven-shared-utils-3.4.2.pom (5.9 kB at 82 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/39/maven-shared-components-39.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/39/maven-shared-components-39.pom (3.2 kB at 47 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/39/maven-parent-39.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 45 kB
Progress (1): 48 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/39/maven-parent-39.pom (48 kB at 615 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/29/apache-29.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 21 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/29/apache-29.pom (21 kB at 284 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.pom
Progress (1): 2.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.pom (2.7 kB at 41 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-parent/1.7.36/slf4j-parent-1.7.36.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-parent/1.7.36/slf4j-parent-1.7.36.pom (14 kB at 204 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/commons-io/commons-io/2.11.0/commons-io-2.11.0.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB

Downloaded from central: https://repo.maven.apache.org/maven2/commons-io/commons-io/2.11.0/commons-io-2.11.0.pom (20 kB at 282 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/commons/commons-parent/52/commons-parent-52.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 45 kB
Progress (1): 49 kB
Progress (1): 53 kB
Progress (1): 57 kB
Progress (1): 61 kB
Progress (1): 66 kB
Progress (1): 70 kB
Progress (1): 74 kB
Progress (1): 78 kB
Progress (1): 79 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/commons/commons-parent/52/commons-parent-52.pom (79 kB at 1.1 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/23/apache-23.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 18 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/23/apache-23.pom (18 kB at 256 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.7.2/junit-bom-5.7.2.pom
Progress (1): 4.1 kB
Progress (1): 5.1 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.7.2/junit-bom-5.7.2.pom (5.1 kB at 77 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.pom
Progress (1): 4.1 kB
Progress (1): 4.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.pom (4.7 kB at 71 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/19/maven-shared-components-19.pom
Progress (1): 4.1 kB
Progress (1): 6.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/19/maven-shared-components-19.pom (6.4 kB at 92 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/23/maven-parent-23.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/23/maven-parent-23.pom (33 kB at 446 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/13/apache-13.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/13/apache-13.pom (14 kB at 215 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.2.0/plexus-java-1.2.0.pom
Progress (1): 4.1 kB
Progress (1): 4.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.2.0/plexus-java-1.2.0.pom (4.3 kB at 64 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-languages/1.2.0/plexus-languages-1.2.0.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-languages/1.2.0/plexus-languages-1.2.0.pom (3.2 kB at 45 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/15/plexus-15.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 28 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/15/plexus-15.pom (28 kB at 381 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.0/junit-bom-5.10.0.pom
Progress (1): 4.1 kB
Progress (1): 5.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.10.0/junit-bom-5.10.0.pom (5.6 kB at 88 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.6/asm-9.6.pom
Progress (1): 2.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.6/asm-9.6.pom (2.4 kB at 36 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/ow2/ow2/1.5.1/ow2-1.5.1.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 11 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/ow2/ow2/1.5.1/ow2-1.5.1.pom (11 kB at 179 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.0.3/qdox-2.0.3.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 17 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.0.3/qdox-2.0.3.pom (17 kB at 246 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/sonatype/oss/oss-parent/9/oss-parent-9.pom
Progress (1): 4.1 kB
Progress (1): 6.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/sonatype/oss/oss-parent/9/oss-parent-9.pom (6.6 kB at 109 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.15.0/plexus-compiler-api-2.15.0.pom
Progress (1): 1.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.15.0/plexus-compiler-api-2.15.0.pom (1.4 kB at 22 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler/2.15.0/plexus-compiler-2.15.0.pom
Progress (1): 4.1 kB
Progress (1): 7.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler/2.15.0/plexus-compiler-2.15.0.pom (7.6 kB at 119 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/17/plexus-17.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 28 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/17/plexus-17.pom (28 kB at 434 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/4.0.0/plexus-utils-4.0.0.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 8.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/4.0.0/plexus-utils-4.0.0.pom (8.7 kB at 127 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/13/plexus-13.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 27 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus/13/plexus-13.pom (27 kB at 360 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.9.3/junit-bom-5.9.3.pom
Progress (1): 4.1 kB
Progress (1): 5.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/junit-bom/5.9.3/junit-bom-5.9.3.pom (5.6 kB at 66 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.15.0/plexus-compiler-manager-2.15.0.pom
Progress (1): 1.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.15.0/plexus-compiler-manager-2.15.0.pom (1.3 kB at 19 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/javax/inject/javax.inject/1/javax.inject-1.pom
Progress (1): 612 B

Downloaded from central: https://repo.maven.apache.org/maven2/javax/inject/javax.inject/1/javax.inject-1.pom (612 B at 8.5 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-xml/3.0.0/plexus-xml-3.0.0.pom
Progress (1): 3.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-xml/3.0.0/plexus-xml-3.0.0.pom (3.7 kB at 54 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.15.0/plexus-compiler-javac-2.15.0.pom
Progress (1): 1.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.15.0/plexus-compiler-javac-2.15.0.pom (1.3 kB at 19 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compilers/2.15.0/plexus-compilers-2.15.0.pom
Progress (1): 1.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compilers/2.15.0/plexus-compilers-2.15.0.pom (1.6 kB at 23 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/3.4.2/maven-shared-utils-3.4.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar
Downloading from central: https://repo.maven.apache.org/maven2/commons-io/commons-io/2.11.0/commons-io-2.11.0.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.2.0/plexus-java-1.2.0.jar
Progress (1): 4.1/41 kB
Progress (2): 4.1/41 kB | 4.1/14 kB
Progress (2): 7.7/41 kB | 4.1/14 kB
Progress (2): 12/41 kB | 4.1/14 kB
Progress (2): 12/41 kB | 7.7/14 kB
Progress (2): 16/41 kB | 7.7/14 kB
Progress (2): 16/41 kB | 12/14 kB
Progress (2): 20/41 kB | 12/14 kB
Progress (2): 24/41 kB | 12/14 kB
Progress (2): 24/41 kB | 14 kB
Progress (2): 28/41 kB | 14 kB
Progress (2): 32/41 kB | 14 kB
Progress (2): 36/41 kB | 14 kB
Progress (2): 40/41 kB | 14 kB
Progress (2): 41 kB | 14 kB
Progress (3): 41 kB | 14 kB | 4.1/151 kB
Progress (3): 41 kB | 14 kB | 7.7/151 kB
Progress (3): 41 kB | 14 kB | 11/151 kB
Progress (3): 41 kB | 14 kB | 15/151 kB
Progress (3): 41 kB | 14 kB | 20/151 kB
Progress (3): 41 kB | 14 kB | 24/151 kB
Progress (3): 41 kB | 14 kB | 28/151 kB
Progress (3): 41 kB | 14 kB | 32/151 kB
Progress (3): 41 kB | 14 kB | 36/151 kB
Progress (3): 41 kB | 14 kB | 40/151 kB
Progress (3): 41 kB | 14 kB | 44/151 kB
Progress (3): 41 kB | 14 kB | 48/151 kB
Progress (3): 41 kB | 14 kB | 52/151 kB
Progress (3): 41 kB | 14 kB | 56/151 kB
Progress (3): 41 kB | 14 kB | 61/151 kB
Progress (3): 41 kB | 14 kB | 65/151 kB
Progress (3): 41 kB | 14 kB | 69/151 kB
Progress (3): 41 kB | 14 kB | 73/151 kB
Progress (3): 41 kB | 14 kB | 77/151 kB
Progress (3): 41 kB | 14 kB | 81/151 kB
Progress (3): 41 kB | 14 kB | 85/151 kB
Progress (3): 41 kB | 14 kB | 89/151 kB
Progress (3): 41 kB | 14 kB | 93/151 kB
Progress (3): 41 kB | 14 kB | 97/151 kB
Progress (3): 41 kB | 14 kB | 101/151 kB
Progress (3): 41 kB | 14 kB | 106/151 kB
Progress (3): 41 kB | 14 kB | 110/151 kB
Progress (3): 41 kB | 14 kB | 114/151 kB
Progress (3): 41 kB | 14 kB | 118/151 kB
Progress (3): 41 kB | 14 kB | 122/151 kB
Progress (3): 41 kB | 14 kB | 126/151 kB
Progress (3): 41 kB | 14 kB | 130/151 kB
Progress (3): 41 kB | 14 kB | 134/151 kB
Progress (3): 41 kB | 14 kB | 138/151 kB
Progress (3): 41 kB | 14 kB | 142/151 kB
Progress (3): 41 kB | 14 kB | 147/151 kB
Progress (3): 41 kB | 14 kB | 151/151 kB
Progress (3): 41 kB | 14 kB | 151 kB
Progress (4): 41 kB | 14 kB | 151 kB | 4.1/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 7.7/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 12/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 15/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 20/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 24/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 28/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 32/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 36/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 40/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 44/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 48/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 52/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 56/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 61/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 65/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 69/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 73/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 77/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 81/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 85/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 89/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 93/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 97/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 101/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 106/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 110/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 114/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 118/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 122/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 126/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 130/327 kB
Progress (4): 41 kB | 14 kB | 151 kB | 134/327 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 4.1/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 7.7/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 12/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 15/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 20/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 24/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 28/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 32/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 36/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 40/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 134/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 138/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 142/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 147/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 151/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 155/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 159/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 163/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 167/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 171/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 175/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 179/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 183/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 187/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 192/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 196/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 200/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 204/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 208/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 212/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 216/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 220/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 224/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 228/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 233/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 237/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 240/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 244/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 248/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 252/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 256/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 260/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 264/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 268/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 273/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 277/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 281/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 285/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 289/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 293/327 kB | 44/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 293/327 kB | 48/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 293/327 kB | 52/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 293/327 kB | 56/58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 293/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 297/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 301/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 305/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 309/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 314/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 318/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 322/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 326/327 kB | 58 kB
Progress (5): 41 kB | 14 kB | 151 kB | 327 kB | 58 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar (41 kB at 721 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.jar (14 kB at 242 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.6/asm-9.6.jar
Downloading from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.0.3/qdox-2.0.3.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/3.4.2/maven-shared-utils-3.4.2.jar (151 kB at 2.2 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.15.0/plexus-compiler-api-2.15.0.jar
Downloaded from central: https://repo.maven.apache.org/maven2/commons-io/commons-io/2.11.0/commons-io-2.11.0.jar (327 kB at 4.0 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.15.0/plexus-compiler-manager-2.15.0.jar
Progress (2): 58 kB | 4.1/124 kB
Progress (2): 58 kB | 7.7/124 kB
Progress (2): 58 kB | 11/124 kB
Progress (2): 58 kB | 15/124 kB
Progress (2): 58 kB | 20/124 kB
Progress (2): 58 kB | 24/124 kB
Progress (2): 58 kB | 28/124 kB
Progress (2): 58 kB | 32/124 kB
Progress (2): 58 kB | 36/124 kB
Progress (2): 58 kB | 40/124 kB
Progress (2): 58 kB | 44/124 kB
Progress (2): 58 kB | 48/124 kB
Progress (2): 58 kB | 52/124 kB
Progress (2): 58 kB | 56/124 kB
Progress (2): 58 kB | 61/124 kB
Progress (2): 58 kB | 65/124 kB
Progress (2): 58 kB | 69/124 kB
Progress (2): 58 kB | 73/124 kB
Progress (2): 58 kB | 77/124 kB
Progress (2): 58 kB | 81/124 kB
Progress (2): 58 kB | 85/124 kB
Progress (2): 58 kB | 89/124 kB
Progress (2): 58 kB | 93/124 kB
Progress (2): 58 kB | 97/124 kB
Progress (2): 58 kB | 101/124 kB
Progress (2): 58 kB | 106/124 kB
Progress (2): 58 kB | 110/124 kB
Progress (2): 58 kB | 114/124 kB
Progress (2): 58 kB | 118/124 kB
Progress (2): 58 kB | 122/124 kB
Progress (2): 58 kB | 124 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.2.0/plexus-java-1.2.0.jar (58 kB at 685 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/javax/inject/javax.inject/1/javax.inject-1.jar
Progress (2): 124 kB | 4.1/334 kB
Progress (2): 124 kB | 7.7/334 kB
Progress (2): 124 kB | 12/334 kB
Progress (2): 124 kB | 16/334 kB
Progress (2): 124 kB | 20/334 kB
Progress (2): 124 kB | 24/334 kB
Progress (2): 124 kB | 28/334 kB
Progress (2): 124 kB | 32/334 kB
Progress (2): 124 kB | 36/334 kB
Progress (2): 124 kB | 40/334 kB
Progress (2): 124 kB | 44/334 kB
Progress (2): 124 kB | 48/334 kB
Progress (2): 124 kB | 52/334 kB
Progress (2): 124 kB | 56/334 kB
Progress (2): 124 kB | 61/334 kB
Progress (2): 124 kB | 65/334 kB
Progress (2): 124 kB | 69/334 kB
Progress (2): 124 kB | 73/334 kB
Progress (2): 124 kB | 77/334 kB
Progress (2): 124 kB | 81/334 kB
Progress (2): 124 kB | 85/334 kB
Progress (2): 124 kB | 89/334 kB
Progress (2): 124 kB | 93/334 kB
Progress (2): 124 kB | 97/334 kB
Progress (2): 124 kB | 101/334 kB
Progress (2): 124 kB | 106/334 kB
Progress (2): 124 kB | 110/334 kB
Progress (2): 124 kB | 114/334 kB
Progress (2): 124 kB | 118/334 kB
Progress (2): 124 kB | 122/334 kB
Progress (2): 124 kB | 126/334 kB
Progress (2): 124 kB | 130/334 kB
Progress (2): 124 kB | 134/334 kB
Progress (2): 124 kB | 138/334 kB
Progress (2): 124 kB | 142/334 kB
Progress (2): 124 kB | 147/334 kB
Progress (2): 124 kB | 151/334 kB
Progress (2): 124 kB | 155/334 kB
Progress (2): 124 kB | 159/334 kB
Progress (2): 124 kB | 163/334 kB
Progress (2): 124 kB | 167/334 kB
Progress (2): 124 kB | 171/334 kB
Progress (2): 124 kB | 175/334 kB
Progress (2): 124 kB | 179/334 kB
Progress (2): 124 kB | 183/334 kB
Progress (2): 124 kB | 187/334 kB
Progress (2): 124 kB | 192/334 kB
Progress (2): 124 kB | 196/334 kB
Progress (2): 124 kB | 200/334 kB
Progress (2): 124 kB | 204/334 kB
Progress (2): 124 kB | 208/334 kB
Progress (2): 124 kB | 212/334 kB
Progress (2): 124 kB | 216/334 kB
Progress (2): 124 kB | 220/334 kB
Progress (2): 124 kB | 224/334 kB
Progress (2): 124 kB | 228/334 kB
Progress (2): 124 kB | 233/334 kB
Progress (2): 124 kB | 237/334 kB
Progress (2): 124 kB | 241/334 kB
Progress (2): 124 kB | 245/334 kB
Progress (2): 124 kB | 249/334 kB
Progress (2): 124 kB | 253/334 kB
Progress (2): 124 kB | 257/334 kB
Progress (2): 124 kB | 261/334 kB
Progress (2): 124 kB | 265/334 kB
Progress (2): 124 kB | 269/334 kB
Progress (2): 124 kB | 274/334 kB
Progress (2): 124 kB | 278/334 kB
Progress (2): 124 kB | 282/334 kB
Progress (2): 124 kB | 286/334 kB
Progress (2): 124 kB | 290/334 kB
Progress (2): 124 kB | 294/334 kB
Progress (2): 124 kB | 298/334 kB
Progress (2): 124 kB | 302/334 kB
Progress (2): 124 kB | 306/334 kB
Progress (2): 124 kB | 310/334 kB
Progress (2): 124 kB | 314/334 kB
Progress (2): 124 kB | 319/334 kB
Progress (2): 124 kB | 323/334 kB
Progress (2): 124 kB | 327/334 kB
Progress (2): 124 kB | 331/334 kB
Progress (2): 124 kB | 334 kB
Progress (3): 124 kB | 334 kB | 3.2/29 kB
Progress (3): 124 kB | 334 kB | 7.3/29 kB
Progress (3): 124 kB | 334 kB | 11/29 kB
Progress (3): 124 kB | 334 kB | 15/29 kB
Progress (3): 124 kB | 334 kB | 20/29 kB
Progress (3): 124 kB | 334 kB | 24/29 kB
Progress (3): 124 kB | 334 kB | 28/29 kB
Progress (3): 124 kB | 334 kB | 29 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.6/asm-9.6.jar (124 kB at 1.1 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-xml/3.0.0/plexus-xml-3.0.0.jar
Progress (3): 334 kB | 29 kB | 3.2/5.2 kB
Progress (3): 334 kB | 29 kB | 5.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.0.3/qdox-2.0.3.jar (334 kB at 2.9 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.15.0/plexus-compiler-javac-2.15.0.jar
Progress (3): 29 kB | 5.2 kB | 2.5 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.15.0/plexus-compiler-api-2.15.0.jar (29 kB at 227 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/4.0.0/plexus-utils-4.0.0.jar
Progress (3): 5.2 kB | 2.5 kB | 4.1/93 kB
Progress (3): 5.2 kB | 2.5 kB | 7.7/93 kB
Progress (3): 5.2 kB | 2.5 kB | 12/93 kB
Progress (3): 5.2 kB | 2.5 kB | 15/93 kB
Progress (3): 5.2 kB | 2.5 kB | 20/93 kB
Progress (3): 5.2 kB | 2.5 kB | 24/93 kB
Progress (3): 5.2 kB | 2.5 kB | 28/93 kB
Progress (3): 5.2 kB | 2.5 kB | 32/93 kB
Progress (3): 5.2 kB | 2.5 kB | 36/93 kB
Progress (3): 5.2 kB | 2.5 kB | 40/93 kB
Progress (3): 5.2 kB | 2.5 kB | 44/93 kB
Progress (3): 5.2 kB | 2.5 kB | 48/93 kB
Progress (3): 5.2 kB | 2.5 kB | 52/93 kB
Progress (3): 5.2 kB | 2.5 kB | 56/93 kB
Progress (3): 5.2 kB | 2.5 kB | 61/93 kB
Progress (3): 5.2 kB | 2.5 kB | 65/93 kB
Progress (3): 5.2 kB | 2.5 kB | 69/93 kB
Progress (3): 5.2 kB | 2.5 kB | 73/93 kB
Progress (3): 5.2 kB | 2.5 kB | 77/93 kB
Progress (3): 5.2 kB | 2.5 kB | 81/93 kB
Progress (3): 5.2 kB | 2.5 kB | 85/93 kB
Progress (3): 5.2 kB | 2.5 kB | 89/93 kB
Progress (3): 5.2 kB | 2.5 kB | 93 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 4.1/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 7.3/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 11/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 15/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 20/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 24/26 kB
Progress (4): 5.2 kB | 2.5 kB | 93 kB | 26 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.15.0/plexus-compiler-manager-2.15.0.jar (5.2 kB at 36 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/javax/inject/javax.inject/1/javax.inject-1.jar (2.5 kB at 16 kB/s)
Progress (3): 93 kB | 26 kB | 4.1/192 kB
Progress (3): 93 kB | 26 kB | 7.7/192 kB
Progress (3): 93 kB | 26 kB | 12/192 kB
Progress (3): 93 kB | 26 kB | 16/192 kB
Progress (3): 93 kB | 26 kB | 20/192 kB
Progress (3): 93 kB | 26 kB | 24/192 kB
Progress (3): 93 kB | 26 kB | 28/192 kB
Progress (3): 93 kB | 26 kB | 32/192 kB
Progress (3): 93 kB | 26 kB | 36/192 kB
Progress (3): 93 kB | 26 kB | 40/192 kB
Progress (3): 93 kB | 26 kB | 44/192 kB
Progress (3): 93 kB | 26 kB | 48/192 kB
Progress (3): 93 kB | 26 kB | 52/192 kB
Progress (3): 93 kB | 26 kB | 56/192 kB
Progress (3): 93 kB | 26 kB | 61/192 kB
Progress (3): 93 kB | 26 kB | 65/192 kB
Progress (3): 93 kB | 26 kB | 69/192 kB
Progress (3): 93 kB | 26 kB | 73/192 kB
Progress (3): 93 kB | 26 kB | 77/192 kB
Progress (3): 93 kB | 26 kB | 81/192 kB
Progress (3): 93 kB | 26 kB | 85/192 kB
Progress (3): 93 kB | 26 kB | 89/192 kB
Progress (3): 93 kB | 26 kB | 93/192 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-xml/3.0.0/plexus-xml-3.0.0.jar (93 kB at 564 kB/s)
Progress (2): 26 kB | 97/192 kB
Progress (2): 26 kB | 101/192 kB
Progress (2): 26 kB | 106/192 kB
Progress (2): 26 kB | 110/192 kB
Progress (2): 26 kB | 114/192 kB
Progress (2): 26 kB | 118/192 kB
Progress (2): 26 kB | 122/192 kB
Progress (2): 26 kB | 126/192 kB
Progress (2): 26 kB | 130/192 kB
Progress (2): 26 kB | 134/192 kB
Progress (2): 26 kB | 138/192 kB
Progress (2): 26 kB | 142/192 kB
Progress (2): 26 kB | 147/192 kB
Progress (2): 26 kB | 151/192 kB
Progress (2): 26 kB | 155/192 kB
Progress (2): 26 kB | 159/192 kB
Progress (2): 26 kB | 163/192 kB
Progress (2): 26 kB | 167/192 kB
Progress (2): 26 kB | 171/192 kB
Progress (2): 26 kB | 175/192 kB
Progress (2): 26 kB | 179/192 kB
Progress (2): 26 kB | 183/192 kB
Progress (2): 26 kB | 187/192 kB
Progress (2): 26 kB | 192/192 kB
Progress (2): 26 kB | 192 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.15.0/plexus-compiler-javac-2.15.0.jar (26 kB at 149 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/4.0.0/plexus-utils-4.0.0.jar (192 kB at 957 kB/s)
[[1;34mINFO[m] Recompiling the module because of [1mchanged dependency[m.
[[1;34mINFO[m] Compiling 3 source files with javac [debug release 17] to target/classes
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_06-28-51_game-of-life-java-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex/src/test/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:testCompile[m [1m(default-testCompile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Recompiling the module because of [1mchanged dependency[m.
[[1;34mINFO[m] Compiling 2 source files with javac [debug release 17] to target/test-classes
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-surefire-plugin:3.5.2:test[m [1m(default-test)[m @ [36mexample[0;1m ---[m
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/3.5.2/surefire-api-3.5.2.pom
Progress (1): 3.5 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/3.5.2/surefire-api-3.5.2.pom (3.5 kB at 47 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-logger-api/3.5.2/surefire-logger-api-3.5.2.pom
Progress (1): 3.3 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-logger-api/3.5.2/surefire-logger-api-3.5.2.pom (3.3 kB at 47 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-shared-utils/3.5.2/surefire-shared-utils-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 4.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-shared-utils/3.5.2/surefire-shared-utils-3.5.2.pom (4.7 kB at 66 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-api/3.5.2/surefire-extensions-api-3.5.2.pom
Progress (1): 3.5 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-api/3.5.2/surefire-extensions-api-3.5.2.pom (3.5 kB at 50 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/3.5.2/maven-surefire-common-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 7.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/3.5.2/maven-surefire-common-3.5.2.pom (7.8 kB at 109 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/3.5.2/surefire-booter-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 4.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/3.5.2/surefire-booter-3.5.2.pom (4.8 kB at 64 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-spi/3.5.2/surefire-extensions-spi-3.5.2.pom
Progress (1): 1.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-spi/3.5.2/surefire-extensions-spi-3.5.2.pom (1.8 kB at 24 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-util/1.4.1/maven-resolver-util-1.4.1.pom
Progress (1): 2.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-util/1.4.1/maven-resolver-util-1.4.1.pom (2.8 kB at 41 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver/1.4.1/maven-resolver-1.4.1.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 18 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver/1.4.1/maven-resolver-1.4.1.pom (18 kB at 256 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/33/maven-parent-33.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 44 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/33/maven-parent-33.pom (44 kB at 631 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/21/apache-21.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 17 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/21/apache-21.pom (17 kB at 211 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-api/1.4.1/maven-resolver-api-1.4.1.pom
Progress (1): 2.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-api/1.4.1/maven-resolver-api-1.4.1.pom (2.6 kB at 36 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/3.4.0/maven-common-artifact-filters-3.4.0.pom
Progress (1): 4.1 kB
Progress (1): 5.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/3.4.0/maven-common-artifact-filters-3.4.0.pom (5.4 kB at 76 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/42/maven-shared-components-42.pom
Progress (1): 3.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-components/42/maven-shared-components-42.pom (3.8 kB at 53 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/42/maven-parent-42.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 25 kB
Progress (1): 29 kB
Progress (1): 33 kB
Progress (1): 37 kB
Progress (1): 41 kB
Progress (1): 45 kB
Progress (1): 49 kB
Progress (1): 50 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/42/maven-parent-42.pom (50 kB at 701 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/apache/32/apache-32.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 20 kB
Progress (1): 24 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/apache/32/apache-32.pom (24 kB at 336 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.3.0/plexus-java-1.3.0.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 14 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.3.0/plexus-java-1.3.0.pom (14 kB at 203 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.7/asm-9.7.pom
Progress (1): 2.4 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.7/asm-9.7.pom (2.4 kB at 33 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.1.0/qdox-2.1.0.pom
Progress (1): 4.1 kB
Progress (1): 8.2 kB
Progress (1): 12 kB
Progress (1): 16 kB
Progress (1): 18 kB

Downloaded from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.1.0/qdox-2.1.0.pom (18 kB at 244 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/3.5.2/surefire-api-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-logger-api/3.5.2/surefire-logger-api-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-shared-utils/3.5.2/surefire-shared-utils-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-api/3.5.2/surefire-extensions-api-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/3.5.2/maven-surefire-common-3.5.2.jar
Progress (1): 0/2.8 MB
Progress (1): 0/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (1): 0.1/2.8 MB
Progress (2): 0.1/2.8 MB | 4.1/14 kB
Progress (2): 0.2/2.8 MB | 4.1/14 kB
Progress (2): 0.2/2.8 MB | 7.7/14 kB
Progress (2): 0.2/2.8 MB | 11/14 kB
Progress (2): 0.2/2.8 MB | 11/14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.2/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.3/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.4/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.5/2.8 MB | 14 kB
Progress (2): 0.6/2.8 MB | 14 kB
Progress (2): 0.6/2.8 MB | 14 kB
Progress (3): 0.6/2.8 MB | 14 kB | 4.1/26 kB
Progress (4): 0.6/2.8 MB | 14 kB | 4.1/26 kB | 4.1/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 4.1/26 kB | 4.1/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 4.1/26 kB | 7.7/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 4.1/26 kB | 11/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 7.7/26 kB | 11/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 11/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 15/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 20/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 24/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 28/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 32/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 36/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 40/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 44/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 48/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 52/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 56/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 61/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 65/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 69/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 73/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 77/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 81/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 85/171 kB
Progress (4): 0.6/2.8 MB | 14 kB | 11/26 kB | 89/171 kB
Progress (5): 0.6/2.8 MB | 14 kB | 11/26 kB | 89/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 11/26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 15/26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 20/26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 24/26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 93/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 97/171 kB | 4.1/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 97/171 kB | 7.7/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 97/171 kB | 7.7/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 101/171 kB | 7.7/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 106/171 kB | 7.7/311 kB
Progress (5): 0.6/2.8 MB | 14 kB | 26 kB | 106/171 kB | 7.7/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 106/171 kB | 7.7/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 106/171 kB | 12/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 110/171 kB | 12/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 110/171 kB | 15/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 114/171 kB | 15/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 114/171 kB | 15/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 118/171 kB | 15/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 118/171 kB | 20/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 118/171 kB | 20/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 122/171 kB | 20/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 122/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 126/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 130/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 134/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 138/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 142/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 147/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 151/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 155/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 159/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 163/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 167/171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 24/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 28/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 32/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 36/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 40/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 44/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 48/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 52/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 56/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 61/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 65/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 69/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 73/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 77/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 81/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 85/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 89/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 93/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 97/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 101/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 106/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 110/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 114/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 114/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 118/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 122/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 126/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 130/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 130/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 134/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 138/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 142/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 142/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 147/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 151/311 kB
Progress (5): 0.7/2.8 MB | 14 kB | 26 kB | 171 kB | 155/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 155/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 159/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 163/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 163/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 167/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 171/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 175/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 179/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 179/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 183/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 187/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 192/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 192/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 196/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 200/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 200/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 204/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 208/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 212/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 212/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 216/311 kB
Progress (5): 0.8/2.8 MB | 14 kB | 26 kB | 171 kB | 220/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 220/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 224/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 228/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 228/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 233/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 237/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 241/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 241/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 245/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 249/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 249/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 253/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 257/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 261/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 261/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 265/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 269/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 269/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 274/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 278/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 278/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 282/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 286/311 kB
Progress (5): 0.9/2.8 MB | 14 kB | 26 kB | 171 kB | 290/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 290/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 294/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 298/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 302/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 302/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 306/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 310/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 310/311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.5/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.6/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.7/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.8/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 1.9/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.0/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.1/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.2/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.3/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB
Progress (5): 2.4/2.8 MB | 14 kB | 26 kB | 171 kB | 311 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-logger-api/3.5.2/surefire-logger-api-3.5.2.jar (14 kB at 216 kB/s)
Progress (4): 2.4/2.8 MB | 26 kB | 171 kB | 311 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/3.5.2/surefire-booter-3.5.2.jar
Progress (4): 2.4/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.4/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.5/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.6/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.7/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.8/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.8/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.8/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.8/2.8 MB | 26 kB | 171 kB | 311 kB
Progress (4): 2.8 MB | 26 kB | 171 kB | 311 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/3.5.2/surefire-api-3.5.2.jar (171 kB at 2.1 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-spi/3.5.2/surefire-extensions-spi-3.5.2.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/3.5.2/maven-surefire-common-3.5.2.jar (311 kB at 3.7 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-util/1.4.1/maven-resolver-util-1.4.1.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-shared-utils/3.5.2/surefire-shared-utils-3.5.2.jar (2.8 MB at 31 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-api/1.4.1/maven-resolver-api-1.4.1.jar
Progress (2): 26 kB | 4.1/118 kB
Progress (2): 26 kB | 7.7/118 kB
Progress (2): 26 kB | 12/118 kB
Progress (2): 26 kB | 16/118 kB
Progress (2): 26 kB | 20/118 kB
Progress (2): 26 kB | 24/118 kB
Progress (2): 26 kB | 28/118 kB
Progress (2): 26 kB | 32/118 kB
Progress (2): 26 kB | 36/118 kB
Progress (2): 26 kB | 40/118 kB
Progress (2): 26 kB | 45/118 kB
Progress (2): 26 kB | 49/118 kB
Progress (2): 26 kB | 53/118 kB
Progress (2): 26 kB | 57/118 kB
Progress (2): 26 kB | 61/118 kB
Progress (2): 26 kB | 65/118 kB
Progress (2): 26 kB | 69/118 kB
Progress (2): 26 kB | 73/118 kB
Progress (2): 26 kB | 77/118 kB
Progress (2): 26 kB | 81/118 kB
Progress (2): 26 kB | 86/118 kB
Progress (2): 26 kB | 90/118 kB
Progress (2): 26 kB | 94/118 kB
Progress (2): 26 kB | 98/118 kB
Progress (2): 26 kB | 102/118 kB
Progress (2): 26 kB | 106/118 kB
Progress (2): 26 kB | 110/118 kB
Progress (2): 26 kB | 114/118 kB
Progress (2): 26 kB | 118 kB
Progress (3): 26 kB | 118 kB | 4.1/8.2 kB
Progress (3): 26 kB | 118 kB | 7.7/8.2 kB
Progress (3): 26 kB | 118 kB | 8.2 kB
Progress (4): 26 kB | 118 kB | 8.2 kB | 4.1/149 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 4.1/149 kB | 4.1/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 7.7/149 kB | 4.1/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 11/149 kB | 4.1/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 11/149 kB | 7.7/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 11/149 kB | 11/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 15/149 kB | 11/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 20/149 kB | 11/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 24/149 kB | 11/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 28/149 kB | 11/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 28/149 kB | 15/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 28/149 kB | 20/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 32/149 kB | 20/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 32/149 kB | 24/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 36/149 kB | 24/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 36/149 kB | 28/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 40/149 kB | 28/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 44/149 kB | 28/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 48/149 kB | 28/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 52/149 kB | 28/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 52/149 kB | 32/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 56/149 kB | 32/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 56/149 kB | 36/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 61/149 kB | 36/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 61/149 kB | 40/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 61/149 kB | 44/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 65/149 kB | 44/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 69/149 kB | 44/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 73/149 kB | 44/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 73/149 kB | 48/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 77/149 kB | 48/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 77/149 kB | 52/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 77/149 kB | 56/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 81/149 kB | 56/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 81/149 kB | 61/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 85/149 kB | 61/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 89/149 kB | 61/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 61/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 65/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 69/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 73/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 77/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 81/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 85/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 89/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 93/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 97/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 101/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 106/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 110/168 kB
Progress (5): 26 kB | 118 kB | 8.2 kB | 93/149 kB | 114/168 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/3.5.2/surefire-booter-3.5.2.jar (118 kB at 997 kB/s)
Progress (4): 26 kB | 8.2 kB | 97/149 kB | 114/168 kB
Progress (4): 26 kB | 8.2 kB | 97/149 kB | 118/168 kB
Progress (4): 26 kB | 8.2 kB | 101/149 kB | 118/168 kB
Progress (4): 26 kB | 8.2 kB | 101/149 kB | 122/168 kB
Progress (4): 26 kB | 8.2 kB | 106/149 kB | 122/168 kB
Progress (4): 26 kB | 8.2 kB | 106/149 kB | 126/168 kB
Progress (4): 26 kB | 8.2 kB | 110/149 kB | 126/168 kB
Progress (4): 26 kB | 8.2 kB | 110/149 kB | 130/168 kB
Progress (4): 26 kB | 8.2 kB | 110/149 kB | 134/168 kB
Progress (4): 26 kB | 8.2 kB | 114/149 kB | 134/168 kB
Progress (4): 26 kB | 8.2 kB | 114/149 kB | 138/168 kB

Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/3.4.0/maven-common-artifact-filters-3.4.0.jar
Progress (4): 26 kB | 8.2 kB | 118/149 kB | 138/168 kB
Progress (4): 26 kB | 8.2 kB | 118/149 kB | 142/168 kB
Progress (4): 26 kB | 8.2 kB | 122/149 kB | 142/168 kB
Progress (4): 26 kB | 8.2 kB | 126/149 kB | 142/168 kB
Progress (4): 26 kB | 8.2 kB | 126/149 kB | 147/168 kB
Progress (4): 26 kB | 8.2 kB | 130/149 kB | 147/168 kB
Progress (4): 26 kB | 8.2 kB | 130/149 kB | 151/168 kB
Progress (4): 26 kB | 8.2 kB | 134/149 kB | 151/168 kB
Progress (4): 26 kB | 8.2 kB | 134/149 kB | 155/168 kB
Progress (4): 26 kB | 8.2 kB | 138/149 kB | 155/168 kB
Progress (4): 26 kB | 8.2 kB | 138/149 kB | 159/168 kB
Progress (4): 26 kB | 8.2 kB | 138/149 kB | 163/168 kB
Progress (4): 26 kB | 8.2 kB | 142/149 kB | 163/168 kB
Progress (4): 26 kB | 8.2 kB | 142/149 kB | 167/168 kB
Progress (4): 26 kB | 8.2 kB | 142/149 kB | 168 kB
Progress (4): 26 kB | 8.2 kB | 147/149 kB | 168 kB
Progress (4): 26 kB | 8.2 kB | 149 kB | 168 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-api/3.5.2/surefire-extensions-api-3.5.2.jar (26 kB at 184 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.3.0/plexus-java-1.3.0.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-api/1.4.1/maven-resolver-api-1.4.1.jar (149 kB at 1.0 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.7/asm-9.7.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-extensions-spi/3.5.2/surefire-extensions-spi-3.5.2.jar (8.2 kB at 56 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.1.0/qdox-2.1.0.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/resolver/maven-resolver-util/1.4.1/maven-resolver-util-1.4.1.jar (168 kB at 1.1 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.1/plexus-utils-1.1.jar
Progress (1): 4.1/58 kB
Progress (1): 7.7/58 kB
Progress (1): 11/58 kB
Progress (1): 15/58 kB
Progress (1): 20/58 kB
Progress (1): 24/58 kB
Progress (1): 28/58 kB
Progress (1): 32/58 kB
Progress (1): 36/58 kB
Progress (1): 40/58 kB
Progress (1): 44/58 kB
Progress (1): 48/58 kB
Progress (1): 52/58 kB
Progress (1): 56/58 kB
Progress (1): 58 kB
Progress (2): 58 kB | 3.2/125 kB
Progress (2): 58 kB | 7.3/125 kB
Progress (2): 58 kB | 11/125 kB
Progress (2): 58 kB | 15/125 kB
Progress (2): 58 kB | 20/125 kB
Progress (2): 58 kB | 24/125 kB
Progress (2): 58 kB | 28/125 kB
Progress (2): 58 kB | 32/125 kB
Progress (2): 58 kB | 36/125 kB
Progress (2): 58 kB | 40/125 kB
Progress (2): 58 kB | 44/125 kB
Progress (2): 58 kB | 48/125 kB
Progress (2): 58 kB | 52/125 kB
Progress (2): 58 kB | 56/125 kB
Progress (2): 58 kB | 61/125 kB
Progress (3): 58 kB | 61/125 kB | 4.1/57 kB
Progress (3): 58 kB | 65/125 kB | 4.1/57 kB
Progress (3): 58 kB | 69/125 kB | 4.1/57 kB
Progress (3): 58 kB | 69/125 kB | 7.7/57 kB
Progress (3): 58 kB | 73/125 kB | 7.7/57 kB
Progress (3): 58 kB | 73/125 kB | 12/57 kB
Progress (3): 58 kB | 77/125 kB | 12/57 kB
Progress (3): 58 kB | 77/125 kB | 16/57 kB
Progress (3): 58 kB | 81/125 kB | 16/57 kB
Progress (3): 58 kB | 85/125 kB | 16/57 kB
Progress (3): 58 kB | 85/125 kB | 20/57 kB
Progress (3): 58 kB | 89/125 kB | 20/57 kB
Progress (3): 58 kB | 89/125 kB | 24/57 kB
Progress (3): 58 kB | 93/125 kB | 24/57 kB
Progress (3): 58 kB | 93/125 kB | 28/57 kB
Progress (3): 58 kB | 93/125 kB | 32/57 kB
Progress (3): 58 kB | 97/125 kB | 32/57 kB
Progress (3): 58 kB | 101/125 kB | 32/57 kB
Progress (3): 58 kB | 101/125 kB | 36/57 kB
Progress (3): 58 kB | 106/125 kB | 36/57 kB
Progress (3): 58 kB | 106/125 kB | 40/57 kB
Progress (3): 58 kB | 110/125 kB | 40/57 kB
Progress (3): 58 kB | 110/125 kB | 45/57 kB
Progress (3): 58 kB | 110/125 kB | 49/57 kB
Progress (3): 58 kB | 114/125 kB | 49/57 kB
Progress (3): 58 kB | 118/125 kB | 49/57 kB
Progress (3): 58 kB | 118/125 kB | 53/57 kB
Progress (3): 58 kB | 122/125 kB | 53/57 kB
Progress (3): 58 kB | 122/125 kB | 57/57 kB
Progress (3): 58 kB | 125 kB | 57/57 kB
Progress (3): 58 kB | 125 kB | 57 kB
Progress (4): 58 kB | 125 kB | 57 kB | 4.1/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 7.7/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 12/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 16/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 20/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 24/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 28/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 32/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 36/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 40/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 45/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 49/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 53/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 57/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 61/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 65/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 69/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 73/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 77/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 81/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 86/169 kB
Progress (4): 58 kB | 125 kB | 57 kB | 90/169 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 4.1/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 7.7/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 11/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 15/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 20/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 90/169 kB | 24/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 94/169 kB | 24/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 98/169 kB | 24/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 98/169 kB | 28/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 102/169 kB | 28/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 106/169 kB | 28/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 106/169 kB | 32/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 106/169 kB | 36/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 110/169 kB | 36/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 110/169 kB | 40/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 114/169 kB | 40/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 114/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 118/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 122/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 126/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 131/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 135/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 139/169 kB | 44/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 139/169 kB | 48/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 143/169 kB | 48/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 143/169 kB | 52/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 147/169 kB | 52/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 147/169 kB | 56/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 151/169 kB | 56/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 151/169 kB | 61/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 155/169 kB | 61/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 155/169 kB | 65/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 159/169 kB | 65/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 163/169 kB | 65/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 167/169 kB | 65/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 65/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 69/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 73/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 77/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 81/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 85/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 89/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 93/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 97/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 101/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 106/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 110/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 114/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 118/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 122/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 126/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 130/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 134/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 138/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 142/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 147/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 151/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 155/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 159/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 163/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 167/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 171/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 175/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 179/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 183/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 187/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 192/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 196/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 200/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 204/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 208/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 212/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 216/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 220/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 224/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 228/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 233/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 237/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 241/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 245/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 249/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 253/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 257/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 261/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 265/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 269/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 274/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 278/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 282/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 286/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 290/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 294/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 298/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 302/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 306/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 310/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 314/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 319/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 323/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 327/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 331/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 335/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 339/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 342/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 346/348 kB
Progress (5): 58 kB | 125 kB | 57 kB | 169 kB | 348 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/3.4.0/maven-common-artifact-filters-3.4.0.jar (58 kB at 304 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/ow2/asm/asm/9.7/asm-9.7.jar (125 kB at 640 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.1/plexus-utils-1.1.jar (169 kB at 839 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-java/1.3.0/plexus-java-1.3.0.jar (57 kB at 284 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/com/thoughtworks/qdox/qdox/2.1.0/qdox-2.1.0.jar (348 kB at 1.6 MB/s)
[[1;34mINFO[m] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-junit-platform/3.5.2/surefire-junit-platform-3.5.2.pom
Progress (1): 4.1 kB
Progress (1): 5.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-junit-platform/3.5.2/surefire-junit-platform-3.5.2.pom (5.7 kB at 78 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-providers/3.5.2/surefire-providers-3.5.2.pom
Progress (1): 2.6 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-providers/3.5.2/surefire-providers-3.5.2.pom (2.6 kB at 36 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/common-java5/3.5.2/common-java5-3.5.2.pom
Progress (1): 2.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/common-java5/3.5.2/common-java5-3.5.2.pom (2.8 kB at 41 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.9.3/junit-platform-engine-1.9.3.pom
Progress (1): 3.2 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.9.3/junit-platform-engine-1.9.3.pom (3.2 kB at 49 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.2.0/opentest4j-1.2.0.pom
Progress (1): 1.7 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.2.0/opentest4j-1.2.0.pom (1.7 kB at 24 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.9.3/junit-platform-commons-1.9.3.pom
Progress (1): 2.8 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.9.3/junit-platform-commons-1.9.3.pom (2.8 kB at 42 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.9.3/junit-platform-launcher-1.9.3.pom
Progress (1): 3.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.9.3/junit-platform-launcher-1.9.3.pom (3.0 kB at 47 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/common-java5/3.5.2/common-java5-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-junit-platform/3.5.2/surefire-junit-platform-3.5.2.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.9.3/junit-platform-engine-1.9.3.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.2.0/opentest4j-1.2.0.jar
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.9.3/junit-platform-commons-1.9.3.jar
Progress (1): 4.1/189 kB
Progress (1): 7.7/189 kB
Progress (1): 11/189 kB
Progress (1): 15/189 kB
Progress (1): 20/189 kB
Progress (1): 24/189 kB
Progress (1): 28/189 kB
Progress (1): 32/189 kB
Progress (1): 36/189 kB
Progress (1): 40/189 kB
Progress (1): 44/189 kB
Progress (1): 48/189 kB
Progress (1): 52/189 kB
Progress (1): 56/189 kB
Progress (1): 61/189 kB
Progress (1): 65/189 kB
Progress (1): 69/189 kB
Progress (1): 73/189 kB
Progress (1): 77/189 kB
Progress (1): 81/189 kB
Progress (1): 85/189 kB
Progress (1): 89/189 kB
Progress (1): 93/189 kB
Progress (2): 93/189 kB | 4.1/7.7 kB
Progress (2): 93/189 kB | 7.7 kB
Progress (2): 97/189 kB | 7.7 kB
Progress (2): 101/189 kB | 7.7 kB
Progress (2): 106/189 kB | 7.7 kB
Progress (2): 110/189 kB | 7.7 kB
Progress (2): 114/189 kB | 7.7 kB
Progress (2): 118/189 kB | 7.7 kB
Progress (2): 122/189 kB | 7.7 kB
Progress (2): 126/189 kB | 7.7 kB
Progress (2): 130/189 kB | 7.7 kB
Progress (2): 134/189 kB | 7.7 kB
Progress (2): 138/189 kB | 7.7 kB
Progress (2): 142/189 kB | 7.7 kB
Progress (2): 147/189 kB | 7.7 kB
Progress (2): 151/189 kB | 7.7 kB
Progress (2): 155/189 kB | 7.7 kB
Progress (2): 159/189 kB | 7.7 kB
Progress (2): 163/189 kB | 7.7 kB
Progress (2): 167/189 kB | 7.7 kB
Progress (2): 171/189 kB | 7.7 kB
Progress (2): 175/189 kB | 7.7 kB
Progress (2): 179/189 kB | 7.7 kB
Progress (2): 183/189 kB | 7.7 kB
Progress (2): 187/189 kB | 7.7 kB
Progress (2): 189 kB | 7.7 kB
Progress (3): 189 kB | 7.7 kB | 4.1/27 kB
Progress (3): 189 kB | 7.7 kB | 7.7/27 kB
Progress (3): 189 kB | 7.7 kB | 11/27 kB
Progress (3): 189 kB | 7.7 kB | 15/27 kB
Progress (3): 189 kB | 7.7 kB | 20/27 kB
Progress (3): 189 kB | 7.7 kB | 24/27 kB
Progress (3): 189 kB | 7.7 kB | 27 kB
Progress (4): 189 kB | 7.7 kB | 27 kB | 4.1/18 kB
Progress (4): 189 kB | 7.7 kB | 27 kB | 7.7/18 kB
Progress (4): 189 kB | 7.7 kB | 27 kB | 12/18 kB
Progress (4): 189 kB | 7.7 kB | 27 kB | 16/18 kB
Progress (4): 189 kB | 7.7 kB | 27 kB | 18 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 4.1/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 7.7/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 12/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 16/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 20/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 24/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 28/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 32/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 36/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 40/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 45/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 49/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 53/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 57/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 61/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 65/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 69/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 73/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 77/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 81/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 86/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 90/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 94/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 98/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 102/103 kB
Progress (5): 189 kB | 7.7 kB | 27 kB | 18 kB | 103 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/opentest4j/opentest4j/1.2.0/opentest4j-1.2.0.jar (7.7 kB at 134 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.9.3/junit-platform-launcher-1.9.3.jar
Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-engine/1.9.3/junit-platform-engine-1.9.3.jar (189 kB at 3.0 MB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/common-java5/3.5.2/common-java5-3.5.2.jar (18 kB at 244 kB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-commons/1.9.3/junit-platform-commons-1.9.3.jar (103 kB at 1.5 MB/s)
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-junit-platform/3.5.2/surefire-junit-platform-3.5.2.jar (27 kB at 347 kB/s)
Progress (1): 3.2/169 kB
Progress (1): 7.3/169 kB
Progress (1): 11/169 kB
Progress (1): 15/169 kB
Progress (1): 20/169 kB
Progress (1): 24/169 kB
Progress (1): 28/169 kB
Progress (1): 32/169 kB
Progress (1): 36/169 kB
Progress (1): 40/169 kB
Progress (1): 44/169 kB
Progress (1): 48/169 kB
Progress (1): 52/169 kB
Progress (1): 56/169 kB
Progress (1): 61/169 kB
Progress (1): 65/169 kB
Progress (1): 69/169 kB
Progress (1): 73/169 kB
Progress (1): 77/169 kB
Progress (1): 81/169 kB
Progress (1): 85/169 kB
Progress (1): 89/169 kB
Progress (1): 93/169 kB
Progress (1): 97/169 kB
Progress (1): 101/169 kB
Progress (1): 106/169 kB
Progress (1): 110/169 kB
Progress (1): 114/169 kB
Progress (1): 118/169 kB
Progress (1): 122/169 kB
Progress (1): 126/169 kB
Progress (1): 130/169 kB
Progress (1): 134/169 kB
Progress (1): 138/169 kB
Progress (1): 142/169 kB
Progress (1): 147/169 kB
Progress (1): 151/169 kB
Progress (1): 155/169 kB
Progress (1): 159/169 kB
Progress (1): 163/169 kB
Progress (1): 167/169 kB
Progress (1): 169 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.9.3/junit-platform-launcher-1.9.3.jar (169 kB at 1.6 MB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.pom
Progress (1): 3.0 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.pom (3.0 kB at 58 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.jar
Progress (1): 4.1/208 kB
Progress (1): 7.7/208 kB
Progress (1): 12/208 kB
Progress (1): 16/208 kB
Progress (1): 20/208 kB
Progress (1): 24/208 kB
Progress (1): 28/208 kB
Progress (1): 32/208 kB
Progress (1): 36/208 kB
Progress (1): 40/208 kB
Progress (1): 45/208 kB
Progress (1): 49/208 kB
Progress (1): 53/208 kB
Progress (1): 57/208 kB
Progress (1): 61/208 kB
Progress (1): 65/208 kB
Progress (1): 69/208 kB
Progress (1): 73/208 kB
Progress (1): 77/208 kB
Progress (1): 81/208 kB
Progress (1): 86/208 kB
Progress (1): 90/208 kB
Progress (1): 94/208 kB
Progress (1): 98/208 kB
Progress (1): 102/208 kB
Progress (1): 106/208 kB
Progress (1): 110/208 kB
Progress (1): 114/208 kB
Progress (1): 118/208 kB
Progress (1): 122/208 kB
Progress (1): 126/208 kB
Progress (1): 131/208 kB
Progress (1): 135/208 kB
Progress (1): 139/208 kB
Progress (1): 143/208 kB
Progress (1): 147/208 kB
Progress (1): 151/208 kB
Progress (1): 155/208 kB
Progress (1): 159/208 kB
Progress (1): 163/208 kB
Progress (1): 167/208 kB
Progress (1): 172/208 kB
Progress (1): 176/208 kB
Progress (1): 180/208 kB
Progress (1): 184/208 kB
Progress (1): 188/208 kB
Progress (1): 192/208 kB
Progress (1): 196/208 kB
Progress (1): 200/208 kB
Progress (1): 204/208 kB
Progress (1): 208 kB

Downloaded from central: https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.jar (208 kB at 3.7 MB/s)
[[1;34mINFO[m]
[[1;34mINFO[m] -------------------------------------------------------
[[1;34mINFO[m]  T E S T S
[[1;34mINFO[m] -------------------------------------------------------
[[1;34mINFO[m] Running [1mGameOfLifeCliTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m3[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.230 s -- in [1mGameOfLifeCliTest[m
[[1;34mINFO[m] Running [1mGameOfLifeTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m7[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.011 s -- in [1mGameOfLifeTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 10, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  13.505 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:35:40Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **282** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 89 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 13 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 277743 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |
