# NexFortis — Replit Agent Workflow

## The Problem We're Solving

We need a workflow where:
- The Replit agent does the coding via background tasks
- Aki reviews every change (code + live site) after merge
- Issues and enhancements go through the feedback widget — one per submission
- We can parallelize independent prompts when possible
- Nothing ships without being fully verified

## The Workflow

### Always Use Background Tasks, Never the Main Agent Chat

**Why:** The main agent auto-commits directly to main with no review gate. Background tasks commit to isolated worktrees and require your explicit "approve" to merge. Since we review everything, background tasks are the only safe option.

### Step-by-Step Process

#### 1. Aki Prepares Prompts
- Writes full prompt file → pushes to `docs/prompts/`
- Writes launcher prompt (under 1,200 chars)
- Checks the implementation plan for which prompts can run in parallel
- Pushes everything to main

#### 2. Hassan Launches Background Tasks
- Pull latest in Replit (Git tab → pull)
- Open Task Board → "+ New task"
- Paste the launcher prompt
- For parallel prompts: open multiple "+ New task" entries, one per prompt
- Each task agent spins up in its own worktree and works independently

#### 3. Tasks Complete → Approve + Push + Republish
- When a task moves to "Ready" on the Task Board, press Approve
- Worktree merges into main
- Push main to GitHub from Git tab
- Republish the app
- Tell Aki it's ready (share live URL if changed)

#### 4. Aki Reviews (Code + Live Site in Parallel)
- **Code review:** Pulls the new commits from GitHub, deep diff against the last known-good commit. Checks every file changed — logic, constraints, missing requirements, grep sweeps.
- **Live site E2E:** Browser automation on the published site — tests every affected page, feature, and flow.
- Every finding goes through the **Replit feedback widget** — one item per submission:
  - Code issues (bugs, constraint violations, missing requirements)
  - Live site issues (broken UI, wrong data, bad behavior)
  - Enhancement opportunities (improvements noticed along the way)
- Each feedback is specific and focused — describes the problem and expected behavior, no code blocks
- Hassan sees them in the Replit inbox

#### 5. Hassan Fixes Feedback Items
- Review feedback in Replit inbox
- Fix items one by one or batch — your call
- When fixes are done → push to GitHub + republish

#### 6. Aki Re-Tests
- Pulls latest, verifies fixes
- Re-tests live site
- If more issues → back to step 4 (new feedback submissions)
- If clean → round complete, move to next round

### Feedback Widget Rules

1. **One issue per feedback** — never batch multiple issues into one submission
2. **Specific and focused** — "Volume pack card missing per-conversion price on mobile" not "fix the cards"
3. **No code blocks** — describe the problem and expected behavior, let the agent figure out the fix
4. **Categorize clearly** — start each feedback with [BUG], [ISSUE], or [ENHANCEMENT] so it's easy to prioritize
5. **Include page/location** — which page, which component, what the user sees

### Parallel Execution Strategy

Based on the implementation plan dependency graph:

**Round 1 (parallel):** Prompt 02 + Prompt 03 (no dependency on each other)
**Round 2 (parallel):** Prompt 04 + Prompt 05 (both need Round 1)
**Round 3 (parallel):** Prompt 06 + Prompt 07 + Prompt 08 (subscription phase)
**Round 4 (parallel):** Prompt 09 + Prompt 10 + Prompt 11 (growth + SEO)
**Round 5 (parallel):** Prompt 12 + Prompt 13 (SEO batch 2 + main site)
**Round 6 (sequential):** Prompt 14 → Prompt 15 (polish, must be last)

### Prompt Rules

1. No `git checkout`, `git branch`, `git pull`, or `git push` commands in any prompt
2. No copy-paste code blocks — describe what to do, let the agent write the code
3. Launcher prompts stay under 1,200 characters
4. Full prompts live in `docs/prompts/` — agent reads them as files
5. `docs/` directory is read-only for the agent
6. Every prompt ends with verification steps (typecheck + visual testing)

### Tracking

- **Last known-good commit:** Updated after each clean round passes review
- **Round status:** Tracked in TODO.md
- **Feedback history:** Replit inbox (Hassan's side) + Aki's review notes (workspace)
