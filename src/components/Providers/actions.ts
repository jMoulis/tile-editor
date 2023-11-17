import { SelectedTexture } from "../hooks/types";
import { CanvasActionTypes, CanvasActions, GridSize, PointerType, Tile, } from "./types";

export const setTileSizeAction = (grid: GridSize): CanvasActions => ({
  type: CanvasActionTypes.SET_GRID_SIZE,
  payload: grid,
});

export const setSelectMainCanvasTileAction = (selectedMainCanvasTile: Tile): CanvasActions => ({
  type: CanvasActionTypes.SELECT_MAIN_CANVAS_TILE,
  payload: selectedMainCanvasTile,
});

export const setSelectedSpriteSheetTilesAction = (selectedSpritesheetTiles: Tile[]): CanvasActions => ({
  type: CanvasActionTypes.SELECT_SPRITESHEET_TILES,
  payload: selectedSpritesheetTiles,
});

export const setSelectedSpriteSheetAction = (spriteSheet: string): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECTED_SPRITESHEET,
  payload: spriteSheet
});
export const setSelectedTexturesAction = (textures: SelectedTexture[]): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECTED_TEXTURES,
  payload: textures
});
export const addToSelectedTexturesAction = (texture: SelectedTexture): CanvasActions => ({
  type: CanvasActionTypes.ADD_TO_SELECTED_TEXTURES,
  payload: texture
});
export const setActivePointerTypeAction = (type: PointerType): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECT_POINTER,
  payload: type
});
export const addToSelectedSpriteSheetTilesAction = (tile: Tile): CanvasActions => ({
  type: CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES,
  payload: tile
});