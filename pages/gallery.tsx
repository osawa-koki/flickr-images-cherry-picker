import React, { useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Button, Form } from 'react-bootstrap'
import { FaRegTrashAlt } from 'react-icons/fa'
import JSZip from 'jszip'
import { PhotosContext } from './_app'

export default function GalleryPage (): React.JSX.Element {
  const { getGroups, getPhotos, savePhotos } = useContext(PhotosContext)

  const [group, setGroup] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const generateZip = async (): Promise<void> => {
    const zip = new JSZip()

    const promises = photos.sort((a, b) => a.localeCompare(b)).map(async (photo, index) => {
      const blob = await fetch(photo).then(async (res) => await res.blob())
      const indexStr = index.toString().padStart(photos.length.toString().length, '0')
      zip.file(`${indexStr}.jpg`, blob)
    })
    await Promise.all(promises)

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${group}.zip`)
    document.body.appendChild(link)
    link.click()
  }

  useEffect(() => {
    setPhotos(getPhotos(group))
  }, [group])

  useEffect(() => {
    savePhotos(group, photos)
  }, [photos])

  const active = useMemo(() => {
    return group !== '' && photos.length > 0
  }, [group, photos])

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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button variant='primary' onClick={generateZip} disabled={!active}>Download</Button>
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
