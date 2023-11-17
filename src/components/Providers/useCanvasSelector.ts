import { useCallback, useContext } from 'react';
import { CanvasContext } from './CanvasContext';
import { CanvasState } from './types';

export const useCanvasSelector = (selector: (state: CanvasState) => any) => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasSelector must be used within a CanvasProvider');
  }
  const callback = useCallback((canvasState: CanvasState) => {
    return selector(canvasState)
  }, [selector]);

  return callback(context.state);
};
