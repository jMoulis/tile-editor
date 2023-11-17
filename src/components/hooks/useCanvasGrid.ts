import { useCallback, useEffect, useRef, useState } from 'react';
import { GridSize } from '../Providers/types';
import { useCanvasSelector } from '../Providers/useCanvasSelector';
import { DEFAULT_ZOOM } from '../constants';
import { drawGrid } from './drawingUtils';
import { CanvasViewState, SelectedTexture, SourceCanvas } from './types';
import { useCanvasEvents } from './useCanvasEvents';

export const useCanvasGrid = (grid: GridSize, sourceCanvas: SourceCanvas, rows: number,
  cols: number) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const [canvasViewState, setCanvasViewState] = useState<CanvasViewState>({
    zoomLevel: DEFAULT_ZOOM,
    translateX: 0,
    translateY: 0,
    lastMousePosition: { x: 0, y: 0 },
    scaledTileSize: grid.tileSize * DEFAULT_ZOOM,
  });

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const [shouldRedraw, setShouldRedraw] = useState(true);

  useCanvasEvents(canvasRef, canvasViewState, setShouldRedraw, sourceCanvas, rectRef, setCanvasViewState, grid)

  const selectedTextures: SelectedTexture[] = useCanvasSelector((state) => state.selectedTextures);

  const selectedSpritesheet = useCanvasSelector((state) => state.selectedSpritesheet);

  useEffect(() => {
    if (canvasRef.current) {
      rectRef.current = canvasRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    setCanvasViewState(prevState => ({
      ...prevState,
      scaledTileSize: grid.tileSize * prevState.zoomLevel
    }));
  }, [grid.tileSize, canvasViewState.zoomLevel]);

  useEffect(() => {
    if (selectedSpritesheet) {
      const image = new Image();
      image.onload = () => {
        setLoadedImage(image);
        setShouldRedraw(true);
      };
      image.src = selectedSpritesheet;
    } else {
      setLoadedImage(null);
    }
  }, [selectedSpritesheet]);

  const draw = useCallback(() => {
    if (!shouldRedraw) return;
    const canvas = canvasRef.current;
    const rect = rectRef.current;
    if (!canvas) return;
    if (!rect) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    canvas.width = rect.width;
    canvas.height = rect.height;

    const { translateX, translateY, zoomLevel } = canvasViewState;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(translateX, translateY);
    ctx.scale(zoomLevel, zoomLevel);

    if (loadedImage && sourceCanvas !== 'main') {
      ctx.drawImage(loadedImage, 0, 0);
    }

    if (sourceCanvas !== "spredsheetDisplay") {
      selectedTextures.forEach(texture => {
        if (ctx && loadedImage) {
          ctx.drawImage(loadedImage, texture.spriteX, texture.spriteY, texture.width, texture.height, texture.tileX, texture.tileY, texture.width, texture.height);
        }
      });
    }
    drawGrid(canvas, canvasViewState, grid, null, rows, cols);
    ctx.restore();
    setShouldRedraw(false);
  }, [shouldRedraw, canvasViewState, grid, loadedImage, sourceCanvas, selectedTextures, rows, cols]);

  useEffect(() => {
    if (!shouldRedraw) return;
    const animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldRedraw, draw]);

  return {
    canvasRef
  }
};