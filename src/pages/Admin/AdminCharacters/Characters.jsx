import './Characters.scss'

import Header from '../../../components/Header'
import List from '../../../components/List'
import Button from '../../../components/Button'

import { useState, useEffect } from "react";
import deleteRow from '../../../api/delete'
import updateRow from '../../../api/update'

function Characters({ data }) {
  const [characters, setCharacters] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [row, setRowChanges] = useState()

  const ITEMS_PER_PAGE = 10;
  const dbName = "wuwa_characters"

  useEffect(() => {
    setCharacters(data)
  }, [data])

  const handleDelete = (dbName, id) => {
    setCharacters(prev => prev.filter(char => char.id !== id)) 
    setDeletedIds(prev => [...prev, id])

    const newLength = characters.length - 1;
    const maxPage = Math.ceil(newLength / ITEMS_PER_PAGE)

    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage)
    }
  }

  const handleSave = async () => {
    if (!deletedIds.length) return
    await deleteRow(dbName, deletedIds)
    setDeletedIds([])
    handleFetch()
    console.log("Saved!");
  }

  const handleFetch = () => {
    localStorage.clear()
  }

  const handleEdit = () => {
    const newLength = characters.length - 1
    const maxPage = Math.ceil(newLength / ITEMS_PER_PAGE)
    setCurrentPage(maxPage)
    console.log(characters)
    // await updateRow()
  }

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
        <div id="tools">
          <Button text="Save Changes" onClick={handleSave} />
          <Button text="Fetch Latest" onClick={handleFetch} />
          <Button text="Add New" onClick={handleFetch} />
        </div>
        
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
                  onClick={() => handleEdit()}
                />
                <Button
                  text="Delete"
                  onClick={() => handleDelete(dbName, char.id)}
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