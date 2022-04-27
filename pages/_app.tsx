//% libs
import {createContext, PropsWithChildren} from "react";
// types
import type {AppProps} from "next/app";

//% styles
import "../styles/globals.css";

const StoreContext = createContext({});

const StoreProvider = ({children}: PropsWithChildren<{}>) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };
  return (
    <StoreContext.Provider value={initialState}>
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
