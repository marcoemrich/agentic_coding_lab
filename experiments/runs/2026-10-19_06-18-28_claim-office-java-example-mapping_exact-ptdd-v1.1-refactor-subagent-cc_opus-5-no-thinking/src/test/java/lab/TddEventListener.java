package lab;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.junit.platform.engine.TestExecutionResult;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestIdentifier;
import org.junit.platform.launcher.TestPlan;

/**
 * Records one append-only event per test-suite invocation, for measuring TDD
 * discipline without workflow markers and without reading the transcript.
 *
 * <p>The counterpart of tdd-reporter.mjs on the TypeScript stack and conftest.py
 * on the Python one; the rationale lives in the former in full. Registered
 * through the ServiceLoader file under src/test/resources, so JUnit itself
 * invokes it and no workflow has to be touched.
 *
 * <p>It lives under {@code src/test/java/lab/} rather than beside the kata's
 * tests because it is lab infrastructure, not part of the exercise:
 * analyze-run.sh excludes any path containing a {@code lab} segment from the
 * Java source and test LoC counts, so this file does not inflate Test LoC. It
 * cannot live outside
 * src/test/java without build-helper-maven-plugin, which is not in the
 * container's Maven cache and would make every Java run depend on a network
 * fetch.
 *
 * <p><b>Known gap, and it is structural.</b> {@code mvn test} runs
 * {@code test-compile} first, so when production code does not compile the
 * build aborts before JUnit starts and this listener never runs. That is
 * exactly the {@code Red(c)} step of a two-step red phase, so on Java a
 * two-step red appears as a single {@code Red} once it compiles, and
 * {@code red_batch_unmeasurable} reads 0 where TypeScript would read more.
 * Chain metrics stay valid; the compile step is invisible rather than
 * mislabelled.
 *
 * <p>Two hard constraints: it writes nothing to stdout or stderr (the
 * verification suites assert the kata CLI's stderr is empty), and it never
 * throws — a listener that raises would fail the test run, and a missing event
 * is a measurement gap while a broken run is corrupted data.
 */
public class TddEventListener implements TestExecutionListener {

    private static final String EVENTS_FILE = "tdd-events.jsonl";
    private static final List<String> ROOTS = List.of("src/main/java", "src/test/java");
    private static final Set<String> SKIP_DIRS = Set.of("target", ".git", "lab");

    private final List<String> passed = Collections.synchronizedList(new ArrayList<>());
    private final List<String> failed = Collections.synchronizedList(new ArrayList<>());
    private final List<String> skipped = Collections.synchronizedList(new ArrayList<>());
    private long startedAt;

    @Override
    public void testPlanExecutionStarted(TestPlan plan) {
        startedAt = System.currentTimeMillis();
    }

    @Override
    public void executionSkipped(TestIdentifier id, String reason) {
        if (id.isTest()) {
            skipped.add(id.getDisplayName());
        }
    }

    @Override
    public void executionFinished(TestIdentifier id, TestExecutionResult result) {
        if (!id.isTest()) {
            return;
        }
        if (result.getStatus() == TestExecutionResult.Status.SUCCESSFUL) {
            passed.add(name(id));
        } else {
            failed.add(name(id));
        }
    }

    private String name(TestIdentifier id) {
        return id.getParentId().map(p -> p + " > ").orElse("") + id.getDisplayName();
    }

    @Override
    public void testPlanExecutionFinished(TestPlan plan) {
        try {
            if (System.getenv("TDD_REPORTER_OFF") != null) {
                return;
            }
            Path root = Paths.get("").toAbsolutePath();
            Path events = root.resolve(EVENTS_FILE);
            long seq = 1;
            if (Files.exists(events)) {
                try (Stream<String> lines = Files.lines(events)) {
                    seq = lines.filter(l -> !l.isBlank()).count() + 1;
                }
            }
            int total = passed.size() + failed.size() + skipped.size();
            StringBuilder sb = new StringBuilder(512);
            sb.append("{\"seq\":").append(seq)
              .append(",\"ts\":\"").append(Instant.now()).append('"')
              // Derived here for convenience; tdd-report.py recomputes it from
              // the counts so a fix to the rule reaches existing streams.
              .append(",\"suite_failed\":").append(!failed.isEmpty())
              .append(",\"tests\":{\"passed\":").append(passed.size())
              .append(",\"failed\":").append(failed.size())
              .append(",\"skipped\":").append(skipped.size())
              .append(",\"total\":").append(total).append('}')
              // A JUnit plan that started reports every test it collected, so
              // there is no analogue of vitest's declared-but-unrun file. 0
              // marks the current event format for tdd-report.py.
              .append(",\"collection_errors\":0,\"files_failed\":0")
              .append(",\"failed_tests\":").append(jsonArray(failed))
              .append(",\"passed_tests\":").append(jsonArray(passed))
              .append(",\"duration_ms\":").append(System.currentTimeMillis() - startedAt)
              .append(",\"tree\":").append(tree(root))
              .append("}\n");
            Files.writeString(events, sb.toString(), StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception | Error e) {
            // Recording failed. Losing one event is acceptable; failing the run
            // is not.
        }
    }

    private static String jsonArray(List<String> items) {
        StringBuilder sb = new StringBuilder("[");
        synchronized (items) {
            for (int i = 0; i < items.size(); i++) {
                if (i > 0) {
                    sb.append(',');
                }
                sb.append('"').append(escape(items.get(i))).append('"');
            }
        }
        return sb.append(']').toString();
    }

    private static String tree(Path root) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (String r : ROOTS) {
            Path base = root.resolve(r);
            if (!Files.isDirectory(base)) {
                continue;
            }
            try (Stream<Path> walk = Files.walk(base)) {
                List<Path> files = walk.filter(Files::isRegularFile)
                        .filter(p -> p.toString().endsWith(".java"))
                        .filter(p -> isExerciseFile(root, p))
                        .sorted()
                        .toList();
                for (Path p : files) {
                    byte[] raw;
                    try {
                        raw = Files.readAllBytes(p);
                    } catch (IOException | UncheckedIOException e) {
                        continue;   // unreadable mid-write: skip it, keep the event
                    }
                    if (!first) {
                        sb.append(',');
                    }
                    first = false;
                    sb.append('"').append(escape(root.relativize(p).toString()))
                      .append("\":{\"sha256\":\"").append(sha256(raw))
                      .append("\",\"bytes\":").append(raw.length)
                      .append(",\"lines\":").append(countLines(raw)).append('}');
                }
            } catch (IOException | UncheckedIOException e) {
                // directory vanished mid-walk; keep what we have
            }
        }
        return sb.append('}').toString();
    }

    /** This listener is lab infrastructure and must not appear in the tree. */
    private static boolean isExerciseFile(Path root, Path p) {
        for (Path part : root.relativize(p)) {
            if (SKIP_DIRS.contains(part.toString())) {
                return false;
            }
        }
        return true;
    }

    private static int countLines(byte[] raw) {
        int n = 1;
        for (byte b : raw) {
            if (b == '\n') {
                n++;
            }
        }
        return n;
    }

    private static String sha256(byte[] raw) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(raw);
            StringBuilder sb = new StringBuilder(16);
            for (int i = 0; i < 8; i++) {
                sb.append(String.format("%02x", d[i]));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "").replace("\t", "\\t");
    }
}
