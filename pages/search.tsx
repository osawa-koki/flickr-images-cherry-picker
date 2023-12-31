/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { type FlickrPhotosSearchParams, createFlickr } from 'flickr-sdk'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Confetti from 'react-confetti'
import { Context } from './_app'
import ListedPhotos from '../components/ListedPhotos'
import SearchSetting from '../components/SearchSetting'
import ProgressViewer from '../components/ProgressViewer'
import { congratsMilliSeconds } from '../src/const'
import SearchPagination from '../components/SearchPagination'
import numStrSetter from '../src/numStrSetter'
import logger from '../src/Logger'

const flickr = createFlickr(process.env.NEXT_PUBLIC_FLICKR_API_KEY!)

const baseFlickrPhotosSearchParams: FlickrPhotosSearchParams = {
  sort: 'relevance',
  media: 'photos',
  content_type: '1',
  extras: 'url_q'
}

export default function SearchPage (): React.JSX.Element {
  const router = useRouter()

  const {
    setCurrentGroup,
    savedGroups,
    setSavedGroups,
    savedPhotos,
    setSavedPhotos
  } = useContext(Context)

  const [isLoading, setIsLoading] = useState(false)
  const [congrats, setCongrats] = useState(false)

  const [group, setGroup] = useState('')
  const [text, setText] = useState('')
  const [perPage, _setPerPage] = useState('30')
  const [objectiveCount, _setObjectiveCount] = useState('100')

  const [page, setPage] = useState(1)

  const setPerPage = (value: string): void => {
    numStrSetter(value, _setPerPage)
  }
  const setObjectiveCount = (value: string): void => {
    numStrSetter(value, _setObjectiveCount)
  }

  const [photos, setPhotos] = useState<FlickrPhoto[]>([])

  // ===== Parameter Setting =====

  useEffect(() => {
    if (router.query.group != null) setGroup(router.query.group as string)
    if (router.query.text != null) setText(router.query.text as string)
    if (router.query.perPage != null) _setPerPage(router.query.perPage as string)
    if (router.query.objectiveCount != null) _setObjectiveCount(router.query.objectiveCount as string)
  }, [router.query])

  useEffect(() => {
    if (group === '' || text === '' || perPage === '') return
    void router.push({
      pathname: router.pathname,
      query: {
        group,
        text,
        perPage,
        objectiveCount
      }
    })
  }, [group, text, perPage, objectiveCount])

  // ===== Search =====

  const fetchPhotos = (): void => {
    flickr.flickr('flickr.photos.search', {
      ...baseFlickrPhotosSearchParams,
      text,
      per_page: perPage.toString(),
      page: page.toString()
    })
      .then((res) => {
        setPhotos(res.photos.photo)
      })
      .catch((err) => {
        toast.error(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const search = (): void => {
    setIsLoading(true)
    if (group === '' || text === '' || perPage === '') {
      setPhotos([])
      setIsLoading(false)
      return
    }
    setCurrentGroup(group)
    setSavedGroups([...savedGroups, group])
    fetchPhotos()
    logger.info(`Searched!: group=${group}, text=${text}, perPage=${perPage}`)
  }

  // ===== State Management =====

  useEffect(() => {
    if (group === '' || text === '' || perPage === '') return
    fetchPhotos()
    window.scrollTo(0, 0)
  }, [page])

  const active = useMemo(() => {
    return group !== '' && text !== '' && perPage !== ''
  }, [group, text, perPage])

  useEffect(() => {
    setPhotos([])
  }, [group])

  useEffect(() => {
    if (Number(objectiveCount) === savedPhotos.length) {
      setCongrats(true)
      toast.success('Objective count reached!')
      logger.info('Objective count reached!')
      setTimeout(() => {
        setCongrats(false)
      }, congratsMilliSeconds)
    }
  }, [savedPhotos])

  return (
    <>
      {congrats && <Confetti />}
      <ProgressViewer
        active={photos.length > 0}
        objectiveCount={Number(objectiveCount)}
        selectedCount={savedPhotos.length}
      />
      <SearchSetting
        group={group}
        text={text}
        perPage={perPage}
        objectiveCount={objectiveCount}
        setGroup={setGroup}
        setText={setText}
        setPerPage={setPerPage}
        setObjectiveCount={setObjectiveCount}
      />
      <Button variant='primary' onClick={search} disabled={isLoading || !active}>Search</Button>
      <hr />
      <ListedPhotos
        photos={photos}
        selectedPhotos={savedPhotos}
        setSelectedPhotos={setSavedPhotos}
      />
      <SearchPagination
        page={page}
        setPage={setPage}
        perPage={Number(perPage)}
        active={photos.length > 0}
      />
    </>
  )
}

/* eslint-enable @typescript-eslint/no-non-null-assertion */
