const PROCESSING_FEE_GOLD = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const scenario = JSON.parse(input);
const step = scenario.steps[0];
const basePremium = step.items.reduce(
  (sum: number, item: { type: string }) => sum + BASE_PREMIUM_BY_TYPE[item.type],
  0,
);
const premium = basePremium + basePremium / 10 + PROCESSING_FEE_GOLD;

process.stdout.write(JSON.stringify({ results: [{ premium }] }));
