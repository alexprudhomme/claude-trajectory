# trajectory.json

One file per project. Everything on the page comes from it; nothing else is edited by hand.

## Top level

| Field | Type | Notes |
|---|---|---|
| `name` | string | Page title. Short and specific ("Billing Service Split"). |
| `eyebrow` | string | Small label above the title, e.g. the team or epic bucket. |
| `goal` | string | One or two sentences: what "done" means. |
| `epic`, `epicUrl` | string | Tracking issue or epic, shown as a link. |
| `artifactUrl` | string | The Claude artifact URL, saved after the first publish. |
| `updatedAt` | ISO 8601 | Set on every update. |
| `nextAction` | string | Optional project-wide next action. |
| `lanes` | array | Optional. Omit for a single sequence of steps. |
| `phases` | array | Optional strip of before/during/after states. |
| `steps` | array | Required. |

## lanes[]

`{ "id": "web", "title": "web", "nextAction": "Finish porting the filter components." }`

One lane per line of work that can move independently: usually one per repo, child
session or team. Lanes are drawn left to right in this order and each gets its own color.

## phases[]

`{ "title": "Today", "current": true, "rows": [["Writes", "old-bucket"], ["Serves", "old-bucket"]] }`

Use it when the project moves a system through a few distinct states (a migration,
a cutover). Mark the state the system is in now with `current: true`.

## steps[]

| Field | Notes |
|---|---|
| `id` | Short, stable, unique. Referenced by `dependsOn`. |
| `lane` | A lane `id`. Steps without a known lane go in a default lane. |
| `title` | What happens, as a short imperative ("Point the CDN at the new bucket"). |
| `kind` | Free text: `PR`, `Release`, `Manual`, `Watch`, `Comms`… |
| `status` | `done`, `active`, `waiting`, `blocked` or `todo`. |
| `dependsOn` | Step ids, in any lane, that must finish first. |
| `summary` | One or two sentences on what the step changes. |
| `pr`, `prUrl` | e.g. `web#210` and its URL. |
| `jira`, `jiraUrl` | Or any issue tracker key and URL. |
| `repo`, `branch`, `base` | Where the work lives; `base` shows stacking. |
| `session` | The session doing the work, e.g. `ex-102 · w2` (agent name · workspace). |
| `gate` | A condition that isn't a step: an approval, access, a check. |
| `note` | Anything else worth one line. |

## How the graph is drawn

- Within a lane, steps run in array order; the rail between two steps is solid when the
  earlier one is done and dotted otherwise.
- Every step comes after its `dependsOn` and after the previous step in its lane.
- A `dependsOn` on a step in another lane draws a curve from that lane's rail into this
  one. That is how a lane forks off another, or merges back.
- Leave out a real cross-lane dependency and the graph looks more parallel than the work
  is, so model every one.

## Status meanings

- `done`: merged, released or finished.
- `active`: someone (or a session) is working on it now.
- `waiting`: ready on its own side, waiting on a dependency or gate.
- `blocked`: something is stopping it that needs a person to act.
- `todo`: not started and not yet unblocked.
