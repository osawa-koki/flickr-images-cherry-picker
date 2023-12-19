import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
  group: string
  text: string
  perPage: string
  setGroup: (group: string) => void
  setText: (text: string) => void
  setPerPage: (perPage: string) => void
}

export default function SearchSetting (props: Props): React.JSX.Element {
  const { group, text, perPage, setGroup, setText, setPerPage } = props

  return (
    <>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>Group</Form.Label>
        <Form.Control type='text' placeholder='Enter group' value={group} onChange={(e) => { setGroup(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlText'>
        <Form.Label>Search Text</Form.Label>
        <Form.Control type='text' placeholder='Enter search text' value={text} onChange={(e) => { setText(e.target.value) }} />
      </Form.Group>
      <Form.Group className='mt-3' controlId='formControlPerPage'>
        <Form.Label>Per Page</Form.Label>
        <Form.Control type='text' placeholder='Enter per page' value={perPage} onChange={(e) => { setPerPage(e.target.value) }} />
        <hr />
      </Form.Group>
    </>
  )
}
