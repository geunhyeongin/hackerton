---
name: handoff
description: Continue unfinished work across Codex sessions by producing a concise, evidence-based handoff when the user invokes $handoff or when an unusually long workflow has a natural checkpoint. Do not activate for ordinary summaries or status questions.
metadata:
  short-description: Create and resume evidence-based session handoffs
---

# Handoff

Use this skill to preserve enough verified state for another Codex session (or
another agent) to resume work without repeating settled decisions.

## When to use it

- On an explicit `$handoff` request, produce the handoff immediately.
- During a long, multi-step workflow, you may make one short, non-blocking
  suggestion to create a handoff when there is a natural checkpoint, unresolved
  work, or an impending session transition. Do not interrupt ordinary questions
  or treat an inferred context-window percentage as a fact.
- Do not use this skill for a normal summary, a progress update, or a request
  that has no unfinished work to carry forward.

## Evidence and safety rules

1. Separate confirmed facts, assumptions, decisions, and open questions.
2. Never invent test results, file contents, commands, paths, metrics, or
   completion status. If something was not checked, write `확인 필요` and say
   what would verify it.
3. Inspect only what is relevant and available. For repository work, inspect
   `git status`, the current branch, recent commits, and relevant validation
   results when those checks are available. A failed or unavailable check is
   recorded as such; it is not silently treated as success.
4. Writing `HANDOFF.md`, staging it, or committing it changes external state.
   Do so only when the user explicitly requests a saved artifact and has given
   or accepted its location. Otherwise return the handoff in the response only.
5. Never include secrets, tokens, credentials, or unnecessary private data.

## Response-first workflow

For `$handoff`, write the response in this order. Put the exact next action and
blockers near the top, before background detail.

```markdown
# Handoff

## Next action
- [The single most useful next action, or `없음`]

## Blockers and open questions
- [Blocker/question, owner if known, and how to resolve it]

## Goal and success criteria
- Goal: [confirmed goal]
- Success criteria: [observable completion criteria]

## Current state
- Stage: [where the work is now]
- Status: [in progress / ready for validation / blocked / complete]
- Transition reason: [why the handoff is being made]

## Completed work and evidence
- [Completed item] — evidence: [command, result, file, or response]

## Decisions and rationale
- [Decision] — rationale: [reason]; confidence: [confirmed / assumption]

## Files and working location
- [path] — [role or relevant state]

## Validation
- Command/check: [exact command or check]
- Result: [observed result, or `확인 필요`]

## Risks and edge cases
- [Known risk, failure scenario, or `없음`]

## Scope exclusions
- [What is intentionally not included]
```

Adapt or omit a section only when it is genuinely inapplicable; do not fill
unknown fields with guesses. Keep the result concise, but preserve exact paths,
commands, error messages, and the next action when they matter for resumption.

If the user asks to save the result, confirm the requested path if it is
ambiguous, write the artifact there, then report the path and the observed
write result. If no path is supplied, return the response-first handoff and
ask whether it should be saved; do not choose a repository path silently.

## Resume behavior

When the user provides a handoff and asks to continue:

1. Treat confirmed facts and recorded decisions as the starting state.
2. Start with the listed next action or resolve the listed blocker; do not
   re-litigate settled decisions unless new evidence conflicts with them.
3. Verify time-sensitive or externally changed facts before relying on them.
4. Update uncertainty explicitly when a check changes the handoff state.
5. If the handoff is incomplete or contradictory, ask only for the missing
   information that prevents safe progress.

## Completion check

Before presenting a handoff, verify that the goal, current stage, completed
evidence, next action, blockers, and validation state are mutually consistent.
The handoff is not complete merely because a file was edited or a command was
run; it is complete when the next session can identify what to do next and why.
