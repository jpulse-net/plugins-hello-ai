/**
 * @name            jPulse Framework / Plugins / Hello AI / WebApp / Tests / Unit / Hello AI
 * @tagline         Isolation, modules, propose, adapter scan
 * @file            plugins/hello-ai/webapp/tests/unit/hello-ai.test.js
 * @version         1.0.6
 * @release         2026-09-17
 * @repository      https://github.com/jpulse-net/plugin-hello-ai
 * @author          Peter Thoeny, https://twiki.org & https://github.com/peterthoeny/
 * @copyright       2026 Peter Thoeny, https://twiki.org & https://github.com/peterthoeny/
 * @license         BSL 1.1 -- see LICENSE file; for commercial use: team@jpulse.net
 * @genai           80%, Cursor 3.20, Grok 4.6
 */

import { afterEach, describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import HelloAiController from '../../controller/helloAi.js';
import { run as runReadDraft } from '../../utils/ai-tools/readDraft.js';
import { run as runProposeRewrite } from '../../utils/ai-tools/proposeRewrite.js';
import { chooseTransport } from '../../../../ai-core/webapp/utils/transport/index.js';
import {
    applyThenRecord,
    undoThenRecord
} from '../../../../ai-core/webapp/utils/proposals/index.js';
import {
    clearTools,
    defaultRoots,
    discoverToolModules,
    resetModuleCatalog,
    scanToolModules
} from '../../../../ai-core/webapp/utils/tools/index.js';
import { testActor } from '../../../../ai-core/webapp/tests/unit/helpers.js';

afterEach(() => {
    clearTools();
    resetModuleCatalog();
});

describe('hello-ai isolation', () => {
    test('demo tools are not registered for another scope', async () => {
        const ctx = { tools: [], actor: testActor({ scopeType: 'doc' }) };
        await HelloAiController.onAiToolRegister(ctx);
        expect(ctx.tools).toEqual([]);
        expect(chooseTransport(ctx.tools)).toBe('http');
    });

    test('demo tools register only for hello-ai', async () => {
        const ctx = { tools: [], actor: testActor({ scopeType: 'hello-ai' }) };
        await HelloAiController.onAiToolRegister(ctx);
        expect(ctx.tools.map(tool => tool.name)).toEqual([
            'read_draft',
            'propose_draft_rewrite',
            'append_draft',
            'get_hello_clock'
        ]);
        expect(chooseTransport(ctx.tools)).toBe('ws');
    });
});

describe('hello-ai modules', () => {
    test('readDraft runs in Node against fixture data', () => {
        const result = runReadDraft({
            text: 'one two three four',
            selection: 'two'
        }, {});
        expect(result.ok).toBe(true);
        expect(result.data.words).toBe(4);
        expect(result.data.selection).toBe('two');
        expect(result.data.text).toBe('one two three four');
        expect(result.data.truncated).toBe(false);
        const long = 'x'.repeat(200);
        const clipped = runReadDraft({ text: long }, {});
        expect(clipped.data.excerpt.endsWith('…')).toBe(true);
        expect(clipped.data.excerpt.length).toBeLessThan(long.length);
        expect(clipped.data.text).toBe(long);
        expect(clipped.data.truncated).toBe(false);
    });

    test('scanner covers hello-ai ai-tools and not ai-core', () => {
        const helloDir = path.resolve(process.cwd(), 'plugins/hello-ai/webapp/utils/ai-tools');
        const coreDir = path.resolve(process.cwd(), 'plugins/ai-core/webapp/utils/ai-tools');
        const hello = scanToolModules({ roots: [helloDir] });
        const core = scanToolModules({ roots: [coreDir] });
        expect(hello.map(row => row.name)).toEqual(expect.arrayContaining(['readDraft', 'proposeRewrite']));
        expect(hello.find(row => row.name === 'readDraft').ok).toBe(true);
        expect(hello.find(row => row.name === 'proposeRewrite').ok).toBe(true);
        expect(core.map(row => row.name)).toContain('sources');
        expect(core.map(row => row.name)).not.toContain('readDraft');
        expect(core.map(row => row.name)).not.toContain('proposeRewrite');
    });

    test('defaultRoots omits demo modules when hello-ai is not active', () => {
        const roots = defaultRoots({
            projectRoot: process.cwd(),
            plugins: [{ path: path.resolve(process.cwd(), 'plugins/ai-core') }]
        });
        expect(roots.some(dir => dir.includes(`${path.sep}hello-ai${path.sep}`))).toBe(false);
        const scanned = scanToolModules({ roots });
        expect(scanned.map(row => row.name)).not.toContain('readDraft');
        expect(scanned.map(row => row.name)).not.toContain('proposeRewrite');
        expect(scanned.map(row => row.name)).toContain('sources');
    });

    test('defaultRoots lists demo modules when hello-ai is active', () => {
        const roots = defaultRoots({
            projectRoot: process.cwd(),
            plugins: [
                { path: path.resolve(process.cwd(), 'plugins/ai-core') },
                { path: path.resolve(process.cwd(), 'plugins/hello-ai') }
            ]
        });
        expect(roots.some(dir => dir.includes(`${path.sep}hello-ai${path.sep}`))).toBe(true);
        discoverToolModules({ roots });
        const scanned = scanToolModules({ roots });
        expect(scanned.map(row => row.name)).toEqual(expect.arrayContaining([
            'sources',
            'readDraft',
            'proposeRewrite'
        ]));
    });
});

describe('hello-ai propose module', () => {
    test('proposeRewrite is pure and returns a proposal payload', () => {
        const result = runProposeRewrite({ text: 'Old pad' }, { text: 'New pad' });
        expect(result.ok).toBe(true);
        expect(result.data.proposal.kind).toBe('rewrite');
        expect(result.data.proposal.payload.text).toBe('New pad');
        expect(result.data.proposal.payload.expectedChars).toBe(7);
        expect(runProposeRewrite({ text: 'Old' }, { text: '' }).ok).toBe(false);
    });

    test('hello-ai apply/undo round trip against a stub pad', async () => {
        const pad = { value: 'Old' };
        const stash = {};
        const adapter = {
            applyProposal(proposal) {
                stash[proposal.id] = pad.value;
                pad.value = proposal.payload.text;
                return true;
            },
            undoProposal(proposal) {
                if (stash[proposal.id] == null) {
                    return false;
                }
                pad.value = stash[proposal.id];
                return true;
            }
        };
        const proposal = { id: 'p1', payload: { text: 'New' } };
        const applied = await applyThenRecord({
            proposal,
            apply: (row) => adapter.applyProposal(row),
            record: () => true
        });
        expect(applied.ok).toBe(true);
        expect(pad.value).toBe('New');
        const undone = await undoThenRecord({
            proposal,
            undo: (row) => adapter.undoProposal(row),
            record: () => true
        });
        expect(undone.ok).toBe(true);
        expect(pad.value).toBe('Old');
    });

    test('demo registers the proposing tool only for hello-ai', async () => {
        const other = { tools: [], actor: testActor({ scopeType: 'doc' }) };
        await HelloAiController.onAiToolRegister(other);
        expect(other.tools.map(tool => tool.name)).not.toContain('propose_draft_rewrite');
        const hello = { tools: [], actor: testActor({ scopeType: 'hello-ai' }) };
        await HelloAiController.onAiToolRegister(hello);
        const propose = hello.tools.find(tool => tool.name === 'propose_draft_rewrite');
        expect(propose.proposes).toBe(true);
        expect(propose.module).toBe('proposeRewrite');
        expect(propose.mutates).toBeFalsy();
    });
});

describe('adapter contract scan', () => {
    test('demo view does not reach into site state and has no describeScope', () => {
        const file = path.resolve(process.cwd(), 'plugins/hello-ai/webapp/view/hello-ai/index.shtml');
        const text = fs.readFileSync(file, 'utf8');
        expect(text).not.toMatch(/site\/webapp/);
        expect(text).not.toMatch(/bubblemap/);
        expect(text).not.toMatch(/synapse/);
        expect(text).not.toMatch(/describeScope/);
    });

    test('site menu entry lives on hello-ai, not ai-core', () => {
        const helloNav = fs.readFileSync(
            path.resolve(process.cwd(), 'plugins/hello-ai/webapp/view/jpulse-navigation.js'),
            'utf8'
        );
        const coreNav = fs.readFileSync(
            path.resolve(process.cwd(), 'plugins/ai-core/webapp/view/jpulse-navigation.js'),
            'utf8'
        );
        expect(helloNav).toMatch(/\/hello-ai\//);
        expect(coreNav).not.toMatch(/\/hello-ai\//);
    });
});

// EOF plugins/hello-ai/webapp/tests/unit/hello-ai.test.js
