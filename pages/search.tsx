/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { type FlickrPhotosSearchParams, createFlickr } from 'flickr-sdk'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { PhotosContext } from './_app'
import ListedPhotos from '../components/ListedPhotos'

const flickr = createFlickr(process.env.NEXT_PUBLIC_FLICKR_API_KEY!)

const baseFlickrPhotosSearchParams: FlickrPhotosSearchParams = {
  sort: 'relevance',
  media: 'photos',
  content_type: '1',
  extras: 'url_q'
}

export default function SearchPage (): React.JSX.Element {
  const {
    createGroup,
    getPhotos,
    savePhotos
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
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  const search = (): void => {
    setIsLoading(true)
    if (group === '' || text === '' || perPage === '') {
      setPhotos([])
      setIsLoading(false)
      return
    }
    createGroup(group)
    setSelectedPhotos(getPhotos(group))
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

  useEffect(() => {
    savePhotos(group, selectedPhotos)
  }, [selectedPhotos])

  return (
    <>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>Group</Form.Label>
        <Form.Control type='text' placeholder='Enter group' value={group} onChange={(e) => { setGroup(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>Search Text</Form.Label>
        <Form.Control type='text' placeholder='Enter search text' value={text} onChange={(e) => { setText(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlPerPage'>
        <Form.Label>Per Page</Form.Label>
        <Form.Control type='text' placeholder='Enter per page' value={perPage} onChange={(e) => { setPerPage(e.target.value) }} />
        <hr />
      </Form.Group>
      <Button variant='primary' onClick={search} disabled={isLoading || !active}>Search</Button>
      <hr />
      <ListedPhotos
        photos={photos}
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
      />
    </>
  )
}

/* eslint-enable @typescript-eslint/no-non-null-assertion */
