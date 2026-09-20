import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

  private String run(String input) throws Exception {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    InputStreamHolder.run(input, out);
    return out.toString(StandardCharsets.UTF_8).trim();
  }

  static final class InputStreamHolder {
    static void run(String input, ByteArrayOutputStream out) throws Exception {
      var originalIn = System.in;
      var originalOut = System.out;
      try {
        System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
        System.setOut(new PrintStream(out, true, StandardCharsets.UTF_8));
        GameOfLifeCli.main(new String[0]);
      } finally {
        System.setIn(originalIn);
        System.setOut(originalOut);
      }
    }
  }

  @Test
  void appliesOneStepByDefaultCount() throws Exception {
    assertEquals(
        "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
        run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 1}"));
  }

  @Test
  void singleCellDiesLeavingEmptyOutput() throws Exception {
    assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
  }

  @Test
  void appliesMultipleSteps() throws Exception {
    assertEquals(
        "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
        run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
  }

  @Test
  void defaultsToOneStepWhenStepsIsMissing() throws Exception {
    assertEquals(
        "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
        run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]]}"));
  }

  @Test
  void sortsCellsByXThenY() throws Exception {
    assertEquals(
        "{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
        run("{\"aliveCells\": [[1, 1], [0, 1], [1, 0], [0, 0]], \"steps\": 1}"));
  }

  @Test
  void zeroStepsReturnsInputUnchanged() throws Exception {
    assertEquals(
        "{\"aliveCells\":[[0,0],[1,0]]}",
        run("{\"aliveCells\": [[1, 0], [0, 0]], \"steps\": 0}"));
  }
}
