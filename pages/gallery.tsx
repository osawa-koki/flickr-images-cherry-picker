import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { PhotosContext } from './_app'
import DownloadSetting from '../components/DownloadSetting'
import PhotosGallery from '../components/PhotosGallery'
import generateZip from '../src/generateZip'
import execDownload from '../src/execDownload'

export default function GalleryPage (): React.JSX.Element {
  const {
    currentGroup,
    setCurrentGroup,
    savedGroups,
    savedPhotos,
    setSavedPhotos
  } = useContext(PhotosContext)

  const [isLoading, setIsLoading] = useState(false)

  const [flip, setFlip] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [rotateFrom, setRotateFrom] = useState(-20)
  const [rotateTo, setRotateTo] = useState(20)
  const [rotateCount, setRotateCount] = useState(5)

  const downloadZip = async (): Promise<void> => {
    setIsLoading(true)

    const blob = await generateZip({
      photos: savedPhotos,
      flip,
      rotate,
      rotateFrom,
      rotateTo,
      rotateCount
    })
    execDownload(blob, `${currentGroup}.zip`)

    setIsLoading(false)
  }

  useEffect(() => {
    setSavedPhotos(savedPhotos)
  }, [currentGroup])

  const active = useMemo(() => {
    return currentGroup !== '' && savedPhotos.length > 0
  }, [currentGroup, savedPhotos])

  return (
    <>
      <Form.Group controlId='formControlGroup'>
        <Form.Label>Group</Form.Label>
        <Form.Control as='select' onChange={(event) => {
          setCurrentGroup(event.target.value)
        }}>
          <option value=''>Select a group</option>
          {savedGroups.map((group) => (
            <option key={group}>{group}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <hr />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button variant='primary' onClick={downloadZip} disabled={!active || isLoading}>Download</Button>
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
        photos={savedPhotos}
        setPhotos={setSavedPhotos}
      />
    </>
  )
}
