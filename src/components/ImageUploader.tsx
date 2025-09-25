import { useEffect, useState } from 'react';
import { useRecipeImageUpload } from '@/hooks/useRecipeImageUpload';

export const ImageUploader = () => {
  const { uploadRecipeImage, isUploading } = useRecipeImageUpload();
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  useEffect(() => {
    const uploadBreadImage = async () => {
      try {
        // Fetch the image from the assets folder
        const response = await fetch('/src/assets/bread-upload.png');
        const blob = await response.blob();
        const file = new File([blob], 'bread-upload.png', { type: 'image/png' });

        const result = await uploadRecipeImage(file, 'bread-image');
        
        if (result.success && result.imageUrl) {
          setUploadedUrl(result.imageUrl);
          console.log('Image uploaded successfully!');
          console.log('URL:', result.imageUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    uploadBreadImage();
  }, [uploadRecipeImage]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Image Upload Status</h2>
      {isUploading && <p>Uploading image...</p>}
      {uploadedUrl && (
        <div>
          <p className="text-green-600 mb-2">✓ Upload successful!</p>
          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
            {uploadedUrl}
          </p>
          <img src={uploadedUrl} alt="Uploaded bread" className="mt-4 max-w-md rounded" />
        </div>
      )}
    </div>
  );
};