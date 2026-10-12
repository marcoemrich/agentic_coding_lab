# Results site agent instructions

- Write all lab artifacts in English: code, comments, documentation, story files, Example Mappings, tests, and commit messages. The conversation with the user may be in German.
- Keep an open story's Example Mapping in its own file under `docs/stories/open/`. Do not invent rules or examples; interview the user and confirm the map before recording it.
- Implement with the `exact-coding` skill every story that touches code under `site/`, plus the site data export and the build command, whose Python lives in `experiments/`. Lab-side stories (exit reasons, replicates, RQ cleanup) are done without it.
- Done stories live under `docs/stories/done/` without an Example Mapping section.
- Story filenames follow `<date>_<sequence>_<story-name>.md` (sequence runs across open and done stories for a date).
