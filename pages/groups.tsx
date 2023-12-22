import React, { useContext, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { BsTrashFill } from 'react-icons/bs'
import { Context } from './_app'
import { toast } from 'react-toastify'
import logger from '../src/Logger'

export default function GroupsPage (): React.JSX.Element {
  const { groups, setSavedGroups } = useContext(Context)

  const [tmpRenameGroup, setTmpRenameGroup] = useState<Record<string, string>>({})

  const renameGroup = (group: string): void => {
    const newGroup = tmpRenameGroup[group]
    if (newGroup == null || newGroup === '') return
    setSavedGroups(groups.map(({ key, photos }) => {
      if (key !== group) return { key, photos }
      toast.success(`Renamed group "${group}" to "${newGroup}"`)
      logger.info(`Renamed group "${group}" to "${newGroup}"`)
      return { key: newGroup, photos }
    }).map(({ key }) => key))
  }

  const deleteGroup = (group: string): void => {
    if (!window.confirm(`Delete group "${group}"?`)) return
    setSavedGroups(groups.filter(({ key }) => key !== group).map(({ key }) => key))
    toast.success(`Deleted group "${group}"`)
    logger.info(`Deleted group "${group}"`)
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Group</th>
            <th>Photos</th>
            <th>Rename</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(({ key, photos }) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{photos.length}</td>
                <td className='d-flex'>
                  <Form.Control
                    type='text'
                    value={tmpRenameGroup[key] ?? key}
                    onChange={(e) => {
                      setTmpRenameGroup({
                        ...tmpRenameGroup,
                        [key]: e.target.value
                      })
                    }}
                  />
                  <Button
                    variant='primary'
                    size='sm'
                    className='ms-3'
                    onClick={() => { renameGroup(key) }}
                    disabled={tmpRenameGroup[key] == null || tmpRenameGroup[key] === ''}
                  >
                    Rename
                  </Button>
                </td>
                <td>
                  <BsTrashFill
                    className='text-danger'
                    role='button'
                    onClick={() => { deleteGroup(key) }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
