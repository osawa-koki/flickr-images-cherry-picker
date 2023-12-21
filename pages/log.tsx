import React, { useEffect, useState } from 'react'
import { Pagination, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import logger, { logLevel2Icon, type Log } from '../src/Logger'

export default function LogPage (): React.JSX.Element {
  const [page, setPage] = useState(1)
  const [logs, setLogs] = useState<Log[]>([])
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  useEffect(() => {
    const logs = logger.getLogs(page, 10)
    setLogs(logs.logs)
    setTotalPages(logs.totalPages)
    setTotalCount(logs.totalCount)
  }, [page])

  if (totalPages == null || totalCount == null) return (<></>)

  return (
    <>
      <h1>Log</h1>
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            return (
              <tr key={i}>
                <td>{dayjs(log.date).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>{logLevel2Icon(log.level)}</td>
                <td>{log.message}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => { setPage(1) }} />
        <Pagination.Prev onClick={() => { setPage(page - 1) }} disabled={page === 1} />
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1
          return (
            <Pagination.Item key={i} active={pageNumber === page} onClick={() => { setPage(pageNumber) }}>
              {pageNumber}
            </Pagination.Item>
          )
        })}
        <Pagination.Next onClick={() => { setPage(page + 1) }} disabled={page === totalPages} />
        <Pagination.Last onClick={() => { setPage(totalPages) }} />
      </Pagination>
    </>
  )
}
