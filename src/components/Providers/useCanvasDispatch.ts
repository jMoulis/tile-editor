import { useCallback, useContext } from 'react';
import { CanvasContext } from './CanvasContext';
import { CanvasActions } from './types';

export const useCanvasDispatch = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasDispatch must be used within a CanvasProvider');
  }
  const dispatch = useCallback((params: CanvasActions) => context.dispatch(params), [context]);

  return dispatch;
};
