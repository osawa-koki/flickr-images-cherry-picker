import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form } from 'react-bootstrap'
import { PhotosContext } from './_app'
import DownloadSetting from '../components/DownloadSetting'
import PhotosGallery from '../components/PhotosGallery'
import generateZip from '../src/generateZip'
import execDownload from '../src/execDownload'
import amplifiedPhotosCounter from '../src/amplifiedPhotosCounter'
import { toast } from 'react-toastify'

export default function GalleryPage (): React.JSX.Element {
  const router = useRouter()

  const {
    currentGroup,
    setCurrentGroup,
    savedGroups,
    setSavedGroups,
    savedPhotos,
    setSavedPhotos
  } = useContext(PhotosContext)

  const [isLoading, setIsLoading] = useState(false)

  const [flip, setFlip] = useState(true)
  const [rotate, setRotate] = useState(true)
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

  const deleteGroup = async (): Promise<void> => {
    if (!window.confirm(`Are you sure to delete group "${currentGroup}"?`)) return
    setSavedGroups(savedGroups.filter((group) => group !== currentGroup))
    await router.push('/search/')
    toast.success(`Group "${currentGroup}" deleted.`)
  }

  useEffect(() => {
    setSavedPhotos(savedPhotos)
  }, [currentGroup])

  const active = useMemo(() => {
    if (currentGroup === '' || savedPhotos.length <= 0) return false
    if (rotate && (Number.isNaN(rotateFrom) || Number.isNaN(rotateTo) || Number.isNaN(rotateCount))) return false
    return true
  }, [currentGroup, savedPhotos, rotate, rotateFrom, rotateTo, rotateCount])

  return (
    <>
      <Form.Group controlId='formControlGroup'>
        <Form.Label>Group</Form.Label>
        <Form.Control as='select' value={currentGroup} onChange={(event) => {
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
        amplifiedPhotosCount={amplifiedPhotosCounter(
          savedPhotos.length,
          flip,
          rotate,
          rotateCount
        )}
        active={active}
      />
      <hr />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      {currentGroup !== '' && <Button variant='danger' onClick={deleteGroup}>Delete</Button>}
    </>
  )
}
