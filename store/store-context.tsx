//% libs
import {createContext, Dispatch, PropsWithChildren, useReducer} from "react";
import type {CoffeeStoreT} from "../lib/coffee-stores";

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

type InitialStateT = {
  latLong: string;
  coffeeStores: (CoffeeStoreT & {imgUrl: string})[];
};
const initialState: InitialStateT = {
  latLong: "",
  coffeeStores: [],
};

const storeReducer = (
  state: InitialStateT,
  action: {type: string; payload: any}
) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return {...state, latLong: action.payload.latLong};
    }

    case ACTION_TYPES.SET_COFFEE_STORES: {
      return {...state, coffeeStores: action.payload.coffeeStores};
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

type StoreContextT = {
  state: InitialStateT;
  dispatch: Dispatch<{
    type: string;
    payload: any;
  }>;
};
export const StoreContext = createContext<StoreContextT>({
  state: {
    latLong: "",
    coffeeStores: [],
  },
  dispatch: () => {},
});

export const StoreProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  );
};
