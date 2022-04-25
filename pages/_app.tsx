import "../styles/globals.css";
import type {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
      <footer>2021 Akita</footer>
    </div>
  );
}

export default MyApp;
