# jPulse Framework / Plugins / Hello AI Plugin v1.0.13

Scratch-pad sample for the AI agent. Not a product. Copy the pattern into your site; do not import these tools.

Requires jPulse Framework >= 2.0.5. Depends on `ai-core` (same package, `@jpulse-net/plugin-ai-core`).

`autoEnable` is true. Same `npmPackage` as the primary (`@jpulse-net/plugin-ai-core`). No `webapp/bump-version.conf`. Its `package.json` is a publish guard only — `npm publish` here fails and names `ai-core`, and staging strips the file, so the published bundle has no `plugins/hello-ai/package.json`.

Install the bundle, then open `/hello-ai/`. No API key. `ai-mock` answers. Disable this plugin under Admin → Plugins to hide the page, its site-menu entry, and its dashboard card. Turns, quota, and the panel stay.

See [docs/README.md](docs/README.md). The site-facing contract is the [AI Core guide](/jpulse-docs/installed-plugins/ai-core/README).

Do not publish this directory. Publish the bundle from `plugins/ai-core`.

## Tests

Unit tests live in `webapp/tests/unit/` and use the framework Jest config.

From **this directory**:

```bash
npm test
```

Or from the **framework repo root** or from `plugins/ai-core`:

```bash
npx jest plugins/hello-ai/webapp/tests/unit --runInBand
```

## Plugin releases

- **1.0.13**, W-241, 2026-09-19: Version lockstep with `ai-core` 1.0.13. No product change — no attach, no mobile, no title setter, no `resetOnTitleDblclick`.
- **1.0.12**, W-239, 2026-09-19: Version lockstep with `ai-core` 1.0.12. No product change — no attach, no mobile, no title setter.
- **1.0.11**, W-238, 2026-09-19: Version lockstep with `ai-core` 1.0.11. No product change — no attach, no mobile, no title setter.
- **1.0.10**, W-237, 2026-09-19: Version lockstep with `ai-core` 1.0.10. No product change — no attach, no mobile, no title setter.
- **1.0.9**, W-234, 2026-09-19: Version lockstep with `ai-core` 1.0.9. No product change — image chips stay on Send in the panel.
- **1.0.8**, W-233, 2026-09-19: Version lockstep with `ai-core` 1.0.8. No product change.
- **1.0.7**, W-232, 2026-09-18: Version lockstep with `ai-core` 1.0.7. No product change.
- **1.0.6**, W-231, 2026-09-17: First release as a bundled companion. Same scratch pad as 1.0.5-in-core (regions, `/pad`, attachments).
