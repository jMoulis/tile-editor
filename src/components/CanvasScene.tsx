import styled from '@emotion/styled';
import { useCanvasSelector } from './Providers/useCanvasSelector';
import { useCanvasGrid } from './hooks/useCanvasGrid';
import { GridSize } from './types';

const Root = styled.div`
  width: calc(100vw - 500px); // Adjust as needed
  height: 100vh;
`;
const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.7); // Container background */
`;

export const CanvasScene = () => {
  const gridSize: GridSize = useCanvasSelector((state) => state.grid);
  const { canvasRef } = useCanvasGrid(gridSize, 'main');
  return (
    <Root>
      <Canvas id='canvas-scene' ref={canvasRef} />
    </Root>
  );
};
