import React from 'react'
import { Button, Card } from 'react-bootstrap'
import ImageCard from './ImageCard'

interface Props {
  photos: FlickrPhoto[]
  selectedPhotos: string[]
  setSelectedPhotos: (selectedPhotos: string[]) => void
}

export default function PhotosList (props: Props): React.JSX.Element {
  const { photos, selectedPhotos, setSelectedPhotos } = props

  return (
    <>
      <div className='d-flex flex-wrap'>
        {photos.map((photo) => (
          <Card key={photo.url_q} className='m-2' style={{ width: `${photo.width_q}px` }}>
            <ImageCard
              src={photo.url_q}
              width={photo.width_q}
              height={photo.height_q}
            />
            <Card.Body>
              {selectedPhotos.includes(photo.url_q)
                ? (
                <Button size='sm' variant='danger' onClick={() => { setSelectedPhotos(selectedPhotos.filter((selectedPhoto) => selectedPhoto !== photo.url_q)) }}>Remove</Button>
                  )
                : (
                <Button size='sm' variant='primary' onClick={() => { setSelectedPhotos([...selectedPhotos, photo.url_q]) }}>Add</Button>
                  )
              }
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  )
}
