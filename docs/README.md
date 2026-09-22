# jPulse Docs / Installed Plugins / Hello AI Plugin v1.0.16

Hello AI is the scratch-pad sample that ships with `@jpulse-net/plugin-ai-core`. It is not a product. Copy the pattern into your site. Do not import these tools.

The site-facing contract is the [AI Core guide](/jpulse-docs/installed-plugins/ai-core/README). Framework orientation: [AI Agent](/jpulse-docs/ai-agent).

## First run

1. Install the bundle (`npx jpulse plugin install @jpulse-net/plugin-ai-core`) if it is not already present.
2. `ai-core`, `ai-mock`, and `hello-ai` all have `autoEnable: true`.
3. Open [`/hello-ai/`](/hello-ai/). No API key.

A 1.0.5 → later update that first adds this plugin will enable it. Disable **Hello AI** under Admin → Plugins if you do not want the demo. AI stays on.

## What the page shows

`/hello-ai/` is a scratch pad. Nothing on this page saves it, and a reload restores the text in the HTML. User-facing copy uses that one name, not draft or summary. A `read_draft` call returns that text, capped at 32 KB, as the tool result so the model can use it.

Two more pages sit beside it, each its own document: [Code Examples](/hello-ai/code-examples.shtml) (the view adapter, the controller hooks, and the pure modules) and [Architecture](/hello-ai/architecture.shtml) (how a read, a proposal, an append, and the server clock move between the panel and the textarea). Opening either one in this tab leaves the scratch pad page.

| Tool | Host | Path |
|---|---|---|
| `read_draft` | client | module `readDraft` |
| `propose_draft_rewrite` | client | module `proposeRewrite`, `proposes: true`, 3 proposals per turn |
| `append_draft` | client | `adapter.executeTool`, `mutates: true`, 3 writes per turn |
| `get_hello_clock` | server | `onAiToolExecute` |

`append_draft` writes immediately. There is no Apply card; the undo is the textarea in front of you. `propose_draft_rewrite` is the other shape: it is a pure module, it writes nothing, and Apply / Undo sit on the card. Undo is hidden after a reload — the snapshot lives in this tab only.

Those tools register only when `scopeType` is `hello-ai`. Installing the bundle does not force a WebSocket on every other page.

`/help` lists clickable examples that fill the compose box. `/pad` prints the pad size; `/padreset` (hidden) restores the demo text. A character count sits below the compose box. There is no context row — this page omits `adapter.contextOptions()` on purpose.

Drop a text file or paste an image on the panel to try sources and vision (Mock Vision names the image it was handed; Mock Echo stays grey).

For `curl`, prefix `[mock:tool:<name>:<jsonArgs>]`. JSON arrays cannot be typed in the bracket form (`]` ends the marker); objects and scalars are fine. The structured `script` field is still accepted on a turn if a site wants to drive tools without the model choosing them.

## Disable

Admin → Plugins → disable **hello-ai**. The scratch pad, Code Examples, Architecture, the site-hello-demos menu entry, the dashboard card, and the two tool modules disappear. `ai-core` still serves the panel, attachments, propose/apply, and `sources`.

## Copy the pattern

Look at `webapp/controller/helloAi.js`, `webapp/view/hello-ai/index.shtml`, and `webapp/utils/ai-tools/`. A site writes the same shapes under `site/webapp/`, not by depending on this plugin's modules.

## Plugin releases

- **1.0.16**, W-248, 2026-09-22: Scratch Pad, Code Examples, and Architecture are three pages. Code Examples shows the view adapter, the controller hooks, and the pure modules. Architecture follows a read, a proposal, an append, and the server clock. The guide says the pad is not saved, and that a read returns the text in the tool result. Disable hides all three pages.
- **1.0.15**, W-247, 2026-09-21: Version lockstep with `ai-core` 1.0.15. `adapter.canUndoProposal` hides Undo when this tab has no snapshot (reload / other tab). No attach, no mobile, no title setter, no `resetOnTitleDblclick`.
- **1.0.14**, W-245, 2026-09-20: Version lockstep with `ai-core` 1.0.14. No product change — no attach, no mobile, no title setter, no `resetOnTitleDblclick`.
- **1.0.13**, W-241, 2026-09-19: Version lockstep with `ai-core` 1.0.13. No product change — no attach, no mobile, no title setter, no `resetOnTitleDblclick`.
- **1.0.12**, W-239, 2026-09-19: Version lockstep with `ai-core` 1.0.12. No product change — no attach, no mobile, no title setter.
- **1.0.11**, W-238, 2026-09-19: Version lockstep with `ai-core` 1.0.11. No product change — no attach, no mobile, no title setter.
- **1.0.10**, W-237, 2026-09-19: Version lockstep with `ai-core` 1.0.10. No product change — no attach, no mobile, no title setter.
- **1.0.9**, W-234, 2026-09-19: Version lockstep with `ai-core` 1.0.9. No product change — image chips stay on Send in the panel.
- **1.0.8**, W-233, 2026-09-19: Version lockstep with `ai-core` 1.0.8. No product change.
- **1.0.7**, W-232, 2026-09-18: Version lockstep with `ai-core` 1.0.7. No product change.
- **1.0.6**, W-231, 2026-09-17: First release as a bundled companion. Same scratch pad as 1.0.5-in-core (regions, `/pad`, attachments).
