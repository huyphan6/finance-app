// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "../app/util/sessionProvider";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <SessionProvider>
                <Component {...pageProps} />
            </SessionProvider>
        </ChakraProvider>
    );
}

export default MyApp;
