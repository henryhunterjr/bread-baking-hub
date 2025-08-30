import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://bread-baking-hub.vercel.app';
const REQUIRED_TAGS = ['og:title', 'og:image', 'og:url', 'og:description'];
const FORBIDDEN_DOMAINS = ['the-bakers-bench.lovable.app', 'localhost', '127.0.0.1'];

class MetaVerifier {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.results = [];
  }

  extractMetaTags(htmlContent) {
    const tags = {};
    
    // Extract Open Graph tags
    const ogRegex = /<meta\s+property="og:([^"]+)"\s+content="([^"]+)"/g;
    let match;
    while ((match = ogRegex.exec(htmlContent)) !== null) {
      tags[`og:${match[1]}`] = match[2];
    }
    
    // Extract Twitter tags
    const twitterRegex = /<meta\s+name="twitter:([^"]+)"\s+content="([^"]+)"/g;
    while ((match = twitterRegex.exec(htmlContent)) !== null) {
      tags[`twitter:${match[1]}`] = match[2];
    }
    
    // Extract basic meta tags
    const metaRegex = /<meta\s+name="([^"]+)"\s+content="([^"]+)"/g;
    while ((match = metaRegex.exec(htmlContent)) !== null) {
      tags[match[1]] = match[2];
    }
    
    return tags;
  }

  validateTags(route, tags) {
    const routeErrors = [];
    const routeWarnings = [];
    
    // Check required tags
    REQUIRED_TAGS.forEach(requiredTag => {
      if (!tags[requiredTag]) {
        routeErrors.push(`Missing required tag: ${requiredTag}`);
      }
    });
    
    // Check for forbidden domains
    Object.entries(tags).forEach(([tag, value]) => {
      if (tag.includes('image') || tag.includes('url')) {
        FORBIDDEN_DOMAINS.forEach(domain => {
          if (value && value.includes(domain)) {
            routeErrors.push(`Forbidden domain "${domain}" found in ${tag}: ${value}`);
          }
        });
        
        // Check for relative URLs in image/url tags
        if (value && !value.startsWith('http') && !value.startsWith('//')) {
          routeErrors.push(`Relative URL in ${tag}: ${value} (must be absolute)`);
        }
      }
    });
    
    // Check for missing image dimensions (warning only)
    if (tags['og:image'] && !tags['og:image:width']) {
      routeWarnings.push('Missing og:image:width (recommended: 1200)');
    }
    if (tags['og:image'] && !tags['og:image:height']) {
      routeWarnings.push('Missing og:image:height (recommended: 630)');
    }
    
    return { errors: routeErrors, warnings: routeWarnings };
  }

  verifyRoute(route, htmlPath) {
    console.log(`🔍 Verifying ${route}...`);
    
    if (!fs.existsSync(htmlPath)) {
      this.errors.push(`HTML file not found: ${htmlPath}`);
      return;
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const tags = this.extractMetaTags(htmlContent);
    const validation = this.validateTags(route, tags);
    
    // Store result
    this.results.push({
      route,
      tags,
      errors: validation.errors,
      warnings: validation.warnings
    });
    
    // Add to global arrays
    this.errors.push(...validation.errors.map(err => `${route}: ${err}`));
    this.warnings.push(...validation.warnings.map(warn => `${route}: ${warn}`));
    
    console.log(`  ${validation.errors.length === 0 ? '✅' : '❌'} ${route}`);
    if (validation.errors.length > 0) {
      validation.errors.forEach(err => console.log(`    ❌ ${err}`));
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warn => console.log(`    ⚠️  ${warn}`));
    }
  }

  printSummaryReport() {
    console.log('\n📊 META TAG VERIFICATION REPORT');
    console.log('================================');
    
    // Results table
    console.log('\nRoute Summary:');
    console.log(''.padEnd(50, '-'));
    console.log('Route'.padEnd(25) + 'OG Image'.padEnd(25) + 'Status');
    console.log(''.padEnd(50, '-'));
    
    this.results.forEach(result => {
      const route = result.route.padEnd(24);
      const image = (result.tags['og:image'] || 'MISSING').slice(-24).padEnd(24);
      const status = result.errors.length === 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`${route} ${image} ${status}`);
    });
    
    console.log('\n📈 Statistics:');
    console.log(`Total routes checked: ${this.results.length}`);
    console.log(`Routes with errors: ${this.results.filter(r => r.errors.length > 0).length}`);
    console.log(`Routes with warnings: ${this.results.filter(r => r.warnings.length > 0).length}`);
    console.log(`Total errors: ${this.errors.length}`);
    console.log(`Total warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
  }

  async run() {
    console.log('🚀 Starting meta tag verification...\n');
    
    const distPath = path.join(__dirname, '..', 'dist');
    
    if (!fs.existsSync(distPath)) {
      console.error('❌ dist folder not found. Run "npm run build" first.');
      process.exit(1);
    }
    
    // Routes to verify
    const routes = [
      { route: '/', path: path.join(distPath, 'index.html') },
      { route: '/blog', path: path.join(distPath, 'blog', 'index.html') },
      { route: '/recipes', path: path.join(distPath, 'recipes', 'index.html') },
      { route: '/recipe-workspace', path: path.join(distPath, 'recipe-workspace', 'index.html') },
      { route: '/troubleshooting', path: path.join(distPath, 'troubleshooting', 'index.html') },
      { route: '/glossary', path: path.join(distPath, 'glossary', 'index.html') },
      { route: '/library', path: path.join(distPath, 'library', 'index.html') },
      { route: '/vitale-starter', path: path.join(distPath, 'vitale-starter', 'index.html') }
    ];
    
    // Verify each route
    routes.forEach(({ route, path: htmlPath }) => {
      this.verifyRoute(route, htmlPath);
    });
    
    // Print summary
    this.printSummaryReport();
    
    // Exit with error code if there are errors
    if (this.errors.length > 0) {
      console.log('\n💥 Verification failed! Fix the errors above before deploying.');
      process.exit(1);
    } else {
      console.log('\n🎉 All meta tags verified successfully!');
      process.exit(0);
    }
  }
}

// Run verification
const verifier = new MetaVerifier();
verifier.run().catch(error => {
  console.error('💥 Verification script crashed:', error);
  process.exit(1);
});