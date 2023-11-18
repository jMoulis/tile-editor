import { Coords } from "../Providers/types";

export interface CanvasViewState {
  zoomLevel: number;
  translateX: number;
  translateY: number;
  lastMousePosition: Coords;
  scaledTileSize: number;
}
export type SourceCanvas = 'main' | 'spredsheetDisplay';
