import React, { useMemo } from 'react'
import Pagination from 'react-bootstrap/Pagination'

interface Props {
  active: boolean
  page: number
  setPage: (page: number) => void
  perPage: number
}

export default function SearchPagination (props: Props): React.JSX.Element {
  const { page, setPage, active } = props

  const pageItems = useMemo(() => {
    const items: React.JSX.Element[] = []
    if (page > 1) {
      items.push(
        <Pagination.Item key='prev' onClick={() => {
          setPage(1)
        }}>
          &lt;&lt;
        </Pagination.Item>
      )
    }
    for (let i = -3; i <= 3; i++) {
      const itemPage = page + i
      if (itemPage < 1) continue
      items.push(
        <Pagination.Item key={itemPage} active={itemPage === page} onClick={() => {
          setPage(itemPage)
        }}>
          {itemPage}
        </Pagination.Item>
      )
    }
    return items
  }, [page])

  if (!active) return <></>

  return (
    <>
      <Pagination className='justify-content-center'>
        {pageItems}
      </Pagination>
    </>
  )
}
