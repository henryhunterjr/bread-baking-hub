# Deployment Guide

## Pre-Deployment Checklist

### 1. Security & Compliance ✅
- [x] Fix all `/lovable-uploads/` violations (308 → 0)
- [x] Address Supabase security warnings
- [x] Verify HTTPS configuration
- [x] Check environment variables

### 2. Performance & Quality ✅
- [x] Run Lighthouse audit (target: 90+ score)
- [x] Verify Core Web Vitals metrics
- [x] Check bundle size optimization
- [x] Test image loading and lazy loading

### 3. Cross-Browser Testing ✅
- [x] Mobile navigation (iOS Safari, Android Chrome)
- [x] Recipe scaling controls across browsers
- [x] Image loading and fallbacks
- [x] PDF/print functionality

### 4. Monitoring Setup ✅
- [x] Error tracking configuration
- [x] Performance monitoring
- [x] Analytics setup
- [x] Health check endpoints

## Deployment Steps

### Step 1: Final Verification
```bash
# Run the release checklist
npm run build
npm run preview

# Access the release checklist page
# Navigate to: /release-checklist

# Verify all tabs show passing status:
# - Checklist ✅
# - Uploads ✅  
# - SEO ✅
# - Performance ✅
# - Accessibility ✅
# - Browser Testing ✅
# - Monitoring ✅
# - Deployment Readiness ✅
```

### Step 2: Production Build
```bash
# Clean build
rm -rf dist/
npm run build

# Verify build artifacts
ls -la dist/
```

### Step 3: Environment Configuration
```bash
# Set production environment variables
VITE_SUPABASE_URL="https://ojyckskucneljvuqzrsw.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Verify all required secrets are set in Supabase
```

### Step 4: Deploy to Production
```bash
# Deploy using Lovable's platform
# Click "Publish" button in Lovable interface

# Or manual deployment:
# Upload dist/ folder to hosting provider
# Configure CDN and SSL certificates
```

### Step 5: Post-Deployment Verification
```bash
# Health checks
curl -f https://yourdomain.com/
curl -f https://yourdomain.com/sitemap.xml
curl -f https://yourdomain.com/feed.xml

# Performance verification
lighthouse https://yourdomain.com --view

# Error monitoring check
# Verify error tracking service is receiving data
```

## Monitoring & Alerts

### Performance Alerts
- Page load time > 3 seconds
- Core Web Vitals degradation
- Bundle size increase > 20%

### Error Alerts
- JavaScript errors > 5/hour
- API failures > 10/hour
- 500 errors > 1/hour

### Security Alerts
- Failed authentication attempts > 100/hour
- SQL injection attempts
- Unusual traffic patterns

## Rollback Procedures

### Immediate Rollback (< 5 minutes)
```bash
# Revert to previous deployment
# In Lovable: Use version history to revert
# Manual: Replace current deployment with previous version

# Verify rollback
curl -f https://yourdomain.com/
```

### Database Rollback (if needed)
```bash
# Connect to Supabase
# Revert any schema changes made in this deployment
# Restore data from backup if necessary
```

### CDN Cache Invalidation
```bash
# Clear CDN cache to ensure old version is served
# Update DNS if needed for immediate traffic routing
```

## Environment-Specific Configurations

### Production
- All security warnings resolved
- HTTPS enforced
- Error tracking active
- Analytics enabled
- Performance monitoring active

### Staging
- Mirror production configuration
- Test data only
- Debug logging enabled

### Development
- Local Supabase instance or development project
- Hot reloading enabled
- Debug tools active

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Image Loading Issues
- Verify all `/lovable-uploads/` references are replaced
- Check Supabase Storage bucket permissions
- Test image URLs directly

#### Performance Degradation
- Run bundle analyzer: `npm run build:analyze`
- Check for large dependencies
- Verify lazy loading implementation

#### API Connection Issues
- Verify Supabase URL and keys
- Check network connectivity
- Review CORS configuration

## Support & Maintenance

### Regular Tasks
- Weekly performance audits
- Monthly security reviews
- Quarterly dependency updates

### Emergency Contacts
- Development Team: [contact info]
- Infrastructure Team: [contact info]
- Security Team: [contact info]

### Documentation
- [API Documentation](./API_DOCS.md)
- [Architecture Overview](./TECHNICAL_OVERVIEW.md)
- [Security Guide](./SECURITY.md)