import { scoreArmy, type Card } from './sphinx-score.js'

// Minimal declarations for the Node globals used below; @types/node is not a
// dependency of this project.
declare const process: {
  stdin: AsyncIterable<string | Uint8Array>
  stdout: { write(text: string): void }
}

interface ArmyDocument {
  army: Card[]
}

async function readStdin(): Promise<string> {
  const decoder = new TextDecoder()
  let input = ''
  for await (const chunk of process.stdin) {
    input += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
  }
  return input + decoder.decode()
}

const document = JSON.parse(await readStdin()) as ArmyDocument
process.stdout.write(`${JSON.stringify({ score: scoreArmy(document.army) })}\n`)
