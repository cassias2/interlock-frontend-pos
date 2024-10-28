import type { AppProps } from "next/app";
import { ReactElement } from "react";
import MainPage from "./app";

function App({ pageProps }: AppProps): ReactElement {
  return <MainPage {...pageProps} />;
}

export default App;
