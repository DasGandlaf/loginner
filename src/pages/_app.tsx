import {type AppType} from "next/app";

import {api} from "~/utils/api";

import "~/styles/globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Head from "next/head";
import {useState} from "react";

let event = (element?: HTMLElement) => {
};

export function spot(element?: HTMLElement) {
  event(element)
}

function Spotlight() {
  const [ele, setEle] =
    useState<HTMLElement | undefined>(undefined);

  event = (element) => {
    requestAnimationFrame(() => {
      setEle(element)
    })
  }

  const rect = ele?.getBoundingClientRect()

  return (
    <div className={`hole-in-middle ${rect && 'show'}`}>
      <div
        className="hole"
        style={rect && {
          left: rect.left + rect.width / 2,
          top: rect.top + rect.height / 2,
          height: rect.height * 1.2,
          width: rect.width * 1.2
        }}
      />
    </div>
  );
}

const MyApp: AppType = ({
                          Component,
                          pageProps: {...pageProps},
                        }) => {
  return (
    <ClerkProvider {...pageProps}>
      <div className="overflow-hidden">
        <Spotlight></Spotlight>

        <Head>
          <title>Loginner</title>
          <meta name="description" content="The best app where you can login"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
