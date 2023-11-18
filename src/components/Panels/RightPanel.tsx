import styled from '@emotion/styled';
import { useCanvasSelector } from '../Providers/useCanvasSelector';
import { useCanvasGrid } from '../hooks/useCanvasGrid';
import { GridSize } from '../Providers/types';
import { useMemo } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { ImageUpload } from './ImageUpload';

const Root = styled.div`
  width: 250px;
`;
const Canvas = styled.canvas``;

export const RightPanel = () => {
  const gridSize: GridSize = useCanvasSelector((state) => state.grid);

  const selectedSpritesheetURL = useCanvasSelector(
    (state) =>
      state.spriteSheets.find((prev) => prev.id === state.selectedSpritesheetID)
        ?.url || null
  );

  const { image: selectedSpriteSheetImage } = useImageLoader(
    selectedSpritesheetURL,
    gridSize.tileSize,
    false,
    false
  );

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
      <ImageUpload tileSize={gridSize.tileSize} />
    </Root>
  );
};
