/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { type FlickrPhotosSearchParams, createFlickr } from 'flickr-sdk'
import { Button, Form } from 'react-bootstrap'

const flickr = createFlickr(process.env.NEXT_PUBLIC_FLICKR_API_KEY!)

const baseFlickrPhotosSearchParams: FlickrPhotosSearchParams = {
  sort: 'relevance',
  media: 'photos',
  content_type: '1',
  extras: 'url_q'
}

interface FlickrPhoto {
  id: string
  url_q: string
  width_q: number
  height_q: number
}

export default function FlickrPage (): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false)

  const [text, setText] = useState('')
  const [perPage, _setPerPage] = useState('500')
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
    if (text === '' || perPage === '') {
      setPhotos([])
      setIsLoading(false)
      return
    }
    flickr.flickr('flickr.photos.search', {
      ...baseFlickrPhotosSearchParams,
      text,
      per_page: perPage.toString()
    })
      .then((res) => {
        console.log(res.photos.photo)
        setPhotos(res.photos.photo)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const active = useMemo(() => {
    return text !== '' && perPage !== ''
  }, [text, perPage])

  return (
    <>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>Text</Form.Label>
        <Form.Control type='text' placeholder='Enter text' value={text} onChange={(e) => { setText(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlPerPage'>
        <Form.Label>Per Page</Form.Label>
        <Form.Control type='text' placeholder='Enter per page' value={perPage} onChange={(e) => { setPerPage(e.target.value) }} />
        <hr />
      </Form.Group>
      <Button variant='primary' onClick={search} disabled={isLoading || !active}>Search</Button>
      <hr />
      <div className='d-flex flex-wrap'>
        {photos.map((photo) => (
          <Image key={photo.id} alt={text} src={photo.url_q} width={photo.width_q} height={photo.height_q} />
        ))}
      </div>
    </>
  )
}
