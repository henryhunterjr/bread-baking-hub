#!/bin/bash

export DOMAIN="https://bakinggreatbread.com"
export SLUG="holiday-star-cinnamon-roll-bread"
export BLOG="$DOMAIN/blog/$SLUG"

echo "Testing OG image URLs..."
echo "========================================="

echo "Bot request to blog URL:"
curl -s -A "facebookexternalhit/1.1" "$BLOG" | grep -Ei "HTTP/|og:title|og:image|twitter:image" || echo "No match found"

echo ""
echo "Twitter bot request:"
curl -s -A "Twitterbot/1.0" "$BLOG" | grep -Ei "HTTP/|twitter:card|twitter:title|twitter:image" || echo "No match found"

echo ""
echo "LinkedIn bot request:"
curl -s -A "linkedinbot/1.0" "$BLOG" | grep -Ei "HTTP/|og:title|og:image" || echo "No match found"

echo ""
echo "Human request (first 15 lines):"
curl -s -A "Mozilla/5.0" "$BLOG" | head -n 15

echo ""
echo "Bot headers:"
curl -s -I -A "facebookexternalhit/1.1" "$BLOG" | grep -Ei "cache-control|vary|x-robots-tag|content-type"

echo ""
echo "Image fetch test:"
curl -I "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-09/general/f4e8420f-af34-442d-be96-77ad8c28546f.png"