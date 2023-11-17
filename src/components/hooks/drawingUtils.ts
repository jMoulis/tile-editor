import { Coords, GridSize, Tile } from "../types";
import { CanvasViewState, SelectedTexture } from "./types";

export const computeSelectedTile = (event: MouseEvent, rect: DOMRect, canvasViewState: CanvasViewState) => {
  const { translateX, translateY, scaledTileSize } = canvasViewState;
  const x = event.clientX - rect.left - translateX;
  const y = event.clientY - rect.top - translateY;
  const col = Math.floor(x / scaledTileSize);
  const row = Math.floor(y / scaledTileSize);
  const tile: Tile = {
    col,
    row
  }
  return tile;
}

export const computeTexture = ({
  client, rect, grid, canvasViewState, selectedSprite
}: {
  client: Coords,
  canvasViewState: CanvasViewState,
  grid: GridSize,
  rect: DOMRect
  selectedSprite: Tile
}) => {
  const { translateX, translateY, zoomLevel } = canvasViewState;

  const adjustedX = (client.x - rect.left - translateX) / zoomLevel;
  const adjustedY = (client.y - rect.top - translateY) / zoomLevel;

  const col = Math.floor(adjustedX / grid.tileSize);
  const row = Math.floor(adjustedY / grid.tileSize);

  const newTexture: SelectedTexture = {
    tileX: col * grid.tileSize,
    tileY: row * grid.tileSize,
    spriteX: selectedSprite.col * grid.tileSize,
    spriteY: selectedSprite.row * grid.tileSize,
    width: grid.tileSize,
    height: grid.tileSize,
  };
  return newTexture
};

export const drawGrid = (canvas: HTMLCanvasElement, canvasView: CanvasViewState, gridElement: GridSize, tileSelected: Tile | null) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const { translateX, translateY, zoomLevel } = canvasView;
  const startX = Math.max(0, Math.floor(-translateX / (gridElement.tileSize * zoomLevel)));
  const startY = Math.max(0, Math.floor(-translateY / (gridElement.tileSize * zoomLevel)));
  const endX = Math.min(gridElement.cols, Math.ceil((canvas.width - translateX) / (gridElement.tileSize * zoomLevel)));
  const endY = Math.min(gridElement.rows, Math.ceil((canvas.height - translateY) / (gridElement.tileSize * zoomLevel)));

  for (let row = startY; row < endY; row++) {
    for (let col = startX; col < endX; col++) {
      const x = col * gridElement.tileSize;
      const y = row * gridElement.tileSize;
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, gridElement.tileSize, gridElement.tileSize);

      if (tileSelected && tileSelected.col === col && tileSelected.row === row) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, gridElement.tileSize, gridElement.tileSize);

      }
      // Draw coordinates
      ctx.font = "7px Arial";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // ctx.fillText(`${col},${row}`, x + gridElement.tileSize / 2, y + gridElement.tileSize / 2);
    }
  }
};