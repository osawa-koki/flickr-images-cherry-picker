import React, { useContext, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { BsTrashFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import { Context } from './_app'
import { toast } from 'react-toastify'
import logger from '../src/Logger'
import execDownload from '../src/execDownload'

export default function GroupsPage (): React.JSX.Element {
  const { groups, setSavedGroups, execImport } = useContext(Context)

  const [tmpRenameGroup, setTmpRenameGroup] = useState<Record<string, string>>({})
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const renameGroup = (group: string): void => {
    const newGroup = tmpRenameGroup[group]
    if (newGroup == null || newGroup === '') return
    if (groups.map(({ key }) => key).includes(newGroup)) {
      toast.error(`Group "${newGroup}" already exists`)
      logger.error(`Group "${newGroup}" already exists`)
      return
    }
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
    setSelectedGroups(selectedGroups.filter((selectedGroup) => selectedGroup !== group))
  }

  const exportGroups = (): void => {
    const selected = groups.filter(({ key }) => selectedGroups.includes(key))
    const data: SharedData = {
      version: '1.0.0',
      date: new Date(),
      groups: selected.map(({ key, photos }) => {
        return {
          key,
          photos
        }
      })
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    execDownload(blob, `exported-${dayjs().format('YYYYMMDD_HHmmss')}.json`)
    toast.success(`Exported ${selectedGroups.length} group(s)`)
    logger.info(`Exported ${selectedGroups.length} group(s)`)
  }

  const importGroups = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.addEventListener('change', () => {
      if (input.files == null) return
      const file = input.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const data: SharedData = JSON.parse(reader.result as string)
        if (data.version !== '1.0.0') {
          toast.error(`Invalid version: ${data.version}`)
          logger.error(`Invalid version: ${data.version}`)
          return
        }
        if (data.groups == null) {
          toast.error('Invalid data')
          logger.error('Invalid data')
          return
        }
        execImport(data)
      })
      reader.readAsText(file)
    })
    input.click()
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>
              <Form.Check
                type='checkbox'
                checked={selectedGroups.length === groups.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedGroups(groups.map(({ key }) => key))
                  } else {
                    setSelectedGroups([])
                  }
                }}
              />
            </th>
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
                <td>
                  <Form.Check
                    type='checkbox'
                    checked={selectedGroups.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGroups([...selectedGroups, key])
                      } else {
                        setSelectedGroups(selectedGroups.filter((group) => group !== key))
                      }
                    }}
                  />
                </td>
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
      {selectedGroups.length > 0 && (
        <div className='d-flex'>
          <Button
            variant='danger'
            className='me-3'
            onClick={() => {
              if (!window.confirm(`Delete ${selectedGroups.length} group(s)?`)) return
              setSavedGroups(groups.filter(({ key }) => !selectedGroups.includes(key)).map(({ key }) => key))
              toast.success(`Deleted ${selectedGroups.length} group(s)`)
              logger.info(`Deleted ${selectedGroups.length} group(s)`)
              setSelectedGroups([])
            }}
          >
            Delete
          </Button>
          <Button
            variant='primary'
            onClick={exportGroups}
          >
            Export
          </Button>
        </div>
      )}
      <hr />
      <Button
        variant='primary'
        onClick={importGroups}
      >
        Import
      </Button>
    </>
  )
}
