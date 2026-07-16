import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 10;

function usePagination(items) {
  
  const [page, setPage] = useState(1);
  
  const itemCount = items.length;
  const totalPages = Math.ceil(itemCount / ITEMS_PER_PAGE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(current => current === 1 ? current : 1);
  }, [itemCount]);

  const next = () => {
    setPage((current) => Math.min(current + 1, totalPages));
  };

  const prev = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  const currentItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return { 
    navigate : {
      next,
      prev
    },
    page: {
      current: page,
      total: totalPages,
      items: currentItems,
    }
  }
} 

export default usePagination