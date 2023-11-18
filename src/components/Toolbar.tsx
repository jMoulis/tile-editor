import { setActivePointerTypeAction } from './Providers/actions';
import { useCanvasDispatch } from './Providers/useCanvasDispatch';

export const Toolbar = () => {
  const dispatch = useCanvasDispatch();
  return (
    <div>
      <button
        type='button'
        onClick={() => dispatch(setActivePointerTypeAction('eraser'))}>
        Eraser
      </button>
    </div>
  );
};
