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
          // skip if your app needs X-Frame-Options for embed, etc.
        ],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
