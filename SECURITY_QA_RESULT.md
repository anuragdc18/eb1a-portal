# Security QA Result

## Summary

- Overall status: Needs Human Review before production launch.
- Highest-risk gaps: custom frontend-only authentication, local browser file storage, missing Supabase Row Level Security proof, and credentials previously shared in chat.
- Launch blockers: rotate exposed Supabase/Vercel credentials, migrate auth to Supabase Auth, move uploads/messages/reports to Supabase-backed tables/storage with RLS, and verify backups.

## Checklist Results

| Area | Status | Evidence | Required Fix |
| --- | --- | --- | --- |
| Databases and data | Needs Human Review | Supabase JSON tables exist, but backup/RLS/restore evidence is not in repo. | Enable RLS policies, add audit fields, test restore, document migrations. |
| Secrets and access | Fail | `.env` is ignored, but credentials were shared in chat during setup. | Rotate Supabase anon/service keys and Vercel token before real launch. |
| Authentication and authorization | Fail | `packages/web/src/web/lib/auth-context.tsx` is still prototype auth. | Replace with Supabase Auth, secure sessions, server-side role checks. |
| Admin panel and internal tools | Partial | Superadmin UI exists and `admin-access` is guarded in `packages/web/src/web/app.tsx`. | Store roles in DB, add audit logs, require MFA for admins. |
| User input and validation | Partial | Upload allowlist/size limits and report escaping are implemented in frontend. | Add server-side validation and storage policy enforcement. |
| Cost control | Needs Human Review | No paid API usage in current frontend. | Add provider budgets/alerts before WhatsApp/email/storage automation. |
| Deployment and environments | Partial | `vercel.json` adds security headers and HTTPS HSTS. | Add staging project and separate staging/prod Supabase projects. |
| Logging and observability | Fail | No Sentry/LogRocket/server log retention configured. | Add error tracking and redact secrets/PII. |
| Code and git hygiene | Partial | Changes are committed and build passes. | Run secret scan on git history and add human code review. |
| Legal and compliance | Fail | No privacy policy, terms, deletion/anonymization flow. | Add legal pages and data deletion workflow before collecting real client data. |
| Operational hygiene | Needs Human Review | No recovery runbook, monitoring, or shared access process in repo. | Add runbook, uptime monitor, backup owner, password manager process. |

## Detailed Findings

- Finding: Authentication is prototype-only.
- Risk: Anyone with browser access can inspect bundled code/local storage patterns; there are no server-side sessions or RLS-backed identity checks.
- Evidence: `packages/web/src/web/lib/auth-context.tsx`.
- Recommended fix: Supabase Auth with role claims or profile roles, RLS policies on every `portal_*` table, MFA for superadmin/admin.
- Owner: Engineering.
- Priority: Critical.

- Finding: Uploaded files are browser-local.
- Risk: Files are not permanent and are not protected by storage policies.
- Evidence: `packages/web/src/web/pages/documents.tsx`.
- Recommended fix: Supabase Storage bucket with MIME/size limits, signed URLs, virus scanning if handling sensitive documents.
- Owner: Engineering.
- Priority: High.

- Finding: Secrets were exposed during setup.
- Risk: Old keys/tokens may be usable by anyone who saw them.
- Evidence: setup conversation; `.env` is gitignored but chat exposure occurred.
- Recommended fix: rotate Supabase anon key, service role key, Vercel token, and any GitHub tokens before production.
- Owner: Founder/Admin.
- Priority: Critical.

- Finding: Production hardening added but must be verified in Vercel.
- Risk: headers/CORS help but do not replace backend authorization.
- Evidence: `vercel.json`, `packages/web/src/api/index.ts`.
- Recommended fix: verify deployed response headers and keep CSP updated as features grow.
- Owner: Engineering.
- Priority: Medium.
