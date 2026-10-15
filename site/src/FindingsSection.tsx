import type { FindingsContext } from "./findings-links.js";
import { FINDINGS_ID } from "./open-findings.js";
import { renderFindings } from "./render-findings.js";

// findings.md as the lab wrote it, behind a warning that it is AI-generated.
export function FindingsSection({ findings, context }: { findings?: string; context: FindingsContext }) {
  if (findings === undefined) return null;
  return <section className="findings">
    <div className="banner warn">AI-generated, not human-validated.</div>
    <details id={FINDINGS_ID} className="find">
      <summary>Findings</summary>
      <div className="md" dangerouslySetInnerHTML={{ __html: renderFindings(findings, context) }} />
    </details>
  </section>;
}
