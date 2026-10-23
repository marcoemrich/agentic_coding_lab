import { describe, it, expect } from "vitest";
import { Readable, Writable } from "node:stream";

interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

async function runCliWith(input: string): Promise<CliResult> {
  const stdin = Readable.from([Buffer.from(input)]);
  let stdout = "";
  let stderr = "";
  const stdoutStream = new Writable({
    write(chunk, _enc, cb) {
      stdout += chunk.toString();
      cb();
    },
  });
  const stderrStream = new Writable({
    write(chunk, _enc, cb) {
      stderr += chunk.toString();
      cb();
    },
  });
  // Patch process.stderr.write to capture
  const origWrite = process.stderr.write.bind(process.stderr);
  (process.stderr as any).write = (chunk: any, ...args: any[]) => {
    stderr += typeof chunk === "string" ? chunk : chunk.toString();
    return true;
  };
  let exitCode = 0;
  try {
    const { runCli } = await import("./cli.js");
    exitCode = await runCli(stdin, stdoutStream);
  } catch (e: any) {
    stderr += e?.message ?? String(e);
    exitCode = 1;
  } finally {
    (process.stderr as any).write = origWrite;
  }
  return { exitCode, stdout, stderr };
}

describe("CLI - Input/Output behavior", () => {
  it("should read JSON from stdin, write JSON results to stdout, exit 0 on valid input", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const { exitCode, stdout, stderr } = await runCliWith(input);
    expect(exitCode).toBe(0);
    expect(stderr).toBe("");
    const result = JSON.parse(stdout);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].premium).toBe(59);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });

  it("should exit non-zero with error to stderr on unknown item type", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { exitCode, stdout, stderr } = await runCliWith(input);
    expect(exitCode).not.toBe(0);
    expect(stderr).not.toBe("");
  });

  it("should exit non-zero with error to stderr on damage for item not in policy", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const { exitCode, stderr } = await runCliWith(input);
    expect(exitCode).not.toBe(0);
    expect(stderr).not.toBe("");
  });

  it("should exit non-zero with error to stderr on negative damage amount", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    const { exitCode, stderr } = await runCliWith(input);
    expect(exitCode).not.toBe(0);
    expect(stderr).not.toBe("");
  });

  it("should exit non-zero on malformed JSON input", async () => {
    const { exitCode, stderr } = await runCliWith("{not valid json");
    expect(exitCode).not.toBe(0);
    expect(stderr).not.toBe("");
  });
});
