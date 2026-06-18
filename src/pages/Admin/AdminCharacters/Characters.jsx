import './Characters.scss'

import Header from '../../../components/Header'
import List from '../../../components/List'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal/Modal'
import Form from '../../../components/Form'

import { useState, useEffect } from "react";
import deleteRow from '../../../api/delete'
import updateRow from '../../../api/update'

const ITEMS_PER_PAGE = 10;
const dbName = "wuwa_characters"

function Characters({ data, reload }) {
  const [characters, setCharacters] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState({})
  const [modalState, setModalState] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(data)
  }, [data])

  const handleDelete = async (dbName, id) => {
    await deleteRow(dbName, deletedIds)

    setCharacters(prev => prev.filter(char => char.id !== id)) 
    setDeletedIds(prev => [...prev, id])

    const newLength = characters.length - 1;
    const maxPage = Math.ceil(newLength / ITEMS_PER_PAGE)

    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage)
    }
  }

  const handleDummy = () => {
    reload()
  }

  const handleCloseEdit = () => {
    setSelectedCharacter({})
    setModalState(false)
  }

  const handleOpenEdit = (e) => {
    const targetId = Number(e.target.dataset.id)
    const targetRow = characters.find(char => char.id === targetId)
    
    setSelectedCharacter(targetRow)
    setModalState(true)
  }

  const handleEditSubmit = async (data) => {

    const result = await updateRow(dbName, data)

    if (result.error) {
      console.error(result.error)
      return
    }
    console.log('Edited successfully')
    setModalState(false)
  }
  /* 
    const handleSaveEdit = (row) => {
      await updateRow()
    }
  */
  const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);

  const paginatedCharacters = characters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />

      <div className="char-list">
        <div className="tools">
          <Button text="Save" onClick={() => reload()} />
          <Button text="Fetch Latest" onClick={handleDummy} />
          <Button text="Add New" onClick={handleDummy} />
        </div>
        <div className="list-container">
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
                    onClick={(e) => handleOpenEdit(e)}
                    dataId={char.id}
                  />
                  <Button
                    text="Delete"
                    onClick={() => handleDelete(dbName, char.id)}
                  />
                </div>
              </li>
            )}
          />
        </div>


        <div className="pagination flex-row">
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
      <Modal 
        hidden={modalState}
        Content={ modalState && (
            <Form 
              data={characters}
              selected={selectedCharacter}
              close={() => handleCloseEdit()}
              submit={handleEditSubmit}
            />
        )}/>
    </>
  );
}

export default Characters;