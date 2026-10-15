import { Fragment } from "react";
import { repoTreeHref } from "./github-link.js";
import { rqPageTitle } from "./rq-page-title.js";
import { runsSummary, type RunCell } from "./rq-runs-summary.js";
import { workflowEntryHref } from "./site-links.js";

type Choice = string | { any: string[] };
type Pair = Record<string, Choice>;
type FactorLevel = Choice | Pair;

function alternatives(choice: Choice): string[] {
  return typeof choice === "string" ? [choice] : choice.any;
}

export interface RqHeaderInput {
  id: string;
  question: string;
  path: string;
  factors: Record<string, FactorLevel[]>;
  controls?: Record<string, Choice>;
  min_replicates: number;
  cells: RunCell[];
  closed?: string;
}

function isPair(level: FactorLevel): level is Pair {
  return typeof level === "object" && !("any" in level);
}

function isChoice(level: FactorLevel): level is Choice {
  return !isPair(level);
}

function joined<T>(items: T[], separator: string, render: (item: T) => React.ReactNode) {
  return items.map((item, index) => <Fragment key={index}>{index > 0 && separator}{render(item)}</Fragment>);
}

function ChoiceView({ name, choice }: { name: string; choice: Choice }) {
  return joined(alternatives(choice), " / ", alternative => name === "workflow"
    ? <a href={workflowEntryHref(alternative)}>{alternative}</a> : alternative);
}

function Factor({ name, levels }: { name: string; levels: FactorLevel[] }) {
  const pairs = levels.filter(isPair);
  if (pairs.length) return <PairedFactor name={name} pairs={pairs} />;
  return <div>{name}: {joined(levels.filter(isChoice), ", ", choice => <ChoiceView name={name} choice={choice} />)}</div>;
}

function PairedFactor({ name, pairs }: { name: string; pairs: Pair[] }) {
  return <div>
    <span>{name.split("_x_").join(" × ")}</span>
    <ul>{pairs.map((pair, index) => <li key={index}>{joined(Object.entries(pair), " · ", ([key, choice]) => <ChoiceView name={key} choice={choice} />)}</li>)}</ul>
  </div>;
}

export function RqHeader({ rq }: { rq: RqHeaderInput }) {
  return <header>
    <h1>{rqPageTitle(rq.id)}</h1>
    <p className="question">{rq.question}</p>
    {rq.closed && <div className="banner closed"><strong>Closed.</strong> {rq.closed}</div>}
    <dl className="meta">
      <dt title="Factors are what this RQ varies to compare its cells.">Factor(s)</dt>
      <dd>{Object.entries(rq.factors).map(([name, levels]) => <Factor key={name} name={name} levels={levels} />)}</dd>
      {rq.controls && <>
        <dt title="Controls are what stays fixed in every run.">Control(s)</dt>
        <dd><ul>{Object.entries(rq.controls).map(([name, choice]) => <li key={name}>{name}: <ChoiceView name={name} choice={choice} /></li>)}</ul></dd>
      </>}
      <dt>Runs</dt>
      <dd>{runsSummary(rq.cells, rq.min_replicates)}</dd>
      <dt>Source</dt>
      <dd><a href={repoTreeHref(rq.path)}>View on GitHub</a></dd>
    </dl>
  </header>;
}
