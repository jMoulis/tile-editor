import styled from '@emotion/styled';
import { useCanvasSelector } from './Providers/useCanvasSelector';
import { useCanvasGrid } from './hooks/useCanvasGrid';
import { GridSize } from './types';

const Root = styled.div`
  width: 250px;
`;
const Canvas = styled.canvas``;
export const RightPanel = () => {
  const gridSize: GridSize = useCanvasSelector((state) => state.grid);
  const { canvasRef } = useCanvasGrid(gridSize, 'spredsheetDisplay');
  return (
    <Root>
      <Canvas ref={canvasRef} />
    </Root>
  );
};
