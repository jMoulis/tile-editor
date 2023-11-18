import styled from '@emotion/styled';
import { LeftPanel } from './Panels/LeftPanel';
import { CanvasScene } from './CanvasScene';
import { RightPanel } from './Panels/RightPanel';
import { CanvasProvider } from './Providers/CanvasContext';
import { Toolbar } from './Toolbar';

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
      <Toolbar />
      <Root>
        <LeftPanel />
        <CanvasScene />
        <RightPanel />
      </Root>
    </CanvasProvider>
  );
};
