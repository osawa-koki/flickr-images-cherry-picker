import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'

interface Props {
  flip: boolean
  rotate: boolean
  rotateFrom: number
  rotateTo: number
  rotateCount: number
  setFlip: (flip: boolean) => void
  setRotate: (rotate: boolean) => void
  setRotateFrom: (rotateFrom: number) => void
  setRotateTo: (rotateTo: number) => void
  setRotateCount: (rotateCount: number) => void
}

export default function DownloadSetting (props: Props): React.JSX.Element {
  const {
    flip,
    rotate,
    rotateFrom,
    rotateTo,
    rotateCount,
    setFlip,
    setRotate,
    setRotateFrom,
    setRotateTo,
    setRotateCount
  } = props

  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <div className='my-3 p-3 bg-light'>
        <BsArrowsExpand role='button' onClick={() => { setIsOpen(true) }} />
      </div>
    )
  }

  return (
    <>
      <div className='my-3 p-3 bg-light'>
        <BsArrowsCollapse role='button' onClick={() => { setIsOpen(false) }} />
        <hr />
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
    </>
  )
}
