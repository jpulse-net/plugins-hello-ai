/*
 * @name            jPulse Framework / Plugins / Hello AI / WebApp / View / jPulse Navigation
 * @tagline         Site hello-demo navigation for Hello AI
 * @description     Appends Hello AI to site hello demos
 * @file            plugins/hello-ai/webapp/view/jpulse-navigation.js
 * @version         1.0.6
 * @release         2026-09-17
 * @repository      https://github.com/jpulse-net/plugin-hello-ai
 * @author          Peter Thoeny, https://twiki.org & https://github.com/peterthoeny/
 * @copyright       2026 Peter Thoeny, https://twiki.org & https://github.com/peterthoeny/
 * @license         BSL 1.1 -- see LICENSE file; for commercial use: team@jpulse.net
 * @genai           80%, Cursor 3.20, Grok 4.6
 */

if (window.jPulseNavigation?.site?.siteHelloExamples?.pages) {
    window.jPulseNavigation.site.siteHelloExamples.pages.helloAi = {
        label: 'Hello AI',
        url: '/hello-ai/',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>'
    };
}

// EOF plugins/hello-ai/webapp/view/jpulse-navigation.js
