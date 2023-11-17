import styled from '@emotion/styled';
import { useCanvasSelector } from './Providers/useCanvasSelector';
import { useCanvasGrid } from './hooks/useCanvasGrid';
import { GridSize } from './Providers/types';

const Root = styled.div`
  width: calc(100vw - 500px);
  height: 100vh;
`;
const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const CanvasScene = () => {
  const gridSize: GridSize = useCanvasSelector((state) => state.grid);
  const { canvasRef } = useCanvasGrid(
    gridSize,
    'main',
    gridSize.rows,
    gridSize.cols
  );
  return (
    <Root>
      <Canvas id='canvas-scene' ref={canvasRef} />
    </Root>
  );
};
