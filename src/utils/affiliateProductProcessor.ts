import { z } from 'zod';

// Product schema for validation
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  brand: z.string().optional(),
  category: z.string(),
  price: z.string(),
  affiliate_link: z.string(),
  keywords: z.array(z.string()),
  regions: z.array(z.string()),
  featured: z.boolean().default(false),
  seasonal_tags: z.array(z.string()).default([]),
  offer_text: z.string().optional().default(''),
  image_url: z.string().optional(),
  utm_params: z.string().optional()
});

export type Product = z.infer<typeof ProductSchema>;

export interface CSVProduct {
  id: string;
  name: string;
  description: string;
  brand?: string;
  category: string;
  price: string;
  affiliate_link: string;
  keywords: string; // comma-separated string
  regions: string; // comma-separated string
  featured?: string; // "true" or "false"
  seasonal_tags?: string; // comma-separated string
  offer_text?: string;
  image_url?: string;
  utm_params?: string;
}

/**
 * Converts CSV data (array of objects) to the proper Product format
 */
export function processCSVData(csvData: CSVProduct[]): Product[] {
  const defaultUTMParams = "utm_source=recipe_workspace&utm_medium=product_recommendation&utm_campaign=bread_tools";
  
  return csvData.map(row => {
    const product: Product = {
      id: row.id.trim(),
      name: row.name.trim(),
      description: row.description.trim(),
      brand: row.brand?.trim(),
      category: row.category.trim(),
      price: row.price.trim(),
      affiliate_link: row.affiliate_link.trim(),
      keywords: row.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      regions: row.regions.split(',').map(r => r.trim()).filter(r => r.length > 0),
      featured: row.featured?.toLowerCase() === 'true',
      seasonal_tags: row.seasonal_tags ? row.seasonal_tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
      offer_text: row.offer_text?.trim() || '',
      image_url: row.image_url?.trim() || "/lovable-uploads/default-product.png",
      utm_params: row.utm_params?.trim() || defaultUTMParams
    };

    // Validate the product
    return ProductSchema.parse(product);
  });
}

/**
 * Merges new products with existing products, avoiding duplicates
 */
export function mergeProducts(existingProducts: Product[], newProducts: Product[]): Product[] {
  const existingIds = new Set(existingProducts.map(p => p.id));
  const mergedProducts = [...existingProducts];
  
  let addedCount = 0;
  let updatedCount = 0;
  
  newProducts.forEach(newProduct => {
    const existingIndex = existingProducts.findIndex(p => p.id === newProduct.id);
    
    if (existingIndex >= 0) {
      // Update existing product
      mergedProducts[existingIndex] = newProduct;
      updatedCount++;
    } else {
      // Add new product
      mergedProducts.push(newProduct);
      addedCount++;
    }
  });
  
  if (import.meta.env.DEV) console.log(`Product merge complete: ${addedCount} added, ${updatedCount} updated`);
  return mergedProducts;
}

/**
 * Generates the JSON structure for affiliate-products.json
 */
export function generateProductsJSON(products: Product[]): { products: Product[] } {
  return { products };
}

/**
 * Example CSV format for reference
 */
export const EXAMPLE_CSV_FORMAT = `id,name,description,brand,category,price,affiliate_link,keywords,regions,featured,seasonal_tags,offer_text,image_url,utm_params
example-mixer,Stand Mixer,Professional stand mixer for bread dough,KitchenAid,mixing,$299.99,https://example.com/mixer,"mixer,bread,dough,kitchen","US,EU",true,"holiday,baking",10% off through March,https://example.com/mixer.jpg,utm_source=custom&utm_medium=affiliate
example-scale,Digital Scale,Precision baking scale,OXO,measuring,$49.99,https://example.com/scale,"scale,weighing,baking,precision","US,EU,CA",false,,,https://example.com/scale.jpg,`;