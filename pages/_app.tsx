//% components
import {StoreProvider} from "../store/store-context";
// types
import type {AppProps} from "next/app";

//% styles
import "../styles/globals.css";

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
