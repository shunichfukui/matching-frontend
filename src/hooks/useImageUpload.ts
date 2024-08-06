import { useState, useCallback } from 'react';

export const useImageUpload = () => {
  const [image, setImage] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setImage(file);
  }, []);

  const previewImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
  }, []);

  return {
    image,
    preview,
    uploadImage,
    previewImage,
    setImage,
    setPreview,
  };
};
