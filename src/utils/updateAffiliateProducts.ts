import { processCSVData, mergeProducts, generateProductsJSON } from './affiliateProductProcessor';
import { csvData } from './processAffiliateData';
import affiliateProductsData from '../data/affiliate-products.json';

// Process the CSV data
const newProducts = processCSVData(csvData);

// Get existing products
const existingProducts = affiliateProductsData.products;

// Merge products (new ones will be added, existing ones updated)
const mergedProducts = mergeProducts(existingProducts, newProducts);

// Generate the final JSON structure
export const updatedProductsData = generateProductsJSON(mergedProducts);

console.log(`Successfully processed ${newProducts.length} products from CSV`);
console.log(`Total products after merge: ${mergedProducts.length}`);