import { describe, expect, it } from "vitest";
import { buildResultTables } from "./result-table.js";

// Story A of the RQ result table: table layout and interaction.
// What tables, rows and columns an RQ produces, independent of rendering.
describe("Result table layout", () => {
  // Rule 1: one table per kata, always headed
  it("gives an RQ with one kata one table headed by its kata id -- 4.13 -> 'claim-office-example-mapping'", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells: [], outcomes: [] }))
      .toEqual([{ kata: "claim-office-example-mapping", labelColumns: [], columns: ["cost_usd"], groups: [{ name: "Cost", colSpan: 1 }], rows: [] }]);
  });
  it("gives an RQ with two katas two tables, each headed by its kata id -- RQ-architecture-axis-opus5 -> 'claim-office-example-mapping', 'game-of-life-example-mapping'", () => {
    expect(buildResultTables({
      katas: ["claim-office-example-mapping", "game-of-life-example-mapping"],
      cells: [], outcomes: [],
    })).toMatchObject([
      { kata: "claim-office-example-mapping" }, { kata: "game-of-life-example-mapping" },
    ]);
  });

  // Rule 2: row labels from varying factors only, one column per factor
  it("labels rows by the one varying factor -- 4.13 -> label columns ['workflow']", () => {
    const tables = buildResultTables({
      katas: ["claim-office-example-mapping"], outcomes: [],
      cells: [
        { kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc" },
        { kata: "claim-office-example-mapping", workflow: "external-pocock-2026-09-04-cc" },
      ],
    });
    expect(tables).toMatchObject([{
      labelColumns: ["workflow"],
      rows: [
        { labels: { workflow: "exact-ptdd-v1-cc" } },
        { labels: { workflow: "external-pocock-2026-09-04-cc" } },
      ],
    }]);
  });
  it("leaves constant factors out of the rows -- 4.13 -> no model, kata or CLI version label column", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc", model: "opus-5-no-thinking", harness_version: "2.1.280" },
      { kata: "claim-office-example-mapping", workflow: "external-pocock-2026-09-04-cc", model: "opus-5-no-thinking", harness_version: "2.1.280" },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toEqual([{ kata: "claim-office-example-mapping", columns: ["cost_usd"], groups: [{ name: "Cost", colSpan: 1 }], labelColumns: ["workflow"], rows: [
        { labels: { workflow: "exact-ptdd-v1-cc" }, n: 0 },
        { labels: { workflow: "external-pocock-2026-09-04-cc" }, n: 0 },
      ] }]);
  });
  it("splits a paired factor into one label column per member -- RQ-exact-coding-typescript (model_x_workflow) -> ['model', 'workflow']", () => {
    const cells = [
      { kata: "claim-office-example-mapping", model: "opus-5-no-thinking", workflow: "exact-ptdd-v1-cc" },
      { kata: "claim-office-example-mapping", model: "sonnet-4-6", workflow: "external-pocock-2026-09-04-cc" },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ labelColumns: ["model", "workflow"], rows: [
        { labels: { model: "opus-5-no-thinking", workflow: "exact-ptdd-v1-cc" } },
        { labels: { model: "sonnet-4-6", workflow: "external-pocock-2026-09-04-cc" } },
      ] }]);
  });
  it("leaves out a paired member that is constant -- 4.7 (workflow_x_prompt, prompt always example-mapping) -> ['workflow']", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "superpowers", prompt: "example-mapping" },
      { kata: "claim-office-example-mapping", workflow: "external-pocock-2026-09-04-cc", prompt: "example-mapping" },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ labelColumns: ["workflow"] }]);
  });
  it("labels a varying prompt separately when workflow is constant -- ['prompt']", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc", prompt: "prose" },
      { kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc", prompt: "example-mapping" },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ labelColumns: ["prompt"], rows: [
        { labels: { prompt: "prose" } }, { labels: { prompt: "example-mapping" } },
      ] }]);
  });
  it("keeps the kata out of the label columns when it varies, because each kata has its own table -- RQ-architecture-axis-opus5 -> ['workflow']", () => {
    const katas = ["claim-office-example-mapping", "game-of-life-example-mapping"];
    const cells = katas.flatMap(kata => [
      { kata, workflow: "exact-ptdd-v1-cc" }, { kata, workflow: "external-pocock-2026-09-04-cc" },
    ]);
    expect(buildResultTables({ katas, cells, outcomes: [] }))
      .toMatchObject([{ labelColumns: ["workflow"] }, { labelColumns: ["workflow"] }]);
  });

  it("uses RQ-wide factor variation even when each kata has only one cell -- workflow label on both tables", () => {
    const katas = ["claim-office-example-mapping", "game-of-life-example-mapping"];
    const cells = [
      { kata: katas[0], workflow: "exact-ptdd-v1-cc" },
      { kata: katas[1], workflow: "external-pocock-2026-09-04-cc" },
    ];
    expect(buildResultTables({ katas, cells, outcomes: [] })).toMatchObject([
      { labelColumns: ["workflow"], rows: [{ labels: { workflow: "exact-ptdd-v1-cc" } }] },
      { labelColumns: ["workflow"], rows: [{ labels: { workflow: "external-pocock-2026-09-04-cc" } }] },
    ]);
  });

  // Rule 3: columns in frontmatter order within their group, groups in order of first appearance
  it("orders columns as declared in outcomes: -- 4.13 -> starts verification_pct, tests_passing, tdd_discipline", () => {
    const outcomes = ["verification_pct", "tests_passing", "tdd_discipline"];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells: [], outcomes }))
      .toMatchObject([{ columns: [...outcomes, "cost_usd"] }]);
  });
  it("spans one group header over each group's columns -- 4.13 -> Correctness 2, TDD discipline 19, Code quality 6, Cost 3", () => {
    const outcomes = [
      "verification_pct", "tests_passing",
      "tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_step", "tdd_discipline_closure", "test_first_rate",
      "red_batch_size", "red_batch_max", "red_batch_unmeasurable", "green_batch_size", "chain_suite_runs", "cycles_total",
      "cycles_closed", "refactor_events", "skip_events", "refactor_per_cycle", "green_attempts", "chain_deviations",
      "chain_opens_red", "chain_ends_green",
      "avg_loc_per_function", "longest_function", "cognitive_max", "mccabe_max", "smell_total", "code_mass",
      "duration_seconds", "total_tokens", "cost_usd",
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells: [], outcomes }))
      .toMatchObject([{ groups: [
        { name: "Correctness", colSpan: 2 }, { name: "TDD discipline", colSpan: 19 },
        { name: "Code quality", colSpan: 6 }, { name: "Cost", colSpan: 3 },
      ] }]);
  });

  it("gathers a group's columns under one header when outcomes interleave groups -- code_mass, production_loc, mccabe_max -> code_mass, mccabe_max, production_loc; Code quality 2, Size 1", () => {
    expect(buildResultTables({ katas: ["game-of-life-example-mapping"], cells: [], outcomes: ["code_mass", "production_loc", "mccabe_max"] }))
      .toMatchObject([{ columns: ["code_mass", "mccabe_max", "production_loc", "cost_usd"], groups: [
        { name: "Code quality", colSpan: 2 }, { name: "Size", colSpan: 1 }, { name: "Cost", colSpan: 1 },
      ] }]);
  });
  it("spans its own group headers over size and test-quality columns -- production_loc, tests_total, mutation_score -> Size 2, Test quality 1", () => {
    const outcomes = ["production_loc", "tests_total", "mutation_score"];
    expect(buildResultTables({ katas: ["game-of-life-prose"], cells: [], outcomes }))
      .toMatchObject([{ groups: [
        { name: "Size", colSpan: 2 }, { name: "Test quality", colSpan: 1 }, { name: "Cost", colSpan: 1 },
      ] }]);
  });

  // Rule 4: n under the label, cost_usd exactly once
  it("puts the cell's run count under the row label -- 4.13, exact-ptdd-v1-cc -> 'n = 5'", () => {
    const cells = [{ kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc", runs: [
      { id: "run-1" }, { id: "run-2" }, { id: "run-3" }, { id: "run-4" }, { id: "run-5" },
    ] }];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ rows: [{ n: 5 }] }]);
  });
  it("keeps a declared cost_usd at its declared position, once -- 4.13 -> cost_usd is the last column and appears once", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells: [],
      outcomes: ["verification_pct", "duration_seconds", "cost_usd"],
    })).toMatchObject([{ columns: ["verification_pct", "duration_seconds", "cost_usd"] }]);
  });
  it("appends cost_usd when it is not declared -- 4.7 -> cost_usd follows total_tokens as the last column", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells: [],
      outcomes: ["duration_seconds", "total_tokens"],
    })).toMatchObject([{ columns: ["duration_seconds", "total_tokens", "cost_usd"] }]);
  });

  // Rule 20: time span per row
  it("shows a single date when all runs share it -- 4.13, exact-ptdd-v1-cc -> '2026-10-01'", () => {
    const cells = [{ kata: "claim-office-example-mapping", runs: [
      { id: "run-1", started_at: "2026-10-01T02:02:28Z" },
      { id: "run-2", started_at: "2026-10-01T15:30:00Z" },
    ] }];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ rows: [{ span: "2026-10-01" }] }]);
  });
  it("shows the span with a shortened end date in the same year -- 4.13, external-kesseler-2026-09-30-cc -> '2026-09-30 → 10-01'", () => {
    const cells = [{ kata: "claim-office-example-mapping", runs: [
      { id: "late", started_at: "2026-10-01T02:00:00Z" },
      { id: "early", started_at: "2026-09-30T22:00:00Z" },
    ] }];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ rows: [{ span: "2026-09-30 → 10-01" }] }]);
  });
  it("keeps the full end date across a year boundary -- 2025-12-30 to 2026-01-02 -> '2025-12-30 → 2026-01-02'", () => {
    const cells = [{ kata: "claim-office-example-mapping", runs: [
      { id: "early", started_at: "2025-12-30T14:00:00Z" },
      { id: "late", started_at: "2026-01-02T03:00:00Z" },
    ] }];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ rows: [{ span: "2025-12-30 → 2026-01-02" }] }]);
  });

  // Rule 21: workflow label tag
  it("tags a workflow that writes a test list up front -- exact-ptdd-v1-cc -> 'test list'", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], outcomes: [],
      cells: [{ kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc" }],
      workflowStyles: { "exact-ptdd-v1-cc": "test list" },
    })).toMatchObject([{ rows: [{ tddStyle: "test list" }] }]);
  });
  it("tags a workflow that picks tests ad hoc -- external-pocock-2026-09-04-cc -> 'ad hoc'", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], outcomes: [],
      cells: [{ kata: "claim-office-example-mapping", workflow: "external-pocock-2026-09-04-cc" }],
      workflowStyles: { "external-pocock-2026-09-04-cc": "ad hoc" },
    })).toMatchObject([{ rows: [{ tddStyle: "ad hoc" }] }]);
  });
  it("shows no tag when the TDD style cannot be determined -- unresolvable workflow -> no tag", () => {
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], outcomes: [],
      cells: [{ kata: "claim-office-example-mapping", workflow: "unknown-workflow" }],
      workflowStyles: { "unknown-workflow": null },
    })).toEqual([{ kata: "claim-office-example-mapping", labelColumns: [], columns: ["cost_usd"],
      groups: [{ name: "Cost", colSpan: 1 }], rows: [{ labels: {}, n: 0 }],
    }]);
  });

  // Rule 22: sort order
  it("keeps the declared cell order before any sort -- 4.13 -> exact-ptdd-v1-cc first, external-kesseler-2026-09-30-cc last", () => {
    const workflows = ["exact-ptdd-v1-cc", "external-pocock-2026-09-04-cc", "external-kesseler-2026-09-30-cc"];
    const cells = workflows.map(workflow => ({ kata: "claim-office-example-mapping", workflow }));
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], outcomes: [], cells }))
      .toMatchObject([{ rows: workflows.map(workflow => ({ labels: { workflow } })) }]);
  });
  it("sorts a higher-is-better column best first -- 4.13 by verification_pct -> 100 % rows before 96 % rows", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "96 %", values: { verification_pct: { value: 0.96 } } },
      { kata: "claim-office-example-mapping", workflow: "100 %", values: { verification_pct: { value: 1 } } },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells,
      outcomes: ["verification_pct"], sort: { metric: "verification_pct", clicks: 1 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "100 %" } }, { labels: { workflow: "96 %" } },
    ] }]);
  });
  it("reverses on the second sort of the same column -- 4.13 by verification_pct twice -> 96 % rows first", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "100 %", values: { verification_pct: { value: 1 } } },
      { kata: "claim-office-example-mapping", workflow: "96 %", values: { verification_pct: { value: 0.96 } } },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells,
      outcomes: ["verification_pct"], sort: { metric: "verification_pct", clicks: 2 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "96 %" } }, { labels: { workflow: "100 %" } },
    ] }]);
  });
  it("sorts a lower-is-better column lowest first -- 4.13 by cognitive_max -> smallest mean first", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "larger", values: { cognitive_max: { value: 15 } } },
      { kata: "claim-office-example-mapping", workflow: "smaller", values: { cognitive_max: { value: 8 } } },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells,
      outcomes: ["cognitive_max"], sort: { metric: "cognitive_max", clicks: 1 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "smaller" } }, { labels: { workflow: "larger" } },
    ] }]);
  });
  it("sorts an informative column highest first -- 4.13 by refactor_events -> largest mean first", () => {
    const cells = [
      { kata: "claim-office-example-mapping", workflow: "fewer", values: { refactor_events: { value: 2 } } },
      { kata: "claim-office-example-mapping", workflow: "more", values: { refactor_events: { value: 9 } } },
    ];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells,
      outcomes: ["refactor_events"], sort: { metric: "refactor_events", clicks: 1 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "more" } }, { labels: { workflow: "fewer" } },
    ] }]);
  });
  it("sorts cells without a value last -- 4.7 by predictions_correct_rate -> superpowers and pocock (n/c) last", () => {
    const kata = "claim-office-example-mapping";
    const cells = [
      { kata, workflow: "superpowers", runs: [{ id: "a" }], values: { predictions_correct_rate: null } },
      { kata, workflow: "pocock", runs: [{ id: "b" }], values: { predictions_correct_rate: null } },
      { kata, workflow: "measured", runs: [{ id: "c" }], values: { predictions_correct_rate: { value: 0 } } },
    ];
    expect(buildResultTables({ katas: [kata], cells, outcomes: ["predictions_correct_rate"],
      sort: { metric: "predictions_correct_rate", clicks: 1 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "measured" } }, { labels: { workflow: "superpowers" } }, { labels: { workflow: "pocock" } },
    ] }]);
  });
  it("sorts a row that was never run last -- 4.7 by verification_pct -> external-kesseler-2026-09-30-cc last", () => {
    const kata = "claim-office-example-mapping";
    const cells = [
      { kata, workflow: "external-kesseler-2026-09-30-cc", runs: [] },
      { kata, workflow: "external-pocock-2026-09-04-cc", runs: [{ id: "run" }] },
    ];
    expect(buildResultTables({ katas: [kata], cells, outcomes: ["verification_pct"],
      sort: { metric: "verification_pct", clicks: 1 },
    })).toMatchObject([{ rows: [
      { labels: { workflow: "external-pocock-2026-09-04-cc" } },
      { labels: { workflow: "external-kesseler-2026-09-30-cc" } },
    ] }]);
  });

  // Rule 23: runs behind each row
  it("lists every run id of a row, each linking to its directory on GitHub -- 4.13, exact-ptdd-v1-cc -> 5 links, one to https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking", () => {
    const id = "2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking";
    const ids = [id, "run-2", "run-3", "run-4", "run-5"];
    const cells = [{ kata: "claim-office-example-mapping", workflow: "exact-ptdd-v1-cc", runs: ids.map(id => ({ id })) }];
    expect(buildResultTables({ katas: ["claim-office-example-mapping"], cells, outcomes: [] }))
      .toMatchObject([{ rows: [{ runLinks: ids.map(id => ({ id,
        href: `https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/${id}`,
      })) }] }]);
  });
  it("lists no runs for a row that was never run -- 4.7, external-kesseler-2026-09-30-cc -> not listed", () => {
    const kata = "claim-office-example-mapping";
    const cells = [{ kata, workflow: "external-kesseler-2026-09-30-cc", runs: [] }];
    expect(buildResultTables({ katas: [kata], cells, outcomes: [] }))
      .toEqual([{ kata, labelColumns: [], columns: ["cost_usd"], groups: [{ name: "Cost", colSpan: 1 }],
        rows: [{ labels: {}, n: 0 }],
      }]);
  });
});
