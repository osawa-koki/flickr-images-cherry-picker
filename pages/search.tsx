/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { type FlickrPhotosSearchParams, createFlickr } from 'flickr-sdk'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { PhotosContext } from './_app'
import ListedPhotos from '../components/ListedPhotos'
import SearchSetting from '../components/SearchSetting'

const flickr = createFlickr(process.env.NEXT_PUBLIC_FLICKR_API_KEY!)

const baseFlickrPhotosSearchParams: FlickrPhotosSearchParams = {
  sort: 'relevance',
  media: 'photos',
  content_type: '1',
  extras: 'url_q'
}

export default function SearchPage (): React.JSX.Element {
  const {
    setCurrentGroup,
    savedGroups,
    setSavedGroups,
    savedPhotos,
    setSavedPhotos
  } = useContext(PhotosContext)

  const [isLoading, setIsLoading] = useState(false)

  const [group, setGroup] = useState('')
  const [text, setText] = useState('')
  const [perPage, _setPerPage] = useState('100')
  const setPerPage = (value: string): void => {
    if (value === '') {
      _setPerPage('')
      return
    }
    const num = Number(value)
    if (Number.isNaN(num)) {
      return
    }
    _setPerPage(num.toString())
  }

  const [photos, setPhotos] = useState<FlickrPhoto[]>([])

  const search = (): void => {
    setIsLoading(true)
    if (group === '' || text === '' || perPage === '') {
      setPhotos([])
      setIsLoading(false)
      return
    }
    setCurrentGroup(group)
    setSavedGroups([...savedGroups, group])
    flickr.flickr('flickr.photos.search', {
      ...baseFlickrPhotosSearchParams,
      text,
      per_page: perPage.toString()
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

  const active = useMemo(() => {
    return group !== '' && text !== '' && perPage !== ''
  }, [group, text, perPage])

  useEffect(() => {
    setPhotos([])
  }, [group])

  return (
    <>
      <SearchSetting
        group={group}
        text={text}
        perPage={perPage}
        setGroup={setGroup}
        setText={setText}
        setPerPage={setPerPage}
      />
      <Button variant='primary' onClick={search} disabled={isLoading || !active}>Search</Button>
      <hr />
      <ListedPhotos
        photos={photos}
        selectedPhotos={savedPhotos}
        setSelectedPhotos={setSavedPhotos}
      />
    </>
  )
}

/* eslint-enable @typescript-eslint/no-non-null-assertion */
