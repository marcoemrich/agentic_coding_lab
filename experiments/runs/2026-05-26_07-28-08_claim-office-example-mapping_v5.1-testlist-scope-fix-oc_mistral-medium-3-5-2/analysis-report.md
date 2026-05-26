# Analysis Report: 2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2

Generated: 2026-05-26T13:20:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | mistral-medium-3-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5624s |
| Started | 2026-05-26T07:28:08+00:00 |
| Ended | 2026-05-26T09:01:55+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 152
- **Test file**: cli.spec.ts
- **Test file LOC**: 472
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2

 ❯ src/cli.spec.ts  (41 tests | 37 failed) 107ms
   ❯ src/cli.spec.ts > CLI claim-office > Empty and edge cases > should return premium 5 for empty item list
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 115 for single sword (100 + 10 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 71 for single amulet (60 + 6 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 93 for single staff (80 + 8 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 49 for single potion (40 + 4 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 33 for single rune (25 + 3 first insurance rounded up + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 33 for single moonstone (25 + 2.5 first insurance + 5 fee, rounded up)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 60 for 2 runes (50 + 5 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 71 for 3 runes block (60 + 6 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 115 for 4 runes (100 + 10 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 198 for 7 runes (175 + 17.5 first insurance + 5 fee, rounded up)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 88 for 2 runes + 1 moonstone (75 + 7.5 first insurance + 5 fee, rounded up)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 137 for 3 runes + 3 moonstones (120 + 12 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 165 for cursed sword (100 + 50 cursed + 10 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 145 for sword enchantment 5 (100 + 30 high enchant + 10 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 195 for cursed sword enchantment 5 (100 + 50 cursed + 30 high enchant + 10 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 115 for sword enchantment 4 (100 + 10 first insurance + 5 fee, no high enchant)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 101 for cursed amulet (60 + 30 cursed + 6 first insurance + 5 fee)
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 20% loyalty discount for customer with 2 years
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 10% first insurance surcharge
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 15% follow-up contract discount
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Modifier scope > should apply cursed surcharge only to cursed item in multi-item policy
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Rounding > should round up 197.5 to 198
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Rounding > should round down premium with fractional part
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Integration examples > should compute 165 for newcomer with cursed sword
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Quote - Integration examples > should compute 160 for long-standing customer second contract with cursed sword enchantment 7
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Basic > should return payout 400 and remainingCap 1600 for sword damage 500
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Basic > should return payout 100 and remainingCap 400 for rune damage 200
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Deductible > should apply 100 deductible per damage event
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Deductible > should apply deductible once per damaged item
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should reimburse 50% for enchantment >= 8
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should fully reimburse dragon material
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should prioritize 50% rule when both apply
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Cap exhaustion > should cap payout at remaining cap and track across multiple claims
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Claim - Rounding > should round down payout 400.5 to 400
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Multi-step scenarios > should process quote then claim in sequence
     → spawnSync /bin/sh ENOENT
   ❯ src/cli.spec.ts > CLI claim-office > Multi-step scenarios > should track cap across multiple claims on same policy
     → spawnSync /bin/sh ENOENT

⎯⎯⎯⎯⎯⎯ Failed Tests 37 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Empty and edge cases > should return premium 5 for empty item list
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:18:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:18:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:18:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 18, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 115 for single sword (100 + 10 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:67:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:67:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:67:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 67, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 71 for single amulet (60 + 6 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:76:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"amulet"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:76:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"amulet"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:76:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 76, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 93 for single staff (80 + 8 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:85:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"staff"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:85:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"staff"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:85:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 85, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 49 for single potion (40 + 4 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:94:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"potion"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:94:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"potion"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:94:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 94, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 33 for single rune (25 + 3 first insurance rounded up + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:103:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:103:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:103:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 103, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item base premiums > should return 33 for single moonstone (25 + 2.5 first insurance + 5 fee, rounded up)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:112:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:112:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:112:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 112, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 60 for 2 runes (50 + 5 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:124:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:124:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:124:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 124, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 71 for 3 runes block (60 + 6 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:133:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:133:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:133:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 133, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 115 for 4 runes (100 + 10 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:142:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:142:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:142:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 142, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 198 for 7 runes (175 + 17.5 first insurance + 5 fee, rounded up)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:151:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:151:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:151:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 151, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 88 for 2 runes + 1 moonstone (75 + 7.5 first insurance + 5 fee, rounded up)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:160:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:160:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:160:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 160, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Component building blocks > should return 137 for 3 runes + 3 moonstones (120 + 12 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:169:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:169:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:169:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 169, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 165 for cursed sword (100 + 50 cursed + 10 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:181:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:181:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:181:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 181, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 145 for sword enchantment 5 (100 + 30 high enchant + 10 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:190:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":5}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:190:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":5}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:190:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 190, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 195 for cursed sword enchantment 5 (100 + 50 cursed + 30 high enchant + 10 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:199:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":5}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:199:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":5}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:199:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 199, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 115 for sword enchantment 4 (100 + 10 first insurance + 5 fee, no high enchant)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:208:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":4}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:208:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":4}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:208:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 208, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Item-specific modifiers > should return 101 for cursed amulet (60 + 30 cursed + 6 first insurance + 5 fee)
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:217:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"amulet","cursed":true}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:217:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"amulet","cursed":true}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:217:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 217, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 20% loyalty discount for customer with 2 years
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:229:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":2},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:229:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":2},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:229:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 229, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 10% first insurance surcharge
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:238:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:238:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:238:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 238, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Policy-wide modifiers > should apply 15% follow-up contract discount
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:250:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:250:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[{"type":"sword"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:250:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 250, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Modifier scope > should apply cursed surcharge only to cursed item in multi-item policy
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:262:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:262:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:262:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 262, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Rounding > should round up 197.5 to 198
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:274:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:274:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:274:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 274, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Rounding > should round down premium with fractional part
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:283:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:283:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"},{"type":"rune"}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:283:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 283, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Integration examples > should compute 165 for newcomer with cursed sword
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:295:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":3}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:295:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":3}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:295:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 295, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Quote - Integration examples > should compute 160 for long-standing customer second contract with cursed sword enchantment 7
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:307:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":3},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:307:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":3},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:307:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 307, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Basic > should return payout 400 and remainingCap 1600 for sword damage 500
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:322:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:322:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:322:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 322, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Basic > should return payout 100 and remainingCap 400 for rune damage 200
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:335:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":200}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:335:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":200}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:335:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 335, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Deductible > should apply 100 deductible per damage event
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:351:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:351:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:351:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 351, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Deductible > should apply deductible once per damaged item
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:363:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:363:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:363:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 363, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should reimburse 50% for enchantment >= 8
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:378:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:378:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:378:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 378, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should fully reimburse dragon material
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:390:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:390:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:390:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 390, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Special clauses > should prioritize 50% rule when both apply
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:402:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:402:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:402:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 402, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Cap exhaustion > should cap payout at remaining cap and track across multiple claims
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:418:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:418:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:418:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 418, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Claim - Rounding > should round down payout 400.5 to 400
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:436:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1001}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:436:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1001}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:436:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 436, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Multi-step scenarios > should process quote then claim in sequence
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:451:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:451:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:451:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 451, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/37]⎯

 FAIL  src/cli.spec.ts > CLI claim-office > Multi-step scenarios > should track cap across multiple claims on same policy
Error: spawnSync /bin/sh ENOENT
 ❯ spawnSync node:child_process:911:24
 ❯ Proxy.execSync node:child_process:992:15
 ❯ claimOffice src/cli.spec.ts:5:10
      3| 
      4| const claimOffice = (input: string): string => {
      5|   return execSync(`echo '${input.replace(/'/g, "'\''")}' | pnpm tsx s…
       |          ^
      6|     encoding: "utf-8",
      7|     cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_clai…
 ❯ src/cli.spec.ts:466:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]}\' | pnpm tsx src/cli.ts' ], error: { stack: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:466:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', message: 'spawnSync /bin/sh ENOENT', errno: -2, code: 'ENOENT', syscall: 'spawnSync /bin/sh', path: '/bin/sh', spawnargs: [ '-c', 'echo \'{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]}\' | pnpm tsx src/cli.ts' ], error: [Circular], status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined, stackStr: 'Error: spawnSync /bin/sh ENOENT
    at Object.spawnSync (node:internal/child_process:1120:20)
    at spawnSync (node:child_process:911:24)
    at Proxy.execSync (node:child_process:992:15)
    at claimOffice (/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:5:10)
    at /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts:466:22
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:135:14
    at file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:60:26
    at runTest (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:781:17)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)
    at runSuite (file:///home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node_modules/.pnpm/@vitest+runner@1.6.1/node_modules/@vitest/runner/dist/index.js:909:15)', nameStr: 'Error', expected: 'undefined', actual: 'undefined', constructor: 'Function<Error>', name: 'Error', toString: 'Function<toString>', stacks: [ { method: 'spawnSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 911, column: 24 }, { method: 'Proxy.execSync', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/node:child_process', line: 992, column: 15 }, { method: 'claimOffice', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 5, column: 10 }, { method: '', file: '/home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2/src/cli.spec.ts', line: 466, column: 22 } ] }, status: null, signal: null, output: null, pid: +0, stdout: undefined, stderr: undefined }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/37]⎯

 Test Files  1 failed (1)
      Tests  37 failed | 4 passed (41)
   Start at  13:21:00
   Duration  486ms (transform 33ms, setup 0ms, collect 29ms, tests 107ms, environment 0ms, prepare 94ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 7 | ×5 | 35 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **589** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 113 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 32 | 16.50 | 1 |
| Cognitive (SonarJS) | 64 | 64.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20193380 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


