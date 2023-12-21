import React, { useContext } from 'react'
import { Form } from 'react-bootstrap'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify'
import { Context } from '../pages/_app'
import { forbiddenChars } from '../src/const'
import logger from '../src/Logger'
import makeHelp from '../src/makeHelp'

interface Props {
  group: string
  text: string
  perPage: string
  objectiveCount: string
  setGroup: (group: string) => void
  setText: (text: string) => void
  setPerPage: (perPage: string) => void
  setObjectiveCount: (objectiveCount: string) => void
}

export default function SearchSetting (props: Props): React.JSX.Element {
  const { setCurrentGroup, savedGroups, setSavedGroups } = useContext(Context)

  const { group, text, perPage, objectiveCount, setGroup, setText, setPerPage, setObjectiveCount } = props

  return (
    <>
      <Form.Group className='mt-3' controlId='formControlGroup'>
        <Form.Label>
          Group
          {makeHelp('Group is used to save photos to a specific folder.')}
        </Form.Label>
        <CreatableSelect
          options={savedGroups.map((group) => {
            return { value: group, label: group }
          })}
          value={{ value: group, label: group }}
          onChange={(value) => {
            if (value == null) {
              setGroup('')
              return
            }
            setGroup(value.value)
          }}
          onCreateOption={(value) => {
            setGroup(value)
            setCurrentGroup(value)
            setSavedGroups([...savedGroups, value])
            toast.info(`Group '${value}' is created.`)
            logger.info(`Group '${value}' is created.`)
          }}
          isValidNewOption={(inputValue) => {
            if (inputValue === '') return false
            if (savedGroups.includes(inputValue)) return false
            if (forbiddenChars.some((char) => inputValue.includes(char))) {
              toast.error(`Group name cannot include '${forbiddenChars.join(', ')}'.`)
              return false
            }
            return true
          }}
        />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>
          Search Text
          {makeHelp('Search text is used to search photos from Flickr.')}
        </Form.Label>
        <Form.Control type='text' placeholder='Enter search text' value={text} onChange={(e) => { setText(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlPerPage'>
        <Form.Label>
          Per Page
          {makeHelp('Per page is used to limit the number of photos to be searched.')}
        </Form.Label>
        <Form.Control type='text' placeholder='Enter per page' value={perPage} onChange={(e) => { setPerPage(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlObjectiveCount'>
        <Form.Label>
          Objective Count
          {makeHelp('Objective count is used to check if the number of photos is enough.')}
        </Form.Label>
        <Form.Control type='text' placeholder='Enter objective count' value={objectiveCount} onChange={(e) => { setObjectiveCount(e.target.value) }} />
      </Form.Group>
      <hr />
    </>
  )
}
