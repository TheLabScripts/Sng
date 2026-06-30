# Snagd Admin Architecture Plan

Admin is intentionally separate from the normal user app. Prefer `admin.yourdomain.com` later, or keep `/admin` only when protected by server-side authorization and an access layer.

Planned panels: users, subscriptions, deal checks usage, creator codes, referrals, payouts, reported listings, API usage/costs, system health, feature flags, support tools, and audit logs.

Security requirements:
- Require MFA for production admin access.
- Use role-based access control.
- Authorize every admin API action on the server.
- Audit log every admin change.
- Never trust frontend-only admin flags.
- Never expose secret keys to the frontend.
- Rate limit sensitive endpoints.
- Separate production and staging environments.
- Use Cloudflare Access or equivalent in front of admin.
- Maintain a backup owner account recovery plan.
