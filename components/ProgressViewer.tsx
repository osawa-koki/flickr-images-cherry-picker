import React, { useMemo } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'

interface Props {
  active: boolean
  selectedCount: number
  objectiveCount: number
}

export default function ProgressViewer (props: Props): React.JSX.Element {
  const { active, selectedCount, objectiveCount } = props

  const label = useMemo(() => {
    if (objectiveCount === 0) return '0%'
    return `${Math.floor(selectedCount / objectiveCount * 100)}%`
  }, [selectedCount, objectiveCount])

  if (!active) return <></>

  return (
    <div className='position-fixed top-0 start-0 end-0' style={{ zIndex: 1000 }}>
      <ProgressBar now={selectedCount} max={objectiveCount} label={label} />
    </div>
  )
}
