import '@aws-amplify/ui-react/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../styles/style.scss'
import '../styles/menu.scss'

import React, { createContext, useEffect } from 'react'
import { type NextComponentType, type NextPageContext } from 'next'
import { type AppProps } from 'next/app'
import Head from 'next/head'

import { Amplify } from 'aws-amplify'
import { type WithAuthenticatorProps, withAuthenticator } from '@aws-amplify/ui-react'

import { Alert } from 'react-bootstrap'

import setting from '../setting'
import Layout from '../components/Layout'

import awsconfig from '../src/aws-exports'

Amplify.configure(awsconfig)

export const PhotosContext = createContext({
  getGroups: () => [] as string[],
  createGroup: (_group: string) => {},
  getPhotos: (_group: string) => [] as string[],
  savePhotos: (_group: string, _photos: string[]) => {}
})

function App ({ user, signOut, Component }: WithAuthenticatorProps & { pageProps: any, Component: NextComponentType<NextPageContext, any, any> }): React.JSX.Element {
  if (user == null) {
    return (
      <Alert variant='danger'>
        You are not signed in.
      </Alert>
    )
  }

  return (
    <>
      <Component user={user} signOut={signOut} />
    </>
  )
}

const getLocalStorageKey = (group: string): string => `_group:${group}`

export default function MyApp ({ Component, pageProps, router }: AppProps): React.JSX.Element {
  const getGroups = (): string[] => {
    const groups = Object.keys(localStorage)
    return groups.filter((group) => group.startsWith('_group:')).map((group) => group.replace(/^_group:/, ''))
  }

  const createGroup = (group: string): void => {
    if (localStorage.getItem(getLocalStorageKey(group)) != null) {
      return
    }
    localStorage.setItem(getLocalStorageKey(group), JSON.stringify([]))
  }

  const getPhotos = (group: string): string[] => {
    const photosText = localStorage.getItem(getLocalStorageKey(group))
    if (photosText == null) {
      return []
    }
    const photos = JSON.parse(photosText)
    return photos
  }

  const savePhotos = (group: string, photos: string[]): void => {
    if (group === '') {
      return
    }
    localStorage.setItem(getLocalStorageKey(group), JSON.stringify(photos))
  }

  useEffect(() => {
  }, [router.pathname])

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
      <Layout>
        <PhotosContext.Provider value={{
          getGroups,
          createGroup,
          getPhotos,
          savePhotos
        }}>
          {withAuthenticator(App)({ Component, pageProps })}
        </PhotosContext.Provider>
      </Layout>
    </>
  )
}
