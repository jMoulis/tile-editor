
// Define a Tile interface

export interface Coords {
  x: number;
  y: number;
}

export interface Placement extends Coords {
  pixelX: number;
  pixelY: number;
}

export interface DefaultTile extends Placement {
  tileId: string;
  tilesetId: string;
}

export interface Tile extends DefaultTile {
  properties: any;
  width: number;
  height: number;
}

export type TilePlacement = DefaultTile;

export interface Layer {
  type: 'tile' | 'object' | 'image';
  data: TilePlacement[];
  visible: boolean;
  id: string;
  name: string;
}

export interface Layers {
  [layerId: string]: Layer
}

export interface Tiles {
  [tileId: string]: Tile
}
export interface Tileset {
  name: string;
  image: string;
  tileWidth: number;
  tileHeight: number;
  tiles: Tiles;
  id: string;
}
export interface Tilesets {
  [tilesetId: string]: Tileset
}
export interface GridSize {
  tileSize: number,
  rows: number,
  cols: number,
}
export interface Size {
  width: number;
  height: number;
}

export interface SpriteSheet {
  id: string;
  tileset: Tileset;
  dimensions: Size;
  url: string;
  name: string;
}
// Define the shape of your state
export interface CanvasState {
  grid: GridSize,
  selectedSpritesheetTiles: Tile[];
  selectedSpritesheetID: string | null;
  pointer: PointerType | null;
  layers: Layers;
  tilesets: Tilesets;
  selectedLayerIndex: string | null;
  spriteSheets: SpriteSheet[];
}


// Action Types as enum
export enum CanvasActionTypes {
  SET_GRID_SIZE = 'SET_GRID_SIZE',
  SELECT_SPRITESHEET_TILES = 'SELECT_SPRITESHEET_TILES',
  SET_SELECTED_SPRITESHEET_ID = 'SET_SELECTED_SPRITESHEET_ID',
  SET_SELECT_POINTER = 'SET_SELECT_POINTER',
  ADD_TO_SELECTED_SPRITESHEET_TILES = 'ADD_TO_SELECTED_SPRITESHEET_TILES',
  ADD_LAYER = 'ADD_LAYER',
  REMOVE_LAYER = 'REMOVE_LAYER',
  MODIFY_LAYER = 'MODIFY_LAYER',
  SELECT_LAYER = 'SELECT_LAYER',
  UPSERT_TILE_TO_LAYER = 'UPSERT_TILE_TO_LAYER',
  ADD_TILESET = 'ADD_TILESET',
  MODIFY_TILESET = 'MODIFY_TILESET',
  SET_SPRITE_SHEET = "SET_SPRITE_SHEET",
  ADD_SPRITE_SHEET = "ADD_SPRITE_SHEET",
  DELETE_SPRITE_SHEET = "DELETE_SPRITE_SHEET",
  UPDATE_SPRITE_SHEET = "UPDATE_SPRITE_SHEET"
}

// Define Action interfaces for each action
interface SetGridSizeSizeAction {
  type: typeof CanvasActionTypes.SET_GRID_SIZE;
  payload: GridSize;
}

interface SelectSpritesheetTilesAction {
  type: typeof CanvasActionTypes.SELECT_SPRITESHEET_TILES;
  payload: Tile[];
}
interface AddSelectedSpriteSheetTileAction {
  type: typeof CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES;
  payload: Tile;
}

interface SelectedSpritesheetIDAction {
  type: typeof CanvasActionTypes.SET_SELECTED_SPRITESHEET_ID;
  payload: string;
}
interface SelectedPointerAction {
  type: typeof CanvasActionTypes.SET_SELECT_POINTER;
  payload: PointerType;
}

interface AddLayerAction {
  type: CanvasActionTypes.ADD_LAYER;
  payload: Layer;
}
interface UpsertTileToLayerAction {
  type: CanvasActionTypes.UPSERT_TILE_TO_LAYER;
  payload: { tilePlacement: TilePlacement, layerId: string, shouldDelete: boolean };
}

interface RemoveLayerAction {
  type: CanvasActionTypes.REMOVE_LAYER;
  payload: string; // Layer index
}

interface ModifyLayerAction {
  type: CanvasActionTypes.MODIFY_LAYER;
  payload: { id: string, layer: Layer };
}

interface SelectLayerAction {
  type: CanvasActionTypes.SELECT_LAYER;
  payload: string; // Layer index
}
interface AddTilesetAction {
  type: CanvasActionTypes.ADD_TILESET;
  payload: Tileset;
}
interface ModifyTilesetAction {
  type: CanvasActionTypes.MODIFY_TILESET;
  payload: { index: number, tileset: Tileset };
}
interface SelectSpriteSheetAction {
  type: CanvasActionTypes.SET_SPRITE_SHEET;
  payload: SpriteSheet;
}
interface AddSpriteSheetAction {
  type: CanvasActionTypes.ADD_SPRITE_SHEET;
  payload: { spriteSheet: SpriteSheet, selected: boolean };
}
interface UpdateSpriteSheetAction {
  type: CanvasActionTypes.UPDATE_SPRITE_SHEET;
  payload: { id: string, spriteSheet: SpriteSheet };
}
interface DeleteSpriteSheetAction {
  type: CanvasActionTypes.DELETE_SPRITE_SHEET;
  payload: string;
}
// Union type for all possible actions
export type CanvasActions =
  | SetGridSizeSizeAction
  | SelectSpritesheetTilesAction
  | SelectedSpritesheetIDAction
  | SelectedPointerAction
  | AddSelectedSpriteSheetTileAction
  | AddLayerAction
  | RemoveLayerAction
  | ModifyLayerAction
  | UpsertTileToLayerAction
  | SelectLayerAction
  | AddTilesetAction
  | ModifyTilesetAction
  | SelectSpriteSheetAction
  | AddSpriteSheetAction
  | UpdateSpriteSheetAction
  | DeleteSpriteSheetAction;

export type PointerType = 'eraser' | 'brush';