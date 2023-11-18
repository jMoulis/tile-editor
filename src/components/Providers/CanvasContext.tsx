import { createContext, useReducer } from 'react';
import { canvasReducer } from './canvasReducer';
import { CanvasActions, CanvasState } from './types';
import { DEFAULT_MAP_SIZE } from '../constants';

const initialState: CanvasState = {
  grid: DEFAULT_MAP_SIZE,
  selectedSpritesheetTiles: [],
  selectedSpritesheetID: null,
  pointer: 'brush',
  layers: {},
  tilesets: {},
  selectedLayerIndex: null,
  spriteSheets: [],
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
