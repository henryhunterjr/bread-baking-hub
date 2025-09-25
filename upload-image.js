// Simple script to upload the bread image to Supabase
import fs from 'fs';
import { FormData, Blob } from 'node:buffer';

async function uploadImage() {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync('src/assets/bread-upload.png');
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    const imageFile = new File([imageBlob], 'bread-upload.png', { type: 'image/png' });

    // Create form data
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('recipeSlug', 'bread-image');

    // Upload to Supabase edge function
    const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/upload-recipe-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Image uploaded successfully!');
      console.log('URL:', result.uploadedUrl);
      return result.uploadedUrl;
    } else {
      console.error('Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

uploadImage();