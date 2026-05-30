import {
  quote,
  claim,
  type Customer,
  type Item,
  type Incident,
  type QuoteOptions,
} from "./claim-office.js";

interface QuoteRequest {
  operation: "quote";
  customer: Customer;
  items: Item[];
  options?: QuoteOptions;
}

interface ClaimRequest {
  operation: "claim";
  items: Item[];
  incident: Incident;
}

type Request = QuoteRequest | ClaimRequest;

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const process_ = (request: Request): unknown => {
  switch (request.operation) {
    case "quote":
      return quote(request.customer, request.items, request.options);
    case "claim":
      return claim(request.items, request.incident);
    default: {
      const { operation } = request as { operation: string };
      throw new Error(`Unknown operation: ${operation}`);
    }
  }
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const request = JSON.parse(input) as Request;
  const result = process_(request);
  process.stdout.write(JSON.stringify(result) + "\n");
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
