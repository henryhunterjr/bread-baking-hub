# Recipe Sharing & Metadata Guide

## Overview
This project implements comprehensive recipe sharing with robust Open Graph metadata, cross-platform sharing options, and print-optimized layouts.

## Key Features

### 1. Enhanced SEO & Metadata
- **Auto-generated Open Graph tags** for Facebook/social sharing
- **Twitter Card support** with large image previews  
- **Structured JSON-LD data** for Google Rich Results
- **Dynamic meta descriptions** under 160 characters
- **Canonical URLs** to prevent duplicate content

### 2. Robust Sharing Options
- **Native device sharing** (mobile/PWA support)
- **Facebook & X (Twitter)** with dedicated sharer links
- **Email & Gmail** integration with pre-filled content
- **QR code generation** for easy mobile sharing
- **Clipboard fallbacks** for older browsers
- **Error handling** with user-friendly tooltips

### 3. Print & PDF Ready
- **Dedicated print pages** at `/print/{slug}`
- **Print-optimized layouts** with proper page breaks
- **Auto-print trigger** with 300ms delay for rendering
- **Lightweight components** without heavy scripts/images

## Usage

### Adding Recipe Hero Images
1. Upload image to `/public/og-images/` or Supabase storage
2. Ensure minimum 1200x630 resolution for social sharing
3. Update recipe `image_url` field in database
4. Fallback to `/og-default.jpg` if missing

### Verifying Social Sharing
Use Facebook's Sharing Debugger:
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter recipe URL: `https://bread-baking-hub.vercel.app/recipes/{slug}`
3. Check OG image loads properly (1200x630 minimum)
4. Verify title, description display correctly

### Testing Recipe Pages
- Each recipe should load without console errors
- Share buttons should generate proper URLs
- Print pages should auto-trigger browser print dialog
- OG metadata should not fall back to app defaults

## Technical Implementation
- **StandardRecipe type** normalizes data across components
- **mapLegacyToStandard()** converts Supabase data format
- **Enhanced share validation** prevents broken link sharing
- **Cross-platform compatibility** for desktop and mobile