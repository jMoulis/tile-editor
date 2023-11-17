import { CanvasActionTypes, CanvasActions, CanvasState } from "./types";

export const canvasReducer = (state: CanvasState, action: CanvasActions) => {
  switch (action.type) {
    case CanvasActionTypes.SET_GRID_SIZE:
      return { ...state, grid: action.payload };
    case CanvasActionTypes.SELECT_MAIN_CANVAS_TILE:
      return { ...state, selectedMainCanvasTile: action.payload }
    case CanvasActionTypes.SELECT_SPRITESHEET_TILES:
      return { ...state, selectedSpritesheetTiles: action.payload };
    case CanvasActionTypes.ADD_TO_SELECTED_SPRITESHEET_TILES:
      return { ...state, selectedSpritesheetTiles: [...state.selectedSpritesheetTiles, action.payload] };
    case CanvasActionTypes.SET_SELECTED_TEXTURES:
      return { ...state, selectedTextures: action.payload };
    case CanvasActionTypes.ADD_TO_SELECTED_TEXTURES:
      return { ...state, selectedTextures: [...state.selectedTextures, action.payload] };
    case CanvasActionTypes.SET_SELECTED_SPRITESHEET:
      return { ...state, selectedSpritesheet: action.payload };
    case CanvasActionTypes.SET_SELECT_POINTER:
      return { ...state, pointer: action.payload };
    default:
      return state;
  }
};
