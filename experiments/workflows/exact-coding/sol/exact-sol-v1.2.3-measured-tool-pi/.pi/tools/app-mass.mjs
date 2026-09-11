#!/usr/bin/env node
/**
 * APP mass over a TypeScript source tree, counted from the AST.
 *
 * Total Mass = constants*1 + bindings*1 + invocations*2
 *            + conditionals*4 + loops*5 + assignments*6
 *
 * Usage:
 *   pnpm exec tsx .pi/tools/app-mass.mjs src/
 *   pnpm exec tsx .pi/tools/app-mass.mjs src/ --json
 *   pnpm exec tsx .pi/tools/app-mass.mjs src/ --per-file
 *
 * Spec files (*.spec.ts, *.test.ts) are excluded: APP is a production-code
 * metric. Type-only constructs (interfaces, type aliases, declared return
 * types) carry no runtime elements and are not counted.
 */

import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";

const COMPONENT_WEIGHTS = {
  constants: 1,
  bindings: 1,
  invocations: 2,
  conditionals: 4,
  loops: 5,
  assignments: 6,
};

function collectSourceFiles(target) {
  const stats = statSync(target);
  if (stats.isFile()) return [target];

  const found = [];
  for (const entry of readdirSync(target)) {
    const path = join(target, entry);
    if (statSync(path).isDirectory()) {
      found.push(...collectSourceFiles(path));
    } else if (/\.tsx?$/.test(entry) && !/\.(spec|test)\.tsx?$/.test(entry)) {
      found.push(path);
    }
  }
  return found.sort();
}

/** Type positions carry no runtime elements — skip those subtrees entirely. */
function isTypeOnly(node) {
  return (
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isTypeNode(node) ||
    ts.isTypeParameterDeclaration(node)
  );
}

function countComponents(sourceFile) {
  const counts = {
    constants: 0,
    bindings: 0,
    invocations: 0,
    conditionals: 0,
    loops: 0,
    assignments: 0,
  };

  const visit = (node) => {
    if (isTypeOnly(node)) return;

    switch (node.kind) {
      // --- Constants: literal values ---------------------------------
      case ts.SyntaxKind.NumericLiteral:
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
      case ts.SyntaxKind.NullKeyword:
      case ts.SyntaxKind.RegularExpressionLiteral:
        counts.constants++;
        break;

      // --- Bindings: names introduced into scope ---------------------
      case ts.SyntaxKind.VariableDeclaration:
      case ts.SyntaxKind.Parameter:
      case ts.SyntaxKind.BindingElement:
      case ts.SyntaxKind.PropertyDeclaration:
      case ts.SyntaxKind.PropertyAssignment:
      case ts.SyntaxKind.ShorthandPropertyAssignment:
      case ts.SyntaxKind.EnumMember:
        counts.bindings++;
        break;

      // --- Invocations: calls into other code ------------------------
      case ts.SyntaxKind.CallExpression:
      case ts.SyntaxKind.NewExpression:
      case ts.SyntaxKind.TaggedTemplateExpression:
        counts.invocations++;
        break;

      // --- Conditionals: branching control flow ----------------------
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ConditionalExpression:
      case ts.SyntaxKind.CaseClause:
      case ts.SyntaxKind.CatchClause:
        counts.conditionals++;
        break;

      // --- Loops: iteration ------------------------------------------
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
        counts.loops++;
        break;
    }

    // --- Assignments: mutation of existing state ---------------------
    // Binary `=`, compound `+=` etc., and unary `++`/`--`. A variable
    // declaration with an initialiser is a binding, not an assignment.
    if (ts.isBinaryExpression(node)) {
      const op = node.operatorToken.kind;
      if (
        op === ts.SyntaxKind.EqualsToken ||
        (op >= ts.SyntaxKind.PlusEqualsToken &&
          op <= ts.SyntaxKind.CaretEqualsToken) ||
        op === ts.SyntaxKind.QuestionQuestionEqualsToken ||
        op === ts.SyntaxKind.BarBarEqualsToken ||
        op === ts.SyntaxKind.AmpersandAmpersandEqualsToken
      ) {
        counts.assignments++;
      }
    } else if (
      (ts.isPostfixUnaryExpression(node) || ts.isPrefixUnaryExpression(node)) &&
      (node.operator === ts.SyntaxKind.PlusPlusToken ||
        node.operator === ts.SyntaxKind.MinusMinusToken)
    ) {
      counts.assignments++;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return counts;
}

function massOf(counts) {
  return Object.entries(COMPONENT_WEIGHTS).reduce(
    (sum, [component, weight]) => sum + counts[component] * weight,
    0,
  );
}

function analyse(target) {
  const files = collectSourceFiles(target);
  const perFile = files.map((path) => {
    const source = ts.createSourceFile(
      path,
      ts.sys.readFile(path) ?? "",
      ts.ScriptTarget.ES2022,
      true,
    );
    const counts = countComponents(source);
    return { path, counts, mass: massOf(counts) };
  });

  const totals = perFile.reduce(
    (acc, file) => {
      for (const key of Object.keys(COMPONENT_WEIGHTS)) {
        acc[key] += file.counts[key];
      }
      return acc;
    },
    { constants: 0, bindings: 0, invocations: 0, conditionals: 0, loops: 0, assignments: 0 },
  );

  return { files: perFile, totals, mass: massOf(totals) };
}

function formatTable(counts) {
  return Object.entries(COMPONENT_WEIGHTS)
    .map(([component, weight]) => {
      const count = counts[component];
      const label = component.padEnd(13);
      return `  ${label} ${String(count).padStart(4)} x${weight} = ${String(count * weight).padStart(5)}`;
    })
    .join("\n");
}

// --- main ---------------------------------------------------------------

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const target = args.find((a) => !a.startsWith("--")) ?? "src";

let result;
try {
  result = analyse(resolve(target));
} catch (error) {
  console.error(`app-mass: cannot read '${target}': ${error.message}`);
  process.exit(1);
}

if (result.files.length === 0) {
  console.error(`app-mass: no production .ts files under '${target}'`);
  process.exit(1);
}

if (flags.has("--json")) {
  console.log(
    JSON.stringify(
      {
        total_mass: result.mass,
        components: result.totals,
        files: result.files.map((f) => ({
          path: f.path,
          mass: f.mass,
          components: f.counts,
        })),
      },
      null,
      2,
    ),
  );
} else {
  if (flags.has("--per-file") && result.files.length > 1) {
    for (const file of result.files) {
      console.log(`${file.path}: ${file.mass}`);
    }
    console.log("");
  }
  console.log(formatTable(result.totals));
  console.log(`  ${"".padEnd(13)} ${"".padStart(4)}      ${"-".repeat(5)}`);
  console.log(`  TOTAL MASS    ${String(result.mass).padStart(15)}`);
}
