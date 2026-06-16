import './Characters.scss'

import Header from '../../../components/Header'
import List from '../../../components/List'
import Button from '../../../components/Button'

import { supabase } from '../../../api/supabase'
import { useState, useEffect } from "react";

function Characters({ data }) {
  const [characters, setCharacters] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCharacters(data);
  }, [data]);

  const handleDelete = (id) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
    setDeletedIds(prev => [...prev, id]);

    // Optional: move back a page if current page becomes empty
    const newLength = characters.length - 1;
    const maxPage = Math.ceil(newLength / ITEMS_PER_PAGE);

    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  };

  const handleSave = async () => {
    if (!deletedIds.length) return;

    const { error } = await supabase
      .from("characters")
      .delete()
      .in("id", deletedIds);

    if (error) {
      console.error(error);
      return;
    }

    setDeletedIds([]);
    console.log("Saved!");
  };

  // Pagination
  const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);

  const paginatedCharacters = characters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log(currentPage)
  return (
    <>
      <Header />

      <div className="char-list">
        <Button text="Save Changes" onClick={handleSave} />

        <List
          items={paginatedCharacters}
          renderItem={(char) => (
            <li key={char.id} className="character-list">
              <div>
                <span>{char.name}</span>
                <p>{char.element_type}</p>
                <p>{char.weapon_type}</p>

                <Button
                  text="Edit"
                  onClick={() => console.log("handleEdit()")}
                />
                <Button
                  text="Delete"
                  onClick={() => handleDelete(char.id)}
                />
              </div>
            </li>
          )}
        />

        <div className="pagination">
          <Button
            text="Previous"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          />

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <Button
            text="Next"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          />
        </div>
      </div>
    </>
  );
}

export default Characters;