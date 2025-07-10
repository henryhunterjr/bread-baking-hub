#!/bin/bash

echo "Testing ai-drafts Edge Function..."
echo "=================================="

curl -X POST https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/ai-drafts \
  -H "Authorization: Bearer c404c9f18d2d7ae73a882156681a4975c094a0e7fe52a589c5e7615c51baaa0a" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Revive Your Starter",
    "slug": "revive-your-starter", 
    "content": "This is a test blog post about reviving your sourdough starter. Add equal parts flour and water and keep it warm.",
    "author": "Henry Hunter"
  }'

echo ""
echo "Test complete!"