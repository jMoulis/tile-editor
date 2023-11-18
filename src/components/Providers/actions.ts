import { CanvasActionTypes, CanvasActions, GridSize, Layer, PointerType, SpriteSheet, Tile, TilePlacement, Tileset, } from "./types";

export const setTileSizeAction = (grid: GridSize): CanvasActions => ({
  type: CanvasActionTypes.SET_GRID_SIZE,
  payload: grid,
});

export const setSelectedSpriteSheetTilesAction = (selectedSpritesheetTiles: Tile[]): CanvasActions => ({
  type: CanvasActionTypes.SELECT_SPRITESHEET_TILES,
  payload: selectedSpritesheetTiles,
});

export const setSelectedSpriteSheetIdAction = (spriteSheetID: string): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECTED_SPRITESHEET_ID,
  payload: spriteSheetID
});
export const setActivePointerTypeAction = (type: PointerType): CanvasActions => ({
  type: CanvasActionTypes.SET_SELECT_POINTER,
  payload: type
});
export const addToSelectedSpriteSheetTilesAction = (tile: Tile): CanvasActions => ({
  type: CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES,
  payload: tile
});
export const addLayerAction = (layer: Layer): CanvasActions => ({
  type: CanvasActionTypes.ADD_LAYER,
  payload: layer,
});

export const removeLayerAction = (layerId: string): CanvasActions => ({
  type: CanvasActionTypes.REMOVE_LAYER,
  payload: layerId,
});

export const modifyLayerAction = (layerId: string, updatedLayer: Layer): CanvasActions => ({
  type: CanvasActionTypes.MODIFY_LAYER,
  payload: { id: layerId, layer: updatedLayer }
});
export const upsertTileToLayerAction = (tilePlacement: TilePlacement, layerId: string, shouldDelete: boolean): CanvasActions => ({
  type: CanvasActionTypes.UPSERT_TILE_TO_LAYER,
  payload: { layerId, tilePlacement, shouldDelete }
});

export const selectLayerAction = (layerId: string): CanvasActions => ({
  type: CanvasActionTypes.SELECT_LAYER,
  payload: layerId,
});

export const addTilesetAction = (tileset: Tileset): CanvasActions => ({
  type: CanvasActionTypes.ADD_TILESET,
  payload: tileset,
});

export const modifyTilesetAction = (index: number, tileset: Tileset): CanvasActions => ({
  type: CanvasActionTypes.MODIFY_TILESET,
  payload: { index, tileset },
});

export const addSpriteSheetAction = (spriteSheet: SpriteSheet, selected: boolean): CanvasActions => ({
  type: CanvasActionTypes.ADD_SPRITE_SHEET,
  payload: { spriteSheet, selected },
});
// Action to remove a sprite sheet
export const deleteSpriteSheetAction = (spriteSheetId: string): CanvasActions => ({
  type: CanvasActionTypes.DELETE_SPRITE_SHEET,
  payload: spriteSheetId,
});

// Action to update a sprite sheet
export const updateSpriteSheetAction = (spriteSheetId: string, updatedSpriteSheet: SpriteSheet): CanvasActions => ({
  type: CanvasActionTypes.UPDATE_SPRITE_SHEET,
  payload: { id: spriteSheetId, spriteSheet: updatedSpriteSheet },
});
