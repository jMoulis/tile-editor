import { SelectedTexture } from "../hooks/types";

// Define a Tile interface
export interface Tile {
  row: number;
  col: number;
}

export interface Coords {
  x: number;
  y: number;
}

export interface GridSize {
  tileSize: number,
  rows: number,
  cols: number,
}
// Define the shape of your state
export interface CanvasState {
  grid: GridSize,
  selectedMainCanvasTile: Tile | null;
  selectedSpritesheetTiles: Tile[];
  hoveredMainCanvasTile: Tile | null;
  hoveredSpritesheetTile: Tile | null;
  selectedSpritesheet: string | null;
  selectedTextures: SelectedTexture[];
  pointer: PointerType | null;
}


// Action Types as enum
export enum CanvasActionTypes {
  SET_GRID_SIZE = 'SET_GRID_SIZE',
  SELECT_MAIN_CANVAS_TILE = 'SELECT_MAIN_CANVAS_TILE',
  SELECT_SPRITESHEET_TILES = 'SELECT_SPRITESHEET_TILES',
  HOVER_MAIN_CANVAS_TILE = 'HOVER_MAIN_CANVAS_TILE',
  HOVER_SPRITESHEET_TILE = 'HOVER_SPRITESHEET_TILE',
  SET_SELECTED_SPRITESHEET = 'SET_SELECTED_SPRITESHEET',
  SET_SELECTED_TEXTURES = 'SET_SELECTED_TEXTURES',
  ADD_TO_SELECTED_TEXTURES = 'ADD_TO_SELECTED_TEXTURES',
  SET_SELECT_POINTER = 'SET_SELECT_POINTER',
  ADD_TO_SELECTED_SPRITESHEET_TILES = 'ADD_TO_SELECTED_SPRITESHEET_TILES',
}

// Define Action interfaces for each action
interface SetGridSizeSizeAction {
  type: typeof CanvasActionTypes.SET_GRID_SIZE;
  payload: GridSize;
}

interface SelectMainCanvasTileAction {
  type: typeof CanvasActionTypes.SELECT_MAIN_CANVAS_TILE;
  payload: Tile;
}

interface SelectSpritesheetTilesAction {
  type: typeof CanvasActionTypes.SELECT_SPRITESHEET_TILES;
  payload: Tile[];
}
interface AddSelectedSpriteSheetTileAction {
  type: typeof CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES;
  payload: Tile;
}

interface SelectedSpritesheetAction {
  type: typeof CanvasActionTypes.SET_SELECTED_SPRITESHEET;
  payload: string;
}
interface SelectedTextureAction {
  type: typeof CanvasActionTypes.SET_SELECTED_TEXTURES;
  payload: SelectedTexture[];
}
interface AddToSelectedTextureAction {
  type: typeof CanvasActionTypes.ADD_TO_SELECTED_TEXTURES;
  payload: SelectedTexture;
}
interface SelectedPointerAction {
  type: typeof CanvasActionTypes.SET_SELECT_POINTER;
  payload: PointerType;
}

// Union type for all possible actions
export type CanvasActions =
  | SetGridSizeSizeAction
  | SelectMainCanvasTileAction
  | SelectSpritesheetTilesAction
  | SelectedSpritesheetAction
  | SelectedTextureAction
  | SelectedPointerAction
  | AddSelectedSpriteSheetTileAction
  | AddToSelectedTextureAction;


export type PointerType = 'eraser' | 'brush';