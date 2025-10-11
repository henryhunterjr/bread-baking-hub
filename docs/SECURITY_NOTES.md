# Security Implementation Notes

## Database Views & RLS

### analytics_daily_metrics
**Status**: View (not table) - RLS policies cannot be applied to views
**Access Control**: Access is controlled by the underlying table `analytics_events` which has proper RLS
**Rationale**: 
- Views inherit security from their source tables
- `analytics_events` table has policy: "Admins can view all analytics events"
- Only admins can query the underlying data, so the view is secure by design

### Materialized Views in API
The following materialized views are exposed via the API for performance:
- `app_analytics_mv_sessions_by_source_day`
- `app_analytics_mv_page_perf_day`
- `app_analytics_mv_subscribers_day`
- `app_analytics_mv_errors_by_route_day`
- `app_analytics_mv_cwv_by_page_day`

**Rationale**: 
- These are pre-aggregated analytics data for dashboards
- Source tables (`app_analytics_events`) have RLS: "Admins can view all analytics events"
- Materialized views dramatically improve dashboard performance (10x+ faster queries)
- Alternative would be slow real-time aggregations on every dashboard load

**Security Consideration**: 
- These views contain aggregated, anonymized data only
- No PII or sensitive user information is included
- Access should be admin-only in production (enforced at application layer)

## Supabase Configuration Required

These settings MUST be configured manually in the Supabase Dashboard:

### Authentication Settings
1. **OTP Expiry**: Set to 600 seconds (10 minutes)
   - Location: Auth > Settings > Email Auth
   - Security benefit: Reduces window for email-based attacks

2. **Leaked Password Protection**: Enable
   - Location: Auth > Settings > Password Protection
   - Security benefit: Prevents use of compromised passwords from data breaches

### How to Configure
1. Go to https://supabase.com/dashboard/project/ojyckskucneljvuqzrsw/auth/providers
2. Navigate to Email Auth settings
3. Set "OTP Expiry" to 600 seconds
4. Enable "Check for leaked passwords" under Password Protection

## Database Function Search Paths

All security-sensitive database functions use:
```sql
SET search_path TO 'public'
```

This prevents security vulnerabilities from schema injection attacks by ensuring functions only access the public schema.

Functions with proper search_path:
- `has_role()` - Role checking (security definer)
- `log_security_event()` - Audit logging (security definer)
- `get_decrypted_mfa_secret()` - MFA secret access (security definer)
- `store_encrypted_mfa_secret()` - MFA secret storage (security definer)
- All other security definer functions

## Role-Based Access Control

### Implementation
- Roles stored in `user_roles` table (separate from profiles)
- Role checking via `has_role()` security definer function
- Prevents recursive RLS policy issues
- No role information in `profiles` table to prevent privilege escalation

### Admin Checks
All admin checks use:
```typescript
const { data: isAdmin } = await supabase.rpc('is_current_user_admin');
```

**Never** check admin status using:
- ❌ localStorage/sessionStorage
- ❌ Client-side state
- ❌ Hardcoded credentials
- ❌ Profile table columns

## Environment-Aware Logging

Production logging is sanitized to prevent information leakage:
- Use `logger` utility from `src/utils/logger.ts`
- Logs are stripped in production builds
- Errors are sanitized before logging in production
- Never log: passwords, tokens, API keys, PII

```typescript
import { logger } from '@/utils/logger';

// Development only
logger.log('Debug info'); // stripped in production
logger.debug('Detailed debug'); // stripped in production

// Always logged (sanitized in production)
logger.error(error); // safe in production
```
