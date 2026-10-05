// Builds a project's trajectory pages from <project>/trajectory.json and the shared template.
//   node <skill-dir>/scripts/build.mjs <project-dir>
// Writes:
//   <project-dir>/trajectory.html  local copy with the status embedded (open in terminal-browser, no login)
//   <project-dir>/artifact.html    page to publish as the Claude artifact (reads doc trajectory/status)
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectDir = resolve(process.argv[2] ?? '.');
const here = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(here, '..', 'assets', 'template.html'), 'utf8');
const status = JSON.parse(readFileSync(join(projectDir, 'trajectory.json'), 'utf8'));

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const page = template.replaceAll('{{TITLE}}', escapeHtml(status.name ?? 'Project trajectory'));

writeFileSync(join(projectDir, 'artifact.html'), page);

const embedded = `<script>window.__TRAJECTORY__ = ${JSON.stringify(status).replaceAll('</', '<\\/')};</script>\n`;
writeFileSync(
  join(projectDir, 'trajectory.html'),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${embedded}${page}</body></html>\n`
);

console.log(`Built ${join(projectDir, 'trajectory.html')} and artifact.html`);
