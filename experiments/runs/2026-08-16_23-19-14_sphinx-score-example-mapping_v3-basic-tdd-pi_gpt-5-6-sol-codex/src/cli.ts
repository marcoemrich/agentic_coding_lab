import { scoreSphinx, type Card } from './sphinx-score';

interface ScoreRequest {
  army: Card[];
}

process.stdin.setEncoding('utf8');
let input = '';
for await (const chunk of process.stdin) {
  input += chunk;
}

const request = JSON.parse(input) as ScoreRequest;
process.stdout.write(JSON.stringify({ score: scoreSphinx(request.army) }));
