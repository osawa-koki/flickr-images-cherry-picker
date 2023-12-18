import React, { createContext } from 'react'
import { type AppProps } from 'next/app'
import Head from 'next/head'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../styles/style.scss'
import '../styles/menu.scss'

import setting from '../setting'
import Layout from '../components/Layout'

export const PhotosContext = createContext({
  getGroups: () => [] as string[],
  createGroup: (_group: string) => {},
  getPhotos: (_group: string) => [] as string[],
  savePhotos: (_group: string, _photos: string[]) => {}
})

const getLocalStorageKey = (group: string): string => `_group:${group}`
const isNotClient = typeof window === 'undefined'

export default function MyApp ({ Component, pageProps }: AppProps): React.JSX.Element {
  const getGroups = (): string[] => {
    if (isNotClient) return []
    const groups = Object.keys(localStorage)
    return groups.filter((group) => group.startsWith('_group:')).map((group) => group.replace(/^_group:/, ''))
  }

  const createGroup = (group: string): void => {
    if (isNotClient) return
    if (localStorage.getItem(getLocalStorageKey(group)) != null) {
      return
    }
    localStorage.setItem(getLocalStorageKey(group), JSON.stringify([]))
  }

  const getPhotos = (group: string): string[] => {
    if (isNotClient) return []
    const photosText = localStorage.getItem(getLocalStorageKey(group))
    if (photosText == null) {
      return []
    }
    const photos = JSON.parse(photosText)
    return photos
  }

  const savePhotos = (group: string, photos: string[]): void => {
    if (isNotClient) return
    if (group === '') {
      return
    }
    localStorage.setItem(getLocalStorageKey(group), JSON.stringify(photos))
  }

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
        <Component {...pageProps} />
      </PhotosContext.Provider>
        <ToastContainer />
      </Layout>
    </>
  )
}
