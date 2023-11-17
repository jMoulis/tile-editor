import { SelectedTexture } from "./hooks/types";

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
  selectedSpritesheetTile: Tile | null;
  hoveredMainCanvasTile: Tile | null;
  hoveredSpritesheetTile: Tile | null;
  selectedSpritesheet: string | null;
  selectedTextures: SelectedTexture[];
}


// Action Types as enum
export enum CanvasActionTypes {
  SET_GRID_SIZE = 'SET_GRID_SIZE',
  SELECT_MAIN_CANVAS_TILE = 'SELECT_MAIN_CANVAS_TILE',
  SELECT_SPRITESHEET_TILE = 'SELECT_SPRITESHEET_TILE',
  HOVER_MAIN_CANVAS_TILE = 'HOVER_MAIN_CANVAS_TILE',
  HOVER_SPRITESHEET_TILE = 'HOVER_SPRITESHEET_TILE',
  SET_SELECTED_SPRITESHEET = 'SET_SELECTED_SPRITESHEET',
  SET_SELECTED_TEXTURE = 'SET_SELECTED_TEXTURE',
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

interface SelectSpritesheetTileAction {
  type: typeof CanvasActionTypes.SELECT_SPRITESHEET_TILE;
  payload: Tile;
}

interface SelectedSpritesheetAction {
  type: typeof CanvasActionTypes.SET_SELECTED_SPRITESHEET;
  payload: string;
}
interface SelectedTextureAction {
  type: typeof CanvasActionTypes.SET_SELECTED_TEXTURE;
  payload: SelectedTexture;
}

// Union type for all possible actions
export type CanvasActions =
  | SetGridSizeSizeAction
  | SelectMainCanvasTileAction
  | SelectSpritesheetTileAction
  | SelectedSpritesheetAction
  | SelectedTextureAction;


