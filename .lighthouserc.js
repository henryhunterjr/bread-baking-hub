module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: null,
      url: [
        `${process.env.LHCI_BASE_URL || 'http://localhost:4173'}/`,
        `${process.env.LHCI_BASE_URL || 'http://localhost:4173'}/recipes`,
        `${process.env.LHCI_BASE_URL || 'http://localhost:4173'}/tools`,
        `${process.env.LHCI_BASE_URL || 'http://localhost:4173'}/blog`,
      ],
      settings: {
        preset: 'desktop',
        emulatedFormFactor: 'desktop',
        throttlingMethod: 'devtools',
        skipAudits: [
          'unsized-images', // We use responsive images with proper sizing
          'uses-http2', // Vercel handles this automatically
        ],
        onlyAudits: [
          // Performance audits
          'first-contentful-paint',
          'largest-contentful-paint',
          'speed-index',
          'cumulative-layout-shift',
          'total-blocking-time',
          
          // Accessibility audits
          'color-contrast',
          'heading-order',
          'image-alt',
          'label',
          'link-name',
          'button-name',
          'aria-allowed-attr',
          'aria-hidden-body',
          'aria-valid-attr-value',
          'aria-valid-attr',
          'bypass',
          'document-title',
          'duplicate-id-aria',
          'focus-traps',
          'focusable-controls',
          'interactive-element-affordance',
          'logical-tab-order',
          'managed-focus',
          'use-landmarks',
          
          // SEO audits
          'document-title',
          'meta-description',
          'http-status-code',
          'link-text',
          'crawlable-anchors',
          'is-crawlable',
          'robots-txt',
          'hreflang',
          'canonical',
          
          // Best practices
          'is-on-https',
          'uses-https',
          'no-vulnerable-libraries',
          'external-anchors-use-rel-noopener',
          'geolocation-on-start',
          'notification-on-start',
        ],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.92 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.92 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        // Specific performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 4200 }],
        'total-blocking-time': ['error', { maxNumericValue: 600 }],
        // Accessibility requirements
        'color-contrast': 'error',
        'image-alt': 'error',
        'heading-order': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
