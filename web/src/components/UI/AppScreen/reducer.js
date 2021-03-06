import { CLEAR_HOVER_ITEM, DROP_ITEM, MOVE_ITEM, SET_HOVER_ITEM, SET_INVENTORY, SET_INVENTORY_TYPE } from './actions';
import React from 'react';

export const initialState = {
  inventoryShow: 'single',
  player: {
    Type: 'player',
    Inventory: {},
  },
  secondary: {
    Type: 'secondary',
    Inventory: {},
  },
  drop: {
    Type: 'drop',
    Inventory: {},
  },
  stash: {
    Type: 'stash',
    Inventory: {},
  },
  vehicle: {
    Type: 'vehicle',
    Inventory: {},
  },
  glovebox: {
    Type: 'glovebox',
    Inventory: {},
  },
  hotbar: {
    Type: 'hotbar',
    Inventory: {},
  },
  equipment: {
    Type: 'equipment',
    Inventory: {},
  },
  search: {
    Type: 'search',
    Inventory: {},
  },
  hoverItem: null,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INVENTORY: {
      return {
        ...state,
        [action.payload.data['Type']]: {
          ...action.payload.data,
        },
      };
    }
    case SET_INVENTORY_TYPE: {
      return {
        ...state,
        inventoryShow: action.payload.invType,
      };
    }
    case SET_HOVER_ITEM: {
      return {
        ...state,
        hoverItem: {
          data: action.payload,
          Inventory: {
            '1': action.payload.item,
          },
        },
      };
    }
    case CLEAR_HOVER_ITEM: {
      return {
        ...state,
        hoverItem: null,
      };
    }
    case MOVE_ITEM: {
      const { data } = action.payload;
      if (data.typeFrom === data.typeTo && data.ownerFrom === data.ownerTo) {
        const newInv = { ...state[data.typeFrom] };
        const slotFrom = newInv.Inventory[data.slotFrom.toString()];
        const slotTo = newInv.Inventory[data.slotTo.toString()];
        if (slotTo == null || slotTo.Id === data.item.Id) {
          if (slotFrom.Count - data.item.Count <= 0) {
            newInv.Inventory[data.slotFrom.toString()] = undefined;
          } else {
            newInv.Inventory[data.slotFrom.toString()].Count -= data.item.Count;
          }
          if (newInv.Inventory[data.slotTo.toString()] == null) {
            newInv.Inventory[data.slotTo.toString()] = data.item;
          } else {
            slotTo.Count += data.item.Count;
            newInv.Inventory[data.slotTo.toString()] = slotTo;
          }
          return {
            ...state,
            [data.typeFrom]: {
              ...newInv,
            },
          };
        } else {
          return state;
        }
      } else {
        const fromInv = { ...state[data.typeFrom] };
        const toInv = { ...state[data.typeTo] };
        const slotFrom = fromInv.Inventory[data.slotFrom.toString()];
        const slotTo = toInv.Inventory[data.slotTo.toString()];
        if (slotTo == null || slotTo.Id === data.item.Id) {
          if (slotFrom.Count - data.item.Count <= 0) {
            fromInv.Inventory[data.slotFrom.toString()] = undefined;
          } else {
            fromInv.Inventory[data.slotFrom.toString()].Count -= data.item.Count;
          }
          if (toInv.Inventory[data.slotTo.toString()] == null) {
            toInv.Inventory[data.slotTo.toString()] = data.item;
          } else {
            slotTo.Count += data.item.Count;
            toInv.Inventory[data.slotTo.toString()] = slotTo;
          }
        }
        return {
          ...state,
          [data.typeFrom]: {
            ...fromInv,
          },
          [data.typeTo]: {
            ...toInv,
          },
        };
      }
    }
    case DROP_ITEM: {
      const { data } = action.payload;
      const newInv = { ...state[data.typeFrom] };
      if (newInv.Inventory[data.slotFrom.toString()].Count - data.item.Count <= 0) {
        newInv.Inventory[data.slotFrom.toString()] = undefined;
      } else {
        newInv.Inventory[data.slotFrom.toString()].Count -= data.item.Count;
      }
      return {
        ...state,
        [data.typeFrom]: { ...newInv }
      };
    }
    default:
      return state;
  }
};

export default inventoryReducer;
