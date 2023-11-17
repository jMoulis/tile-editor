import { useCallback, useEffect, useState } from "react";
import { computeSelectedTile, computeTexture } from "./drawingUtils";
import { CanvasViewState, SourceCanvas } from "./types";
import { useCanvasDispatch } from "../Providers/useCanvasDispatch";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_SENSITIVITY } from "../constants";
import { addToSelectedSpriteSheetTilesAction, addToSelectedTexturesAction, setSelectedSpriteSheetTilesAction } from "../Providers/actions";
import { useCanvasSelector } from "../Providers/useCanvasSelector";
import { GridSize, PointerType, Tile } from "../Providers/types";

export const useCanvasEvents = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, canvasViewState: CanvasViewState, setShouldRedraw: (value: boolean) => void, sourceCanvas: SourceCanvas, rectRef: React.MutableRefObject<DOMRect | null>, setCanvasViewState: React.Dispatch<React.SetStateAction<CanvasViewState>>, grid: GridSize) => {
  const dispatch = useCanvasDispatch();
  const selectedTileFromSpritesheets = useCanvasSelector((state) => state.selectedSpritesheetTiles);

  const [isPanning, setIsPanning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const pointer: PointerType = useCanvasSelector((state) => state.pointer);

  const addBrushStroke = useCallback((event: MouseEvent) => {
    if (isPanning || sourceCanvas !== 'main') return;
    const rect = rectRef?.current;
    if (!rect || !selectedTileFromSpritesheets.length) return;

    const baseTexture = computeTexture({
      client: { x: event.clientX, y: event.clientY },
      rect, grid, canvasViewState,
      selectedSprite: selectedTileFromSpritesheets[0]
    });

    selectedTileFromSpritesheets.forEach((selectedTile: Tile) => {
      const offsetCol = selectedTile.col - baseTexture.spriteX / grid.tileSize;
      const offsetRow = selectedTile.row - baseTexture.spriteY / grid.tileSize;

      const newTexture = { ...baseTexture };
      newTexture.tileX += offsetCol * grid.tileSize;
      newTexture.tileY += offsetRow * grid.tileSize;
      newTexture.spriteX = selectedTile.col * grid.tileSize;
      newTexture.spriteY = selectedTile.row * grid.tileSize;

      dispatch(addToSelectedTexturesAction(newTexture));
    });

    setShouldRedraw(true);
  }, [isPanning, sourceCanvas, rectRef, selectedTileFromSpritesheets, grid, canvasViewState, setShouldRedraw, dispatch]);

  const handleTileSelect = useCallback((event: MouseEvent) => {
    if (isPanning) return;
    const rect = rectRef?.current;
    if (!rect) return;

    const tile: Tile = computeSelectedTile(event, rect, canvasViewState);
    const isMultiSelect = event.metaKey || event.ctrlKey;

    if (sourceCanvas === 'main') {
      addBrushStroke(event);
    } else {
      if (isMultiSelect) {
        dispatch(addToSelectedSpriteSheetTilesAction(tile));
      } else {
        dispatch(setSelectedSpriteSheetTilesAction([tile]));
      }
    }
    setShouldRedraw(true);
  }, [isPanning, rectRef, canvasViewState, sourceCanvas, setShouldRedraw, addBrushStroke, dispatch]);

  const handleZoom = useCallback((event: WheelEvent) => {
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      const rect = rectRef?.current;

      if (!rect) return;


      const { translateX, translateY } = canvasViewState;
      setShouldRedraw(true);

      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      setCanvasViewState((prevViewState) => {
        const newZoomLevel = Math.max(MIN_ZOOM, Math.min(prevViewState.zoomLevel - event.deltaY * ZOOM_SENSITIVITY, MAX_ZOOM));

        let newTranslateX = prevViewState.translateX;
        let newTranslateY = prevViewState.translateY;

        if (newZoomLevel !== prevViewState.zoomLevel) {
          const originalX = (cursorX - translateX) / prevViewState.zoomLevel;
          const originalY = (cursorY - translateY) / prevViewState.zoomLevel;

          newTranslateX = cursorX - originalX * newZoomLevel;
          newTranslateY = cursorY - originalY * newZoomLevel;
        }

        return {
          ...prevViewState,
          zoomLevel: newZoomLevel,
          translateX: newTranslateX,
          translateY: newTranslateY
        };
      });
    }
  }, [canvasViewState, rectRef, setCanvasViewState, setShouldRedraw]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    setIsMouseDown(true);
    if (isPanning) {
      setCanvasViewState((prev) => ({
        ...prev,
        lastMousePosition: { x: event.clientX, y: event.clientY }
      }));
    }
  }, [isPanning, setCanvasViewState]);

  const eraseTile = useCallback((_event: MouseEvent) => {
    setShouldRedraw(true);
  }, [setShouldRedraw]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMouseDown) {
      switch (pointer) {
        case 'brush':
          addBrushStroke(event);
          break;
        case 'eraser':
          eraseTile(event);
          break;
        default:
        // Handle other pointer types or default behavior
      }
      if (isPanning) {
        const dx = event.clientX - canvasViewState.lastMousePosition.x;
        const dy = event.clientY - canvasViewState.lastMousePosition.y;
        setShouldRedraw(true);
        setCanvasViewState((prev) => ({
          ...prev,
          lastMousePosition: { x: event.clientX, y: event.clientY },
          translateX: prev.translateX + dx,
          translateY: prev.translateY + dy
        }));
      }
    }
  }, [isMouseDown, pointer, isPanning, addBrushStroke, eraseTile, canvasViewState.lastMousePosition.x, canvasViewState.lastMousePosition.y, setShouldRedraw, setCanvasViewState]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsPanning(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsPanning(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleTileSelect);
      canvas.addEventListener('wheel', handleZoom);
      canvas.addEventListener('mousedown', handleMouseDown);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleTileSelect);
        canvas.removeEventListener('wheel', handleZoom);
        canvas.removeEventListener('mousedown', handleMouseDown);

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleTileSelect, handleZoom]);

}