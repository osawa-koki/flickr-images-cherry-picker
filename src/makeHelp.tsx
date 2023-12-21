import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { IoIosHelpCircle } from 'react-icons/io'
import { overlayTriggerDelayHide, overlayTriggerDelayShow } from './const'

export default function makeHelp (message: string): React.JSX.Element {
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: overlayTriggerDelayShow, hide: overlayTriggerDelayHide }}
      overlay={(props) => (
        <Tooltip {...props}>
          {message}
        </Tooltip>
      )}
    >
      <span><IoIosHelpCircle className='text-info m-1' /></span>
    </OverlayTrigger>
  )
}
