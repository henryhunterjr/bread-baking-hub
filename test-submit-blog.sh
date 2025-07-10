#!/bin/bash

echo "Testing submit-content Edge Function with blog payload..."
echo "====================================================="

curl -X POST https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/submit-content \
  -H "Authorization: Bearer c404c9f18d2d7ae73a882156681a4975c094a0e7fe52a589c5e7615c51baaa0a" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "payload": {
      "title": "Reviving Your Sourdough Starter",
      "content": "Add equal parts flour and water and keep it warm.",
      "author": "Henry Hunter"
    }
  }'

echo ""
echo "Test complete!"