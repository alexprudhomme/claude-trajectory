---
name: trajectory
description: Keep a live "trajectory" page for a multi-PR or multi-session project, in two matching copies, a shareable Claude artifact and a local HTML copy shown in a terminal pane. It draws lanes of work as a git-style graph with forks, merges, statuses, PRs, issues and gates. Use it whenever you coordinate work split across several PRs, repos, Jira issues or child sessions (herdr, worktrees), when a project's plan has steps that wait on each other, when the user asks for a project status page, roadmap, trajectory or "where are we" view, or when something changes on a project that already has a trajectory (a PR opened or merged, a child reported back, a gate cleared).
---

# Trajectory

A trajectory is one page that answers "where is this project, what is it waiting on, and
what happens next" at a glance. It exists in two copies that always match:

- **Claude artifact**: shareable, reads its status from the artifact's database.
- **Local copy**: a self-contained HTML file with the status embedded, so it opens with no
  login. Show it in a terminal browser pane next to the conversation when one is available.

Whoever coordinates the project (usually the session that splits the work and starts
child sessions) owns the page. Child sessions report to the coordinator; they don't edit
the page themselves. That keeps one writer and one source of truth.

## Where files live

Projects live under `$TRAJECTORY_HOME` (default `~/dev/project-docs`), one folder each:

```
$TRAJECTORY_HOME/<project-slug>/
  trajectory.json   the only file to edit
  trajectory.html   generated local copy (status embedded)
  artifact.html     generated page to publish as the Claude artifact
```

This skill ships the shared pieces:

- `assets/template.html`: the page and its design system (Rosé Pine Dawn, Rosé Pine
  Moon in dark mode, IBM Plex). Every project uses it unchanged, so all trajectories
  look alike. Change the design here, never per project.
- `scripts/build.mjs`: `node <skill-dir>/scripts/build.mjs <project-dir>` turns
  `trajectory.json` into the two HTML files.
- `references/schema.md`: every field of `trajectory.json`, how the graph is drawn and
  what each status means. Read it before writing a project's first `trajectory.json`.
- `examples/lanes/trajectory.json`: a fake four-lane project with forks, a blocked lane
  and merges. Build it to see what a good graph looks like.

## Start a trajectory

Do this as soon as the work is split (issues exist, or you're about to start child
sessions):

1. Write `trajectory.json` (see `references/schema.md`). Give each line of work that can
   move independently its own lane: usually one per repo or child session. Put every real
   cross-lane wait in `dependsOn`. The graph draws those as forks and merges, and a
   missing one makes the work look more parallel than it is. Put conditions that aren't
   steps (approvals, access, checks) in `gate`.
2. Build: `node <skill-dir>/scripts/build.mjs <project-dir>`.
3. Publish `<project-dir>/artifact.html` with the Artifact tool, declaring
   `capabilities: {db: {rules: [{path: "", read: "view", write: "admin"}]}}` so viewers
   can read but only editors can change the status. Save the returned URL as
   `artifactUrl` in `trajectory.json`.
4. Write the status into the artifact: ArtifactData `set`, collection `trajectory`,
   doc_id `status`, `file_path` = `<project-dir>/trajectory.json`.
5. Show the local copy. With terminal-browser:
   `terminal-browser open <project-dir>/trajectory.html --split right --size 0.45`
   (or `terminal-browser new-tab <path>` when one is already open). Otherwise give the
   user the file path.

When you later start a child session for independent work, add a lane for it.

## Update it

Update whenever something changes: a child reports back, a PR opens, merges or changes
state, a gate clears, the next action changes.

1. Edit `trajectory.json`: `status`, `gate`, `note`, `nextAction` (per lane or project),
   `updatedAt`.
2. Rebuild with `build.mjs`.
3. Update the artifact: ArtifactData `set` on `trajectory/status` with `file_path`,
   pinned with `if_version` from your last write (a pinned write fails rather than
   overwriting someone else's change). From a new conversation, read the doc first to
   get its version. Republish `artifact.html` only when the template changed, passing
   `artifactUrl` as `url`.
4. Reload the local copy: `terminal-browser action -- reload`, then
   `terminal-browser action done`.

Update both copies together. If the artifact write fails, say so and leave the local copy
ahead instead of hiding the gap.

## Writing good content

- **Titles** are short imperatives a teammate would recognize ("Copy every previous
  version"), not ticket names.
- **Summaries** say what changes, in one or two sentences.
- **`gate`** names exactly what is needed and from whom ("Security review of the new path").
- **`nextAction`** per lane is the single next thing that unblocks that lane.
- **Statuses** stay honest: `blocked` means a person must act; `waiting` means it's
  ready on its side and waiting on a dependency.
- Keep secrets, tokens and customer data out. The artifact can be shared.

## Changing the design

Edit `assets/template.html`, rebuild every live project, and republish each artifact
(passing its `artifactUrl` as `url`). Keep colors as the `:root` tokens and their dark
overrides, so both themes keep working.
