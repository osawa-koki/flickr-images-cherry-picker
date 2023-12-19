import React from 'react'
import Image from 'next/image'
import { FaRegTrashAlt } from 'react-icons/fa'

interface Props {
  photos: string[]
  setPhotos: (photos: string[]) => void
}

export default function PhotosGallery (props: Props): React.JSX.Element {
  const { photos, setPhotos } = props

  return (
    <>
      <div className='d-flex flex-wrap'>
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
