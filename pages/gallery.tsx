import React, { useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Button, Form } from 'react-bootstrap'
import { FaRegTrashAlt } from 'react-icons/fa'
import JSZip from 'jszip'
import { PhotosContext } from './_app'
import imageFlipper from '../src/imageFlipper'
import imageRotater from '../src/imageRotater'

export default function GalleryPage (): React.JSX.Element {
  const { getGroups, getPhotos, savePhotos } = useContext(PhotosContext)

  const groups = useMemo(() => {
    return getGroups()
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  const [group, setGroup] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const [flip, setFlip] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [rotateFrom, setRotateFrom] = useState(-20)
  const [rotateTo, setRotateTo] = useState(20)
  const [rotateCount, setRotateCount] = useState(5)

  const generateZip = async (): Promise<void> => {
    setIsLoading(true)

    const zip = new JSZip()

    const promises = photos.sort((a, b) => a.localeCompare(b)).map(async (photo, index) => {
      const blob = await fetch(photo).then(async (res) => await res.blob())
      const indexStr = index.toString().padStart(photos.length.toString().length, '0')
      zip.file(`${indexStr}.jpg`, blob)

      if (flip) {
        const flippedBlob = await imageFlipper(blob)
        zip.file(`${indexStr}-flipped.jpg`, flippedBlob)
      }

      if (rotate) {
        const ratetedBlobs = await imageRotater(blob, rotateFrom, rotateTo, rotateCount)
        ratetedBlobs.forEach((blob, i) => {
          zip.file(`${indexStr}-rotated-${i}.jpg`, blob)
        })
      }
    })
    await Promise.all(promises)

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${group}.zip`)
    document.body.appendChild(link)
    link.click()

    setIsLoading(false)
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
          {groups.map((group) => (
            <option key={group}>{group}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <hr />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button variant='primary' onClick={generateZip} disabled={!active || isLoading}>Download</Button>
      <div className='my-3 p-3 bg-light'>
        <Form.Group controlId='formControlFlip'>
          <Form.Check type='checkbox' label='Flip' checked={flip} onChange={(event) => {
            setFlip(event.target.checked)
          }} />
        </Form.Group>
        <Form.Group controlId='formControlRotate'>
          <Form.Check type='checkbox' label='Rotate' checked={rotate} onChange={(event) => {
            setRotate(event.target.checked)
          }} />
        </Form.Group>
        {rotate && (
          <>
            <Form.Group controlId='formControlRotateFrom'>
              <Form.Label>From</Form.Label>
              <Form.Control type='number' placeholder='From' value={rotateFrom} onChange={(event) => {
                setRotateFrom(parseInt(event.target.value))
              }} />
            </Form.Group>
            <Form.Group controlId='formControlRotateTo'>
              <Form.Label>To</Form.Label>
              <Form.Control type='number' placeholder='To' value={rotateTo} onChange={(event) => {
                setRotateTo(parseInt(event.target.value))
              }} />
            </Form.Group>
            <Form.Group controlId='formControlRotateCount'>
              <Form.Label>Count</Form.Label>
              <Form.Control type='number' placeholder='Count' value={rotateCount} onChange={(event) => {
                setRotateCount(parseInt(event.target.value))
              }} />
            </Form.Group>
          </>
        )}
      </div>
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
