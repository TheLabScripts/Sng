# Crawler Source Policy

Snagd crawls only sources where automated retrieval is authorized, public pages whose rules permit it, user-provided snapshots, and contracted provider APIs.

The crawler must not implement or use:

- credential or fake-account automation
- CAPTCHA bypass
- proxy rotation intended to evade controls
- browser fingerprint spoofing or ban evasion
- access to private or login-gated data without an authorized provider flow
- collection beyond the minimum listing data needed by Snagd

Every live source must have an owner, a documented permission basis, a conservative rate limit, an identifiable user agent, and a disable switch. Parser work should begin against saved HTML snapshots before any approved live request is enabled.

Facebook Marketplace remains snapshot/provider-only until a compliant, user-authorized, or contracted provider flow is connected. The third-party Playwright scraper reviewed during development is not included because it automates credentials, depends on brittle generated selectors, and warns that accounts may be banned.
