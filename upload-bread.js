// Upload script to get the URL
async function uploadBreadImage() {
  try {
    // Read the image file as base64
    const fs = require('fs');
    const path = require('path');
    
    const imagePath = path.join(__dirname, 'src/assets/bread-upload.png');
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Create a blob from the buffer
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', imageBlob, 'bread-upload.png');
    formData.append('recipeSlug', 'bread-image');

    // Upload to Supabase
    const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/upload-recipe-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('\n🍞 BREAD IMAGE UPLOADED SUCCESSFULLY!');
      console.log('📍 URL:', result.uploadedUrl);
      console.log('\nYou can use this URL anywhere in your app or website.\n');
      return result.uploadedUrl;
    } else {
      console.error('❌ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the upload
uploadBreadImage();