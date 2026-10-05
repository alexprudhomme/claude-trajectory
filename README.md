# claude-trajectory

A [Claude Code](https://claude.com/claude-code) skill that keeps a live trajectory page
for projects split across several PRs, repos or agent sessions.

The page is a git-style graph: each lane of work has its own rail, steps sit in the order
they can happen, and dependencies between lanes are drawn as forks and merges. Each step
shows its status, PR, issue, branch, the session working on it and what it waits for.

It is kept in two copies that always match:

- a **Claude artifact** you can share, which reads its status from the artifact database;
- a **local HTML file** with the status embedded, which opens anywhere with no login, for
  example in a [terminal-browser](https://github.com/zenbu-labs/terminal-browser) pane
  next to your agent.

The design is [Rosé Pine](https://rosepinetheme.com) Dawn (light) and Moon (dark), set
in IBM Plex.

## Install

```sh
git clone https://github.com/alexprudhomme/claude-trajectory ~/dev/claude-trajectory
ln -s ~/dev/claude-trajectory/trajectory ~/.claude/skills/trajectory
```

Projects are stored under `$TRAJECTORY_HOME` (default `~/dev/project-docs`), one folder
per project.

## Try the example

```sh
node trajectory/scripts/build.mjs trajectory/examples/lanes
open trajectory/examples/lanes/trajectory.html
```

## Layout

```
trajectory/
  SKILL.md                     what Claude follows
  assets/template.html         page + design system
  scripts/build.mjs            trajectory.json -> trajectory.html + artifact.html
  references/schema.md         the trajectory.json format
  examples/lanes/              a fake four-lane project
```

## Use from a coordinating session

Add something like this to your `~/.claude/CLAUDE.md`:

```markdown
# Project trajectory
The coordinating session owns a trajectory page for every multi-PR project and keeps both
copies (Claude artifact and local copy) updated whenever something changes. Use the
`trajectory` skill.
```

## License

MIT
