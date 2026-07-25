import { processScenario } from "./scenario.js";
async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
}
async function main() {
    let input;
    try {
        const text = await readStdin();
        input = JSON.parse(text);
    }
    catch (err) {
        process.stderr.write(`failed to read/parse input: ${err.message}\n`);
        process.exit(1);
        return;
    }
    let output;
    try {
        output = processScenario(input);
    }
    catch (err) {
        process.stderr.write(`${err.message}\n`);
        process.exit(1);
        return;
    }
    process.stdout.write(`${JSON.stringify(output)}\n`);
}
main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
});
