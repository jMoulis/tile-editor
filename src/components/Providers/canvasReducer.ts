import { CanvasActionTypes, CanvasActions, CanvasState, Layers, TilePlacement } from "./types";

export const canvasReducer = (state: CanvasState, action: CanvasActions) => {
  switch (action.type) {
    case CanvasActionTypes.SET_GRID_SIZE:
      return { ...state, grid: action.payload };
    case CanvasActionTypes.SELECT_SPRITESHEET_TILES:
      return { ...state, selectedSpritesheetTiles: action.payload };
    case CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES:
      return { ...state, selectedSpritesheetTiles: [...state.selectedSpritesheetTiles, action.payload] };
    case CanvasActionTypes.SET_SELECTED_SPRITESHEET_ID:
      return { ...state, selectedSpritesheetID: action.payload };
    case CanvasActionTypes.SET_SELECT_POINTER:
      return { ...state, pointer: action.payload };
    case CanvasActionTypes.SELECT_LAYER:
      return { ...state, selectedLayerIndex: action.payload };
    case CanvasActionTypes.ADD_LAYER: {
      return {
        ...state, layers: {
          ...state.layers, [action.payload.id]: action.payload
        }
      };
    }
    case CanvasActionTypes.REMOVE_LAYER: {
      const filteredKeys = Object.keys(state.layers).filter((key) => key !== action.payload);
      const updatedLayers = filteredKeys.reduce((acc: Layers, key) => {
        const layer = state.layers[key];
        if (layer) {
          return {
            ...acc,
            [layer.id]: layer
          }
        }
        return acc;
      }, {})

      return { ...state, layers: updatedLayers };
    }
    case CanvasActionTypes.MODIFY_LAYER: {
      const { layer, id } = action.payload;
      return {
        ...state,
        layers: {
          ...state.layers,
          [id]: layer
        }
      };
    }
    case CanvasActionTypes.UPSERT_TILE_TO_LAYER: {
      const { layerId, tilePlacement, shouldDelete } = action.payload;
      const layer = state.layers[layerId];

      if (!layer) return state;

      const updateOrAddTilePlacement = (prevTiles: TilePlacement[], newTilePlacement: TilePlacement, shouldDelete: boolean) => {

        const existingIndex = prevTiles.findIndex((tile) => tile.x === tilePlacement.x && tile.y === tilePlacement.y);

        if (existingIndex > -1) {
          if (shouldDelete) {
            return prevTiles.filter((_tile, index) => index !== existingIndex);
          }
          const updatedData = [...prevTiles];
          updatedData[existingIndex] = newTilePlacement;
          return updatedData;

        } else if (!shouldDelete) {
          return [...prevTiles, newTilePlacement];
        }
        return prevTiles
      }

      const updatedLayer = {
        [layerId]: {
          ...layer,
          data: updateOrAddTilePlacement(layer.data, tilePlacement, shouldDelete)
        }
      }

      return {
        ...state,
        layers: {
          ...state.layers,
          ...updatedLayer
        }
      }
    }
    case CanvasActionTypes.ADD_TILESET: {
      const updatedTilesets = {
        ...state.tilesets,
        [action.payload.id]: action.payload
      }
      return { ...state, tilesets: updatedTilesets };
    }
    case CanvasActionTypes.MODIFY_TILESET: {
      const updatedTilesets = {
        ...state.tilesets,
        [action.payload.tileset.id]: action.payload.tileset
      }
      return {
        ...state,
        tilesets: updatedTilesets,
      };
    }
    // Update available spritesheets
    case CanvasActionTypes.SET_SPRITE_SHEET:
      return {
        ...state,
        spriteSheets: [...state.spriteSheets, action.payload],
      };
    case CanvasActionTypes.ADD_SPRITE_SHEET:
      return {
        ...state,
        selectedSpritesheetID: action.payload.selected ? action.payload.spriteSheet.id : state.selectedSpritesheetID,
        spriteSheets: [...state.spriteSheets, action.payload.spriteSheet],
      };
    case CanvasActionTypes.DELETE_SPRITE_SHEET:
      return {
        ...state,
        spriteSheets: state.spriteSheets.filter(spriteSheet => spriteSheet.id !== action.payload),
      };
    case CanvasActionTypes.UPDATE_SPRITE_SHEET:
      return {
        ...state,
        spriteSheets: state.spriteSheets.map(spriteSheet =>
          spriteSheet.id === action.payload.id ? action.payload.spriteSheet : spriteSheet
        ),
      };
    default:
      return state;
  }
};
