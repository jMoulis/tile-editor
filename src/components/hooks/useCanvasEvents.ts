import { useCallback, useEffect, useState } from "react";
import { computeSelectedTile } from "./drawingUtils";
import { CanvasViewState, SourceCanvas } from "./types";
import { useCanvasDispatch } from "../Providers/useCanvasDispatch";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_SENSITIVITY } from "../constants";
import { upsertTileToLayerAction, addTilesetAction, addToSelectedSpriteSheetTilesAction, setActivePointerTypeAction, setSelectedSpriteSheetTilesAction } from "../Providers/actions";
import { useCanvasSelector } from "../Providers/useCanvasSelector";
import { GridSize, Layer, Placement, PointerType, Tile, TilePlacement, Tileset } from "../Providers/types";

export const useCanvasEvents = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, canvasViewState: CanvasViewState, setShouldRedraw: (value: boolean) => void, sourceCanvas: SourceCanvas, rectRef: React.MutableRefObject<DOMRect | null>, setCanvasViewState: React.Dispatch<React.SetStateAction<CanvasViewState>>, grid: GridSize) => {
  const dispatch = useCanvasDispatch();
  const selectedTileFromSpritesheets: Tile[] = useCanvasSelector((state) => state.selectedSpritesheetTiles);

  const selectedLayer: Layer | null = useCanvasSelector((state) => state.selectedLayerIndex ? state.layers[state.selectedLayerIndex] : null);

  const selectedSpritesheetTileset: Tileset | null = useCanvasSelector((state) =>
    state.selectedSpritesheetID
      ? state.spriteSheets.find(
        (prev) => prev.id === state.selectedSpritesheetID
      )?.tileset
      : null
  );

  const [isPanning, setIsPanning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const pointer: PointerType = useCanvasSelector((state) => state.pointer);

  const addBrushStroke = useCallback((event: MouseEvent) => {
    if (isPanning || sourceCanvas !== 'main') return;
    if (!selectedSpritesheetTileset) return null;
    if (!selectedLayer) return null;

    const rect = rectRef?.current;
    if (!rect || !selectedTileFromSpritesheets.length) return;

    const baseTileCoords: Placement = computeSelectedTile(event, rect, canvasViewState, grid.tileSize);

    const baseTile = selectedTileFromSpritesheets[0];
    const baseTileOffsetX = baseTile.x;
    const baseTileOffsetY = baseTile.y;

    selectedTileFromSpritesheets.forEach((selectedTile: Tile) => {
      const offsetCol = selectedTile.x - baseTileOffsetX;
      const offsetRow = selectedTile.y - baseTileOffsetY;

      const canvasX = (baseTileCoords.x + offsetCol) * grid.tileSize;
      const canvasY = (baseTileCoords.y + offsetRow) * grid.tileSize;

      const tilePlacement: TilePlacement = {
        x: canvasX / grid.tileSize,
        y: canvasY / grid.tileSize,
        pixelX: canvasX,
        pixelY: canvasY,
        tileId: selectedTile.tileId,
        tilesetId: selectedTile.tilesetId
      };

      dispatch(upsertTileToLayerAction(tilePlacement, selectedLayer.id, pointer === 'eraser'));
    });
    setShouldRedraw(true);
  }, [isPanning, sourceCanvas, selectedSpritesheetTileset, selectedLayer, rectRef, selectedTileFromSpritesheets, canvasViewState, grid.tileSize, setShouldRedraw, dispatch, pointer]);

  const canDraw = useCallback((event: MouseEvent) => {
    const rect = rectRef?.current;
    if (!rect) return;

    const gridWidth = grid.cols * grid.tileSize;
    const gridHeight = grid.rows * grid.tileSize;

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (clickX < 0 || clickX > gridWidth || clickY < 0 || clickY > gridHeight) {
      return false;
    }
    return true;
  }, [grid.cols, grid.rows, grid.tileSize, rectRef])
  const handleTileSelect = useCallback((event: MouseEvent) => {
    if (isPanning) return;
    if (!selectedLayer) return;

    const rect = rectRef?.current;
    if (!rect) return;


    if (!canDraw(event)) return;

    const isMultiSelect = event.metaKey || event.ctrlKey;

    if (sourceCanvas === 'main') {
      addBrushStroke(event);
    } else {
      if (!selectedSpritesheetTileset) return null;
      const tilePlacement: Placement = computeSelectedTile(event, rect, canvasViewState, grid.tileSize);
      const tile = Object.values(selectedSpritesheetTileset.tiles).find((item) => item.x === tilePlacement.x && item.y === tilePlacement.y);
      if (!tile) return;
      dispatch(setActivePointerTypeAction('brush'));
      dispatch(addTilesetAction(selectedSpritesheetTileset));
      if (isMultiSelect) {
        dispatch(addToSelectedSpriteSheetTilesAction(tile));
      } else {
        dispatch(setSelectedSpriteSheetTilesAction([tile]));
      }
    }
    setShouldRedraw(true);
  }, [isPanning, selectedLayer, rectRef, canDraw, sourceCanvas, setShouldRedraw, addBrushStroke, selectedSpritesheetTileset, canvasViewState, grid.tileSize, dispatch]);

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

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMouseDown) {
      if (!canDraw(event)) return;
      addBrushStroke(event);
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
  }, [isMouseDown, canDraw, addBrushStroke, isPanning, canvasViewState.lastMousePosition.x, canvasViewState.lastMousePosition.y, setShouldRedraw, setCanvasViewState]);

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