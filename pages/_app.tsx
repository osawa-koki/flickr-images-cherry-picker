import React, { createContext, useEffect, useState } from 'react'
import { type AppProps } from 'next/app'
import Head from 'next/head'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../styles/style.scss'
import '../styles/menu.scss'

import setting from '../setting'
import Layout from '../components/Layout'
import { Spinner } from 'react-bootstrap'

export const PhotosContext = createContext({
  currentGroup: '',
  setCurrentGroup: (_group: string) => {},
  savedGroups: [] as string[],
  setSavedGroups: (_groups: string[]) => {},
  savedPhotos: [] as string[],
  setSavedPhotos: (_photos: string[]) => {}
})

const localStorageKeyPrefix = '_group:'
const getLocalStorageKey = (group: string): string => `${localStorageKeyPrefix}${group}`

export default function MyApp ({ Component, pageProps }: AppProps): React.JSX.Element {
  const [currentGroup, setCurrentGroup] = useState<string>('')
  const [savedGroups, _setSavedGroups] = useState<string[] | null>(null)
  const setSavedGroups = (groups: string[]): void => {
    _setSavedGroups([...new Set(groups.sort())])
  }
  const [savedPhotos, setSavedPhotos] = useState<string[]>([])

  useEffect(() => {
    const groups = Object.keys(localStorage).filter((key) => {
      return key.startsWith(localStorageKeyPrefix)
    }).map((key) => {
      return key.replace(localStorageKeyPrefix, '')
    })
    setSavedGroups(groups)
  }, [])

  useEffect(() => {
    const photos = localStorage.getItem(getLocalStorageKey(currentGroup))
    if (photos == null) {
      setSavedPhotos([])
      return
    }
    setSavedPhotos(JSON.parse(photos))
  }, [currentGroup])

  useEffect(() => {
    const sortedSavedPhotos = savedPhotos.sort()
    localStorage.setItem(getLocalStorageKey(currentGroup), JSON.stringify(sortedSavedPhotos))
  }, [savedPhotos])

  if (savedGroups == null) {
    return <Spinner animation='border' />
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
        currentGroup,
        setCurrentGroup,
        savedGroups,
        setSavedGroups,
        savedPhotos,
        setSavedPhotos
      }}>
        <Component {...pageProps} />
      </PhotosContext.Provider>
        <ToastContainer />
      </Layout>
    </>
  )
}
