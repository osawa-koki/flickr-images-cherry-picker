import React from 'react'
import Image from 'next/image'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Alert } from 'react-bootstrap'

interface Props {
  photos: string[]
  setPhotos: (photos: string[]) => void
  amplifiedPhotosCount: number
  active: boolean
}

export default function PhotosGallery (props: Props): React.JSX.Element {
  const { photos, setPhotos, amplifiedPhotosCount, active } = props

  if (photos.length === 0) {
    return (
      <Alert variant='warning' className='mt-3'>
        Please enter group and search photos.
      </Alert>
    )
  }

  if (!active) {
    return (
      <Alert variant='warning' className='mt-3'>
        Download setting is invalid.
      </Alert>
    )
  }

  return (
    <>
      <Alert variant='info' className='mt-3'>
        {photos.length} base photo(s)
        <br />
        {amplifiedPhotosCount} amplified photo(s) will be downloaded.
      </Alert>
      <div className='mt-3 d-flex flex-wrap'>
        {photos.map((photo) => (
          <div key={photo} className='position-relative d-block' style={{ width: '150px', height: '150px' }}>
            <Image alt='image' src={photo} width={150} height={150} className='position-absolute top-0 start-0 bottom-0 end-0' />
            <FaRegTrashAlt role='button' className='position-absolute text-danger top-0 end-0' onClick={() => {
              setPhotos(photos.filter((p) => p !== photo))
            }} />
          </div>
        ))}
      </div>
    </>
  )
}
