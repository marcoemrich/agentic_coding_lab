// The concepts the workflow profiles build on, explained once for outsiders.
// Hand-written; profiles link here instead of re-explaining.
function PredictiveTdd() {
  return <section id="predictive-tdd">
    <h2>Predictive TDD</h2>
    <p>Test-driven development in which every check is preceded by a stated, falsifiable
      expectation. Before a test runs, the agent writes down what it expects to happen: whether
      the code compiles, whether the test fails, and with which message or value. Afterwards it
      compares the prediction with the actual result. A wrong prediction is a signal to stop and
      understand the code before changing it, not something to explain away.</p>
    <p>Work proceeds in Red–Green–Refactor cycles, one test at a time: Red makes exactly one new
      behavior fail for the predicted reason, Green adds the smallest change that passes it, and
      Refactor improves the design while every test stays green.</p>
    <p>The approach is inspired by <a href="https://tdd.cards/">Ted M. Young's Predictive TDD and
      TDD Game</a> and <a href="https://cyber-dojo.org/">Jon Jagger's cyber-dojo</a>.</p>
  </section>;
}

function ExactCoding() {
  return <section id="exact-coding">
    <h2>EXACT Coding</h2>
    <p>The lab's own family of TDD workflows for coding agents, built on Predictive TDD. Every
      EXACT Coding workflow consists of the same four building blocks, each a separate command,
      skill or agent: a test list, Red, Green and Refactor.</p>
    <p>The test list comes first. The agent writes the behaviors it is going to build as inactive
      tests before any production code exists, then activates them one at a time. A test that
      already passes when it is activated is accepted as evidence that an earlier change
      generalized; no failure is manufactured for it. Refactoring follows the Four Rules of Simple
      Design: passes the tests, reveals intention, no duplication, fewest elements.</p>
    <p>The workflows differ in where each building block runs — all in one shared context, each in
      its own isolated subagent, or a mix of the two — in how complete the test list is and
      whether it is cross-checked against the specification, and in the rules the refactoring
      applies. The Opus line was built on Claude Code with Claude models, the SOL line on pi with
      GPT models; either line also runs on the other harnesses.</p>
  </section>;
}

export function ConceptPage() {
  return <div className="concepts">
    <h1 className="q">Concepts</h1>
    <PredictiveTdd />
    <ExactCoding />
  </div>;
}
