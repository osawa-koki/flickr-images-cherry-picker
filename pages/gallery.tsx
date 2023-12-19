import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import JSZip from 'jszip'
import { PhotosContext } from './_app'
import imageFlipper from '../src/imageFlipper'
import imageRotater from '../src/imageRotater'
import DownloadSetting from '../components/DownloadSetting'
import PhotosGallery from '../components/PhotosGallery'

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
      <DownloadSetting
        flip={flip}
        rotate={rotate}
        rotateFrom={rotateFrom}
        rotateTo={rotateTo}
        rotateCount={rotateCount}
        setFlip={setFlip}
        setRotate={setRotate}
        setRotateFrom={setRotateFrom}
        setRotateTo={setRotateTo}
        setRotateCount={setRotateCount}
      />
      <hr />
      <PhotosGallery
        photos={photos}
        setPhotos={setPhotos}
      />
    </>
  )
}
