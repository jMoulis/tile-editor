import { FormEvent, useState } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';

type Props = {
  tileSize: number;
};

export const ImageUpload = ({ tileSize }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useImageLoader(imageUrl, tileSize, true, true);

  const handleSelectFile = (event: FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (files?.[0]) {
      const [file] = files;
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleSelectFile} />
    </div>
  );
};
