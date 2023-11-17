import styled from '@emotion/styled';
import { useCanvasSelector } from './Providers/useCanvasSelector';
import { useCanvasGrid } from './hooks/useCanvasGrid';
import { GridSize } from './Providers/types';
import { useEffect, useMemo, useState } from 'react';

const Root = styled.div`
  width: 250px;
`;
const Canvas = styled.canvas``;
export const RightPanel = () => {
  const gridSize: GridSize = useCanvasSelector((state) => state.grid);
  const [selectedSpriteSheetImage, setSelectedSpriteSheetImage] =
    useState<HTMLImageElement | null>(null);

  const spriteSheetImage = useCanvasSelector(
    (state) => state.selectedSpritesheet
  );

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setSelectedSpriteSheetImage(image);
    };
    image.src = spriteSheetImage;
  }, [spriteSheetImage]);

  const size = useMemo(() => {
    if (!selectedSpriteSheetImage) return gridSize;
    const rows = Math.ceil(selectedSpriteSheetImage.height / gridSize.tileSize);
    const cols = Math.ceil(selectedSpriteSheetImage.width / gridSize.tileSize);
    return {
      rows,
      cols,
    };
  }, [selectedSpriteSheetImage, gridSize]);

  const { canvasRef } = useCanvasGrid(
    gridSize,
    'spredsheetDisplay',
    size.rows,
    size.cols
  );
  return (
    <Root>
      <Canvas ref={canvasRef} />
    </Root>
  );
};
