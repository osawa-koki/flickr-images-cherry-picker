import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Form } from 'react-bootstrap'
import { FaRegTrashAlt } from 'react-icons/fa'
import { PhotosContext } from './_app'

export default function GalleryPage (): React.JSX.Element {
  const { getGroups, getPhotos, savePhotos } = useContext(PhotosContext)

  const [group, setGroup] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    setPhotos(getPhotos(group))
  }, [group])

  useEffect(() => {
    savePhotos(group, photos)
  }, [photos])

  return (
    <>
      <Form.Group controlId='formControlGroup'>
        <Form.Label>Group</Form.Label>
        <Form.Control as='select' onChange={(event) => {
          setGroup(event.target.value)
        }}>
          <option value=''>Select a group</option>
          {getGroups().map((group) => (
            <option key={group}>{group}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <hr />
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
