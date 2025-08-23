// Centralized help content data for different pages and features

export const contextualHelpTips = {
  'recipe-workspace': [
    {
      id: 'workspace-upload',
      title: 'Multiple Upload Methods',
      content: 'You can upload recipes via text, photos, or voice input. Each method uses AI to format your recipe automatically.',
      type: 'tip' as const,
      learnMoreLink: '/help#recipe-upload'
    },
    {
      id: 'workspace-editing',
      title: 'Edit Mode Features',
      content: 'Click "Edit" to manually adjust ingredients, instructions, and add photos. All changes are saved automatically.',
      type: 'info' as const,
      learnMoreLink: '/help#recipe-editing'
    },
    {
      id: 'workspace-voice',
      title: 'Voice Input Tips',
      content: 'Speak clearly and pause between ingredients. Say "new line" or "next step" to separate instructions.',
      type: 'tip' as const,
      learnMoreLink: '/help#voice-input'
    }
  ],

  'troubleshooting': [
    {
      id: 'troubleshooting-text',
      title: 'Recipe Text Analysis',
      content: 'Paste your complete recipe text for best results. Include ingredients with measurements and all instructions.',
      type: 'tip' as const,
      learnMoreLink: '/help#recipe-analysis'
    },
    {
      id: 'troubleshooting-results',
      title: 'Understanding Results',
      content: 'Green means good, yellow indicates potential issues, red highlights problems that need attention.',
      type: 'info' as const,
      learnMoreLink: '/help#interpreting-results'
    },
    {
      id: 'troubleshooting-history',
      title: 'Track Your Progress',
      content: 'Your scan history helps you monitor improvements over time and compare different recipes.',
      type: 'tip' as const,
      learnMoreLink: '/help#scan-history'
    }
  ],

  'crust-and-crumb': [
    {
      id: 'photo-quality',
      title: 'Photo Requirements',
      content: 'Use good lighting and show clear cross-sections of your bread. Multiple angles provide better analysis.',
      type: 'warning' as const,
      learnMoreLink: '/help#photo-tips'
    },
    {
      id: 'analysis-process',
      title: 'AI Analysis Process',
      content: 'Our AI examines crust color, crumb structure, holes, and texture to identify specific baking issues.',
      type: 'info' as const,
      learnMoreLink: '/help#diagnostic-process'
    },
    {
      id: 'implementing-solutions',
      title: 'Apply Recommendations',
      content: 'Start with the highest priority issues first. Small adjustments often yield the biggest improvements.',
      type: 'tip' as const,
      learnMoreLink: '/help#solutions'
    }
  ],

  'books': [
    {
      id: 'book-previews',
      title: 'Preview Content',
      content: 'Click "Preview" to read sample chapters and listen to audio excerpts before purchasing.',
      type: 'tip' as const,
      learnMoreLink: '/help#book-previews'
    },
    {
      id: 'purchase-options',
      title: 'Digital vs Physical',
      content: 'Digital books include searchable text and audio features. Physical books offer hands-on reference.',
      type: 'info' as const,
      learnMoreLink: '/help#purchase-options'
    }
  ],

  'blog': [
    {
      id: 'blog-filters',
      title: 'Filter Content',
      content: 'Use categories and tags to find specific topics. Save articles for quick reference later.',
      type: 'tip' as const,
      learnMoreLink: '/help#blog-navigation'
    },
    {
      id: 'blog-search',
      title: 'Search Tips',
      content: 'Search works across all content. Try specific techniques like "autolyse" or problems like "dense bread".',
      type: 'info' as const,
      learnMoreLink: '/help#search-system'
    }
  ],

  'bread-calculator': [
    {
      id: 'bakers-percentages',
      title: 'Baker\'s Percentages',
      content: 'This professional method uses flour weight as 100% and calculates all other ingredients as percentages.',
      type: 'info' as const,
      learnMoreLink: '/help#bakers-percentages'
    },
    {
      id: 'scaling-recipes',
      title: 'Scale Any Recipe',
      content: 'Enter your target flour weight to automatically scale all ingredients proportionally.',
      type: 'tip' as const,
      learnMoreLink: '/help#scaling-recipes'
    }
  ],

  'my-recipes': [
    {
      id: 'recipe-organization',
      title: 'Organize Your Collection',
      content: 'Use tags, ratings, and notes to organize recipes. Star your favorites for quick access.',
      type: 'tip' as const,
      learnMoreLink: '/help#recipe-organization'
    },
    {
      id: 'recipe-sharing',
      title: 'Share with Community',
      content: 'Make recipes public to share with other bakers. Include photos and notes for better engagement.',
      type: 'info' as const,
      learnMoreLink: '/help#recipe-sharing'
    }
  ]
};

export const guidedTours = {
  'first-time-user': {
    id: 'first-time-user',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Henry Hunter\'s Platform',
        content: 'Let\'s take a quick tour of the main features to get you started with professional bread baking.',
        target: 'header',
        position: 'bottom' as const
      },
      {
        id: 'workspace',
        title: 'Recipe Workspace',
        content: 'Upload and format your recipes here. Use text, photos, or voice input - our AI handles the formatting.',
        target: '[href="/recipe-workspace"]',
        position: 'bottom' as const,
        action: () => console.log('Highlighted workspace link')
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting Tools',
        content: 'Analyze recipes and finished bread photos to identify and fix baking problems.',
        target: '[href="/troubleshooting"]',
        position: 'bottom' as const
      },
      {
        id: 'help',
        title: 'Get Help Anytime',
        content: 'Click here whenever you need help. We have guides for every feature and common questions.',
        target: '[href="/help"]',
        position: 'bottom' as const
      }
    ]
  },

  'recipe-workspace': {
    id: 'recipe-workspace-tour',
    steps: [
      {
        id: 'upload-options',
        title: 'Multiple Upload Methods',
        content: 'Choose how to input your recipe: type it, upload a photo, or use voice dictation.',
        target: '.upload-section',
        position: 'right' as const
      },
      {
        id: 'ai-formatting',
        title: 'AI Formatting',
        content: 'Our AI automatically separates ingredients from instructions and formats everything properly.',
        target: '.formatting-section',
        position: 'left' as const
      },
      {
        id: 'edit-mode',
        title: 'Edit and Enhance',
        content: 'Switch to edit mode to manually adjust ingredients, add photos, or include troubleshooting notes.',
        target: '.edit-button',
        position: 'top' as const
      },
      {
        id: 'save-recipe',
        title: 'Save Your Work',
        content: 'Save recipes to your collection, export as PDF, or share with the community.',
        target: '.save-section',
        position: 'top' as const
      }
    ]
  },

  'troubleshooting-tour': {
    id: 'troubleshooting-tour',
    steps: [
      {
        id: 'recipe-analysis',
        title: 'Recipe Analysis',
        content: 'Paste your recipe text here to detect potential issues before you start baking.',
        target: '.recipe-input',
        position: 'right' as const
      },
      {
        id: 'crust-crumb',
        title: 'Finished Bread Analysis',
        content: 'Upload photos of your finished bread for professional diagnostic analysis.',
        target: '.crust-crumb-link',
        position: 'left' as const
      },
      {
        id: 'scan-history',
        title: 'Track Your Progress',
        content: 'View your scan history to monitor improvements and compare different recipes.',
        target: '.history-section',
        position: 'right' as const
      }
    ]
  }
};

export const getContextualHelp = (pagePath: string) => {
  const pathMap: { [key: string]: string } = {
    '/recipe-workspace': 'recipe-workspace',
    '/workspace': 'recipe-workspace',
    '/troubleshooting': 'troubleshooting',
    '/crust-and-crumb': 'crust-and-crumb',
    '/tools/crust-and-crumb': 'crust-and-crumb',
    '/books': 'books',
    '/blog': 'blog',
    '/bread-calculator': 'bread-calculator',
    '/my-recipes': 'my-recipes'
  };

  const key = pathMap[pagePath];
  return key ? contextualHelpTips[key] || [] : [];
};