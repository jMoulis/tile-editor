import { Layer, SpriteSheet } from '../Providers/types';
import { v4 } from 'uuid';
import { useCanvasDispatch } from '../Providers/useCanvasDispatch';
import {
  addLayerAction,
  deleteSpriteSheetAction,
  removeLayerAction,
  selectLayerAction,
  setSelectedSpriteSheetIdAction,
} from '../Providers/actions';
import { useCanvasSelector } from '../Providers/useCanvasSelector';

export const LeftPanel = () => {
  const dispatch = useCanvasDispatch();
  const layers: Layer = useCanvasSelector((state) => state.layers);
  const spriteSheets: SpriteSheet[] = useCanvasSelector(
    (state) => state.spriteSheets
  );
  const current: Layer | null = useCanvasSelector((state) =>
    state.selectedLayerIndex ? state.layers[state.selectedLayerIndex] : null
  );

  const handleCreateLayer = () => {
    const id = v4();
    const newLayer: Layer = {
      id: id,
      name: `Layer: ${id.substring(0, 5)}`,
      type: 'tile',
      data: [],
      visible: true,
    };
    dispatch(addLayerAction(newLayer));
  };
  const handleSelectLayer = (layerID: string) => {
    dispatch(selectLayerAction(layerID));
  };

  const handleDeletetLayer = (layerID: string) => {
    dispatch(removeLayerAction(layerID));
  };
  const handleSelectspriteSheet = (spritesheetId: string) => {
    dispatch(setSelectedSpriteSheetIdAction(spritesheetId));
  };

  const handleDeletetspriteSheet = (spritesheetId: string) => {
    dispatch(deleteSpriteSheetAction(spritesheetId));
  };

  return (
    <div>
      <button type='button' onClick={handleCreateLayer}>
        Create layer
      </button>
      {current ? <span>{current.name}</span> : null}
      <ul>
        {Object.values(layers).map((layer) => (
          <li key={layer.id}>
            <button type='button' onClick={() => handleSelectLayer(layer.id)}>
              {layer.name}
            </button>
            <button type='button' onClick={() => handleDeletetLayer(layer.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <ul>
        {spriteSheets.map((spriteSheet) => (
          <li key={spriteSheet.id}>
            <button
              type='button'
              onClick={() => handleSelectspriteSheet(spriteSheet.id)}>
              {spriteSheet.name}
            </button>
            <button
              type='button'
              onClick={() => handleDeletetspriteSheet(spriteSheet.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
