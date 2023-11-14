import React, { createContext, useEffect, useState } from 'react'
import { type AppProps } from 'next/app'
import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/style.scss'
import '../styles/menu.scss'

import setting from '../setting'
import Layout from '../components/Layout'

const localStorageKeys = {
  accessToken: 'AccessToken'
}

export const CognitoUserContext = createContext<{
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}>({
  accessToken: null,
  setAccessToken: () => {}
})

export default function MyApp ({ Component, pageProps }: AppProps): React.JSX.Element {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem(localStorageKeys.accessToken)
    if (accessToken != null) {
      setAccessToken(JSON.parse(accessToken))
    }
  }, [])

  useEffect(() => {
    if (accessToken != null) {
      localStorage.setItem(localStorageKeys.accessToken, JSON.stringify(accessToken))
    } else {
      localStorage.removeItem(localStorageKeys.accessToken)
    }
  }, [accessToken])

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>{setting.title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link
          rel='icon'
          type='image/png'
          href={`${setting.basePath}/favicon.ico`}
        />
      </Head>
      <CognitoUserContext.Provider value={{
        accessToken,
        setAccessToken
      }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CognitoUserContext.Provider>
    </>
  )
}
