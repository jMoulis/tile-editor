import { Coords } from "../types";

export interface CanvasViewState {
  zoomLevel: number;
  translateX: number;
  translateY: number;
  lastMousePosition: Coords;
  scaledTileSize: number
}
export type SourceCanvas = 'main' | 'spredsheetDisplay';

export interface SelectedTexture {
  tileX: number; // X position on the main canvas
  tileY: number; // Y position on the main canvas
  spriteX: number; // X position on the sprite sheet
  spriteY: number; // Y position on the sprite sheet
  width: number; // Width of the tile
  height: number; // Height of the tile
}
