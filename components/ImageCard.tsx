import React, { useState } from 'react'
import Image from 'next/image'
import Modal from 'react-modal'
import { imageZoomRatio } from '../src/const'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 999
  }
}

interface Props {
  src: string
  width: number
  height: number
}

export default function ImageCard (props: Props): React.JSX.Element {
  Modal.setAppElement('#Modal')

  const { src, width, height } = props

  const [modalIsOpen, setIsOpen] = useState(false)

  const card = <div>
    <Image alt='image' src={src} width={width} height={height} onClick={() => { setIsOpen(true) }} />
  </div>

  if (modalIsOpen) {
    return (
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => { setIsOpen(false) }}
          style={customStyles}
          contentLabel='Image Modal'
        >
          <Image alt='image' src={src} width={width * imageZoomRatio} height={height * imageZoomRatio} />
        </Modal>
        {card}
      </>
    )
  }

  return card
}
