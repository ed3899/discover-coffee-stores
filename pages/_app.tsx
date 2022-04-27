//% libs
import {createContext, Dispatch, PropsWithChildren, useReducer} from "react";
// types
import type {AppProps} from "next/app";

//% styles
import "../styles/globals.css";

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

type InitialStateT = {
  latLong: string;
  coffeeStores: any[];
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

const StoreProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  );
};

function MyApp({Component, pageProps}: AppProps) {
  return (
    <div>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}

export default MyApp;
