import styled from '@emotion/styled';
import { LeftPanel } from './LeftPanel';
import { CanvasScene } from './CanvasScene';
import { RightPanel } from './RightPanel';
import { CanvasProvider } from './Providers/CanvasContext';

const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  overflow: hidden;
`;

export const TileEditor = () => {
  return (
    <CanvasProvider>
      <Root>
        <LeftPanel />
        <CanvasScene />
        <RightPanel />
      </Root>
    </CanvasProvider>
  );
};
