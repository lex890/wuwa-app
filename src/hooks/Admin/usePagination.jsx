import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 10;

function usePagination(items) {
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const reset = () => {
      setPage(1);
    }

    if (page !== 1) {
      reset()
    }
  }, [items])
  
  const length = items.length - 1;
  const maxPage = Math.ceil(length / ITEMS_PER_PAGE)

  const next = (page) => {
    if (page >= maxPage) return
    setPage(page + 1)
  }
  const prev = (page) => {
    if (page <= 1) return
    setPage(page - 1)
  }


  return { 
  navigate : {
    next,
    prev
  },
   page
  }
} 

export default usePagination