import './Characters.scss'
import { useState, useEffect } from "react"

import { Header, List, Button, Modal, Form, Dropdown, Search, LineSeparator } from '../../../components/index'

import { Direction, Save, Fetch, Add, DotsIcon} from '../../../assets/components/index'

import { deleteRow, updateRow, addRow } from '../../../api/index'

import defaultImage from '../../../assets/webp/default_image.webp'

import useNotification from '@/hooks/Admin/useNotification'
import usePagination from '@/hooks/Admin/usePagination'
import useSearch from '@/hooks/Admin/useSearch'

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
  const [selectedCharacter, setSelectedCharacter] = useState({})
  const [editedRows, setEditedRows] = useState([])
  const [addedRows, setAddedRows]= useState([])

  const [modalState, setModalState] = useState(null)

  const [openDropdown, setOpenDropdown] = useState(null);

  const { 
    filterChar, 
    searchTerm, 
    updateSearch, 
  } = useSearch(data) 
  console.log(data)
  console.log(filterChar)
  const { 
    page,
    navigate
  } = usePagination(filterChar)

  const { 
    notif, 
    showMessage 
  } = useNotification()


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(data)
  }, [data])


  const handleReload = (truth) => {
    reload(truth)
    showMessage("New Data Fetched", "success")
  }

  const handleDelete = (dbName, id) => {
    setCharacters(prev => prev.filter(char => char.id !== id)) 
    setDeletedIds(prev => [...prev, id])
  }

  const handleSave = async () => {
    if (
      deletedIds.length === 0 &&
      editedRows.length === 0 &&
      addedRows.length === 0
    ) {
      return
    }

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
  const handleOpenEdit = (e, id) => { 
    const targetRow = characters.find(char => char.id === id)
    
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

  const filteredCharacters = characters.filter(char => {
    const search = searchTerm.toLowerCase();
    const searchNumber = Number(searchTerm);

    return (
      (!isNaN(searchNumber) && char.id === searchNumber) ||
      char.name?.toLowerCase().includes(search) ||
      char.weapon_type?.toLowerCase().includes(search) ||
      char.elemen_type?.toLowerCase().includes(search)
    );
  });
  const paginatedCharacters = filteredCharacters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);
  
  return (
    <>
      <Header />

      <div className="char-list">
        <LineSeparator />
        <div className="tools">
          <Search 
            search={searchTerm} 
            setSearch={updateSearch}
          />
          <div className="search-count">Total {characters.length}</div>
          <div className="container">
            <Button
              type="button"
              className="save-button"
              content={
                <>
                  <Save 
                    size="24" 
                    stroke="#ffffff"
                    fill="none" 
                  /> Save
                </>

              }
              onClick={handleSave}
            />
            <Button
              type="button"
              className="fetch-button"
              content={
                <>
                  <Fetch 
                    size="24" 
                    stroke="#ffffff"
                    fill="none"
                  /> Fetch
                </>
              }
              onClick={() => handleReload(true)}
            />
            <Button
              type="button"
              className="add-button"
              content={
                <>
                  <Add 
                    size="24" 
                    stroke="#ffffff"
                    fill="none"
                  /> Add New
                </>
              }
              onClick={handleOpenAdd}
            />

          </div>
        </div>
        
        <div className="list-container">
          <List
            items={paginatedCharacters}
            renderItem={(char) => (
              <li key={char.id} className="character-list">
                <div className='list-wrapper'>
                  <div className="char-icon">
                    <img 
                      src={char.icons?.RoleHeadIconBig ?? defaultImage} 
                      alt={char?.name ?? "Character icon"} 
                    />
                  </div>
                  <span>{char.id}</span>
                  <span>{char.name}</span>
                  <span>{char.elemen_type}</span>
                  <span>{char.weapon_type}</span>
                  <Dropdown 
                    key={char.id}
                    id={char.id}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    Icon={DotsIcon}
                  >
                    <Button
                      content="Edit"
                      onClick={(e) => handleOpenEdit(e, char.id)}
                    />

                    <Button
                      content="Delete"
                      onClick={() => handleDelete(dbName, char.id)}
                    />
                  </Dropdown>

                </div>
              </li>
            )}
          />
        </div>

        <div className="pagination flex-row">
          <Button
            content={
              <Direction  color="none" stroke="#949473" />
            }
            className={"left-button"}
            onClick={() => navigate.prev(page)}
            disabled={page === 1}
          />

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <Button
            content={
              <Direction  color="none" stroke="#949473" direction="right"/>
            }
            className={"right-button"}
            onClick={() => navigate.next(page)}
            disabled={page === totalPages || totalPages === 0}
          />
        </div>
      </div>
      <div 
        id="status-msg"             
        className={`view-card ${notif.status ? "show" : ""}`}
        style={{
          transform: notif.status ? "translateX(0)" : "translateX(220px)"
        }}
      >
        <div>
          <p style={{ color: notif.color }}>{notif.message}</p>
        </div>
        <span>
          <span style={{ background: notif.color }}/>
        </span>
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
    </>
  );
}

export default Characters;