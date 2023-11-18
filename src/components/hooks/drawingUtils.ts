import { v4 } from "uuid";
import { GridSize, Tile, Placement, Tileset, TilePlacement } from "../Providers/types";
import { CanvasViewState } from "./types";

export const computeSelectedTile = (event: MouseEvent, rect: DOMRect, canvasViewState: CanvasViewState, tileSize: number): Placement => {

  const { translateX, translateY, scaledTileSize } = canvasViewState;
  const x = event.clientX - rect.left - translateX;
  const y = event.clientY - rect.top - translateY;
  const newX = Math.floor(x / scaledTileSize);
  const newY = Math.floor(y / scaledTileSize);

  return {
    x: newX,
    y: newY,
    pixelX: newX * tileSize,
    pixelY: newY * tileSize
  };
}


export const drawGrid = (canvas: HTMLCanvasElement, canvasView: CanvasViewState, gridElement: GridSize, rows: number, cols: number, selectedTileIdsFromSpritesheets: Tile[] | TilePlacement[]) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const { translateX, translateY, zoomLevel } = canvasView;
  const startX = Math.max(0, Math.floor(-translateX / (gridElement.tileSize * zoomLevel)));
  const startY = Math.max(0, Math.floor(-translateY / (gridElement.tileSize * zoomLevel)));
  const endX = Math.min(cols, Math.ceil((canvas.width - translateX) / (gridElement.tileSize * zoomLevel)));
  const endY = Math.min(rows, Math.ceil((canvas.height - translateY) / (gridElement.tileSize * zoomLevel)));

  for (let row = startY; row < endY; row++) {
    for (let col = startX; col < endX; col++) {
      const x = col * gridElement.tileSize;
      const y = row * gridElement.tileSize;
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, gridElement.tileSize, gridElement.tileSize);
      const isSelected = selectedTileIdsFromSpritesheets.some((tile) => tile.x === col && tile.y === row);

      if (isSelected) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, gridElement.tileSize, gridElement.tileSize);
      }
      // Draw coordinates
      ctx.font = "7px Arial";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${col},${row}`, x + gridElement.tileSize / 2, y + gridElement.tileSize / 2);
    }
  }
};


export const preComputeTileset = (image: HTMLImageElement, tileSize: number): Tileset => {

  // Assuming the image is already loaded before this function is called
  const rows = Math.ceil(image.height / tileSize);
  const cols = Math.ceil(image.width / tileSize);

  const tiles: Tile[] = [];

  const tilesetId = v4();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push({
        tileId: v4(),
        tilesetId,
        x: col,
        y: row,
        pixelX: col * tileSize,
        pixelY: row * tileSize,
        width: tileSize,
        height: tileSize,
        properties: {}
      });
    }
  }


  return {
    id: tilesetId,
    name: `Tileset: ${tilesetId.substring(0, 5)}`, // Update as appropriate
    image: image.src,
    tileWidth: tileSize,
    tileHeight: tileSize,
    tiles: tiles.reduce((acc: { [tileId: string]: Tile }, tile) => ({
      ...acc,
      [tile.tileId]: tile
    }), {})
  };
};
