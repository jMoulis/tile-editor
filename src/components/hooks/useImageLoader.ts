import { useState, useEffect } from 'react';
import { useCanvasDispatch } from '../Providers/useCanvasDispatch';
import { addSpriteSheetAction, setSelectedSpriteSheetIdAction } from '../Providers/actions';
import { preComputeTileset } from './drawingUtils';
import { SpriteSheet } from '../Providers/types';
import { v4 } from 'uuid';

// Custom hook for loading an image
export const useImageLoader = (url: string | null, tileSize: number, initCompute: boolean, selectNew: boolean) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const dispatch = useCanvasDispatch();

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }

    setIsLoading(true);
    const image = new Image();

    image.onload = () => {
      setIsLoading(false);
      if (initCompute) {
        const dimensions = { width: image.width, height: image.height };
        const precomputedTileset = preComputeTileset(image, tileSize);

        const id = v4();
        const newSpriteSheet: SpriteSheet = {
          id,
          name: `Sprite ${id.substring(0, 5)}`,
          dimensions,
          tileset: precomputedTileset,
          url,
        };
        dispatch(setSelectedSpriteSheetIdAction(id));
        dispatch(addSpriteSheetAction(newSpriteSheet, selectNew));
      }
      setImage(image);
    };

    image.onerror = () => {
      setIsLoading(false);
      setError(new Error('Failed to load image'));
    };
    image.src = url;
    // Cleanup function to avoid setting state on unmounted component
    return () => {
      image.onload = null;
      image.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tileSize, initCompute, selectNew]);

  return { image, isLoading, error };
};
