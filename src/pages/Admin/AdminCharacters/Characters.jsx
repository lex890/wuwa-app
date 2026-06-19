import './Characters.scss'

import Header from '../../../components/Header'
import List from '../../../components/List'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal/Modal'
import Form from '../../../components/Form'

import { useState, useEffect } from "react";
import deleteRow from '../../../api/delete'
import updateRow from '../../../api/update'
import addRow from '../../../api/add'

const ITEMS_PER_PAGE = 10;
const EMPTY_FORM = {
  id: '',
  name: '',
  weapon_type: '',
  quality_id: '',
  elemen_type: '',
  icon: ''
}
const dbName = "wuwa_characters"

function Characters({ data, reload }) {
  const [characters, setCharacters] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState({})
  const [editedRows, setEditedRows] = useState([])
  const [addedRows, setAddedRows]= useState([])

  const [modalState, setModalState] = useState(null)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(data)
  }, [data])

  const resetPage = () => {
    const newLength = characters.length - 1;
    const maxPage = Math.ceil(newLength / ITEMS_PER_PAGE)

    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage)
    }
  }

  const showMessage = (message, succ ,duration = 3000) => {
    setMessage(message)
    setSuccess(succ)
    setTimeout(() => {  
      setSuccess(false)
      setMessage("")
    }, duration)
  }

  const handleReload = (truth) => {
    reload(truth)
    resetPage() // recalculate page no.
    showMessage("Success", true)
  }

  const handleDelete = (dbName, id) => {
    setCharacters(prev => prev.filter(char => char.id !== id)) 
    setDeletedIds(prev => [...prev, id])
    
    resetPage()
  }

  const handleSave = async () => {

    if (deletedIds.length) {
      await deleteRow(dbName, deletedIds)
    }
    if (editedRows.length) {
      await updateRow(dbName, editedRows)
    }
    if (addedRows.length) {
      await addRow(dbName, addedRows)
    }

    handleReload(true)
  }

  const handleCloseEdit = () => {
    setSelectedCharacter({})
    setModalState(null)
  }
  const handleOpenEdit = (e) => {
    const targetId = Number(e.target.dataset.id)
    const targetRow = characters.find(char => char.id === targetId)
    
    setSelectedCharacter(targetRow)
    setModalState('edit')
  }
  const handleEditSubmit = async (data) => {

    // edit local state
    setCharacters(prev =>
      prev.map(char =>
        char.id === data.id
          ? data
          : char
      )
    )
    // add the id of the edited entry
    setEditedRows(prev => [
      ...prev.filter(row => row.id !== data.id),
      data
    ])

    setModalState(null)
  }

  const handleCloseAdd = () => {
    setModalState(null)
  }
  const handleOpenAdd = () => {
    setModalState('add')
  }
  const handleAddSubmit = (data) => {
    setCharacters(prev => [...prev, data])
    setAddedRows(prev => [...prev, data])

    setModalState(null)
  }

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
          <div className="search">
            <input type="text" />
          </div>
          <div>
            <Button text="Save" onClick={handleSave} />
            <Button text="Fetch Latest" onClick={() => handleReload(true)} />
            <Button text="Add New" onClick={handleOpenAdd} />
          </div>
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
        Content={
          <>
            { modalState  === 'edit' && (
              <Form 
                data={characters}
                selected={selectedCharacter}
                close={handleCloseEdit}
                submit={handleEditSubmit}
              />
            )}

            { modalState === 'add' && (
              <Form
                data={characters}
                selected={EMPTY_FORM}
                close={handleCloseAdd}
                submit={handleAddSubmit}
              />
            )}
          </>
            
        }/>
      {message && (
        <p id="status-msg" style={{ color: success ? "green" : "red" }}>
          {message}
        </p>
      )}
    </>
  );
}

export default Characters;