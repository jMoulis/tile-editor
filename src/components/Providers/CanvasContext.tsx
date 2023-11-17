import { createContext, useReducer } from 'react';
import { canvasReducer } from './canvasReducer';
import { CanvasActions, CanvasState } from './types';
import { DEFAULT_MAP_SIZE } from '../constants';
import defaultSpritesheet from '../../assets/Overworld.png';

const initialState: CanvasState = {
  grid: DEFAULT_MAP_SIZE,
  selectedMainCanvasTile: null,
  selectedSpritesheetTiles: [],
  hoveredMainCanvasTile: null,
  hoveredSpritesheetTile: null,
  selectedSpritesheet: defaultSpritesheet,
  selectedTextures: [],
  pointer: 'brush',
};

const defaultCanvasContext: {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasActions>;
} = {
  state: initialState,
  dispatch: () => {},
};
export const CanvasContext = createContext(defaultCanvasContext);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
};
