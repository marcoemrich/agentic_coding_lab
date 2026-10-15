import GithubSlugger from "github-slugger";
import { Marked } from "marked";
import { findingsLinkHref, type FindingsContext } from "./findings-links.js";

// The page already has its own h1 and h2s; findings start two levels below.
const HEADING_SHIFT = 2;
const DEEPEST_HEADING = 6;

export function renderFindings(markdown: string, context: FindingsContext): string {
  // GitHub's heading ids, so the anchors the findings already link to keep working.
  const slugger = new GithubSlugger();
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const level = Math.min(depth + HEADING_SHIFT, DEEPEST_HEADING);
        return `<h${level} id="${slugger.slug(text)}">${this.parser.parseInline(tokens)}</h${level}>\n`;
      },
      link({ href, tokens }) {
        return `<a href="${findingsLinkHref(href, context)}">${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  return marked.parse(markdown, { async: false });
}
