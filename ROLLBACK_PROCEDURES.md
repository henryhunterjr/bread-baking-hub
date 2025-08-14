# Emergency Rollback Procedures

## Quick Reference

### Immediate Actions (Complete within 5 minutes)
1. **Assess Impact**: Determine scope of the issue
2. **Execute Rollback**: Revert to last known good state
3. **Verify Service**: Confirm application is functional
4. **Communicate**: Notify stakeholders

## Rollback Decision Matrix

| Issue Severity | Action | Timeline | Authorization Required |
|----------------|--------|----------|----------------------|
| **Critical** - Site down, data loss | Immediate rollback | < 2 minutes | Any team member |
| **High** - Major functionality broken | Fast rollback | < 5 minutes | Lead developer |
| **Medium** - Minor issues, degraded UX | Planned fix or rollback | < 30 minutes | Team consensus |
| **Low** - Cosmetic issues | Forward fix | Next deployment | Standard process |

## Rollback Procedures

### 1. Application Rollback (Frontend)

#### Via Lovable Platform
```bash
# 1. Access Lovable dashboard
# 2. Navigate to project deployment history
# 3. Click "Revert" on last stable version
# 4. Confirm revert action
# 5. Monitor deployment status
```

#### Manual Rollback
```bash
# 1. Retrieve previous deployment artifacts
aws s3 sync s3://backup-bucket/previous-build/ ./rollback-build/

# 2. Deploy previous version
rsync -av rollback-build/ /var/www/html/

# 3. Restart web server
sudo systemctl restart nginx
```

### 2. Database Rollback

#### Schema Changes
```sql
-- 1. Connect to Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Execute rollback migration

-- Example: Rollback table addition
DROP TABLE IF EXISTS new_table_name;

-- Example: Rollback column addition  
ALTER TABLE existing_table DROP COLUMN IF EXISTS new_column;

-- 4. Verify schema state
\dt -- List tables
\d table_name -- Describe table structure
```

#### Data Rollback
```bash
# 1. Stop application to prevent new writes
# 2. Restore from point-in-time backup
# 3. Verify data integrity
# 4. Restart application

# Supabase point-in-time recovery
# Access via Supabase dashboard > Database > Backups
# Select restore point and confirm
```

### 3. Environment Variables

#### Rollback Environment Configuration
```bash
# 1. Access environment management
# 2. Revert to previous variable set
# 3. Restart application services

# Example: Revert API endpoint
SUPABASE_URL="https://previous-project.supabase.co"
SUPABASE_ANON_KEY="previous_anon_key_value"
```

### 4. Third-Party Services

#### CDN Configuration
```bash
# 1. Access CDN dashboard
# 2. Revert cache rules and redirects
# 3. Purge cache to force fresh content

# Cloudflare example
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

#### DNS Changes
```bash
# 1. Access DNS provider dashboard
# 2. Revert A/CNAME records to previous values
# 3. Monitor DNS propagation (15-30 minutes)

# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com
```

## Verification Checklist

### Post-Rollback Verification (Complete within 10 minutes)

#### Application Health
- [ ] Homepage loads successfully
- [ ] User authentication works
- [ ] Database connections are stable
- [ ] API endpoints respond correctly
- [ ] Static assets load properly

#### Critical User Journeys
- [ ] Recipe search and viewing
- [ ] User registration/login
- [ ] Recipe creation and editing
- [ ] Image upload functionality
- [ ] PDF generation works

#### Performance Metrics
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] No console errors
- [ ] Core Web Vitals within thresholds

### Automated Health Checks
```bash
#!/bin/bash
# health-check.sh

echo "Running post-rollback health checks..."

# Check homepage
curl -f -s https://yourdomain.com/ > /dev/null
echo "✓ Homepage accessible"

# Check API health
curl -f -s https://yourdomain.com/api/health > /dev/null
echo "✓ API responding"

# Check database connection
curl -f -s https://yourdomain.com/api/db-health > /dev/null
echo "✓ Database connected"

echo "All health checks passed!"
```

## Communication Templates

### Internal Team Notification
```
SUBJECT: [URGENT] Production Rollback Executed

Team,

A rollback was executed on production at [TIME] due to [ISSUE].

Details:
- Issue: [Brief description]
- Rollback Version: [Previous version ID]
- Duration: [Time to complete rollback]
- Impact: [User impact assessment]

Current Status: [System operational/monitoring]

Next Steps:
1. [Immediate actions]
2. [Investigation plan]
3. [Timeline for fix]

Contact [NAME] for questions.
```

### User Communication
```
We experienced a brief technical issue and have restored service. 
All functionality is now normal. We apologize for any inconvenience.
```

## Prevention & Learning

### Post-Incident Review (Within 24 hours)

#### Required Documentation
1. **Timeline**: Exact sequence of events
2. **Root Cause**: Technical reason for the issue
3. **Impact Assessment**: User and business impact
4. **Response Evaluation**: What went well/poorly
5. **Action Items**: Preventive measures

#### Review Template
```markdown
# Post-Incident Review - [Date]

## Summary
Brief description of what happened

## Timeline
- [TIME]: Issue first detected
- [TIME]: Investigation started
- [TIME]: Rollback decision made
- [TIME]: Rollback completed
- [TIME]: Service restored

## Root Cause
Technical explanation of the problem

## Impact
- Users affected: [number/percentage]
- Duration: [time]
- Features impacted: [list]

## Response Analysis
### What Went Well
- [Positive aspects of response]

### What Could Improve
- [Areas for improvement]

## Action Items
- [ ] [Preventive measure 1] - Owner: [Name] - Due: [Date]
- [ ] [Preventive measure 2] - Owner: [Name] - Due: [Date]

## Lessons Learned
- [Key takeaways]
```

## Emergency Contacts

### On-Call Rotation
- **Primary**: [Name] - [Phone] - [Slack/Email]
- **Secondary**: [Name] - [Phone] - [Slack/Email]
- **Escalation**: [Manager] - [Phone] - [Slack/Email]

### External Vendors
- **Hosting Provider**: [Support contact]
- **CDN Provider**: [Support contact]
- **Database Provider**: [Supabase support]

### Communication Channels
- **Team Chat**: #incidents-production
- **Status Page**: [URL to status page]
- **User Notifications**: [Social media/email system]

## Regular Drills

### Monthly Rollback Testing
- Practice rollback procedures in staging
- Time the rollback process
- Update procedures based on learnings
- Train new team members

### Quarterly Disaster Recovery
- Full system recovery testing
- Database backup/restore verification
- Communication plan testing
- Update emergency contacts