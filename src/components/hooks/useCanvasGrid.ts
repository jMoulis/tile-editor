import { useCallback, useEffect, useRef, useState } from 'react';
import { GridSize, Layer, Tile, Tilesets } from '../Providers/types';
import { useCanvasSelector } from '../Providers/useCanvasSelector';
import { DEFAULT_ZOOM } from '../constants';
import { drawGrid } from './drawingUtils';
import { CanvasViewState, SourceCanvas } from './types';
import { useCanvasEvents } from './useCanvasEvents';
import { useImageLoader } from './useImageLoader';

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
  const selectedTileIdsFromSpritesheets: Tile[] = useCanvasSelector((state) => state.selectedSpritesheetTiles);

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const selectedLayer: Layer | null = useCanvasSelector((state) => state.selectedLayerIndex ? state.layers[state.selectedLayerIndex] : null);
  const tielsets: Tilesets = useCanvasSelector((state) => state.tilesets);

  const [shouldRedraw, setShouldRedraw] = useState(true);

  useCanvasEvents(canvasRef, canvasViewState, setShouldRedraw, sourceCanvas, rectRef, setCanvasViewState, grid);

  const selectedSpritesheetURL = useCanvasSelector((state) => state.spriteSheets.find((prev) => prev.id === state.selectedSpritesheetID)?.url || null);

  const { image: selectedSpriteSheetImage, isLoading } =
    useImageLoader(selectedSpritesheetURL, grid.tileSize, false, false);

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
    if (!isLoading && selectedSpriteSheetImage) {
      setLoadedImage(selectedSpriteSheetImage);
      setShouldRedraw(true);
    } else {
      setLoadedImage(null);
    }
  }, [isLoading, selectedSpriteSheetImage, selectedSpritesheetURL]);

  const drawSelectedTile = useCallback((layer: Layer) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx) return;

    if (sourceCanvas !== "spredsheetDisplay") {
      layer.data.forEach((dataTile) => {
        if (ctx && loadedImage) {
          const tile = tielsets[dataTile.tilesetId]?.tiles[dataTile.tileId];
          if (!tile) return;
          ctx.drawImage(loadedImage, tile.pixelX, tile.pixelY, tile.width, tile.height, dataTile.pixelX, dataTile.pixelY, tile.width, tile.height);
        }
      });
    }
  }, [loadedImage, sourceCanvas, tielsets]);

  const draw = useCallback(() => {
    if (!shouldRedraw) return;
    if (!selectedLayer) return;
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

    drawSelectedTile(selectedLayer);
    drawGrid(canvas, canvasViewState, grid, rows, cols, sourceCanvas === "spredsheetDisplay" ? selectedTileIdsFromSpritesheets : []);
    ctx.restore();
    setShouldRedraw(false);
  }, [shouldRedraw, selectedLayer, canvasViewState, loadedImage, sourceCanvas, drawSelectedTile, grid, rows, cols, selectedTileIdsFromSpritesheets]);

  useEffect(() => {
    if (!shouldRedraw) return;
    const animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldRedraw, draw]);

  return {
    canvasRef
  }
};