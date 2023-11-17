import { SelectedTexture } from "../hooks/types";
import { CanvasActionTypes, CanvasActions, GridSize, Tile, } from "../types";

export const setTileSizeAction = (grid: GridSize): CanvasActions => ({
  type: CanvasActionTypes.SET_GRID_SIZE,
  payload: grid,
});

export const selectMainCanvasTileAction = (selectedMainCanvasTile: Tile): CanvasActions => ({
  type: CanvasActionTypes.SELECT_MAIN_CANVAS_TILE,
  payload: selectedMainCanvasTile,
});

export const selectSpritesheetTileAction = (selectedSpritesheetTile: Tile): CanvasActions => ({
  type: CanvasActionTypes.SELECT_SPRITESHEET_TILE,
  payload: selectedSpritesheetTile,
});

export const setSelectedSpriteSheetAction = (spriteSheet: string): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECTED_SPRITESHEET,
  payload: spriteSheet
})

export const setSelectedTexturesAction = (texture: SelectedTexture): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECTED_TEXTURE,
  payload: texture
})