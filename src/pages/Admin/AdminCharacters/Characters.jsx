import './Characters.scss'

import { Header, Button, Search, LineSeparator } from '../../../components/index'

import { Direction, Save, Fetch, Add} from '../../../assets/components/index'



import useCharacterData from '@/hooks/Admin/useCharacterData'
import useNotification from '@/hooks/Admin/useNotification'
import usePagination from '@/hooks/Admin/usePagination'
import useSearch from '@/hooks/Admin/useSearch'
import useModal from '@/hooks/Admin/useModal'

import EditModal from './EditModal'
import AddModal from './AddModal'



import ItemRow from './ItemRow'

function Characters({ data }) {
  const {
    characters,
    actions,
  } = useCharacterData(data)
  const { 
    filterChar, 
    searchTerm, 
    setSearchTerm, 
  } = useSearch(characters)
  const { 
    page,
    navigate
  } = usePagination(filterChar)
  const { 
    notif, 
    showMessage 
  } = useNotification()
  const {
    modal,
    openModal,
    closeModal
  } = useModal()



  return (
    <>
      <Header />

      <div className="char-list">
        <LineSeparator />
        <div className="tools">
          <Search 
            search={searchTerm} 
            setSearch={setSearchTerm}
          />
          <div className="search-count">
            Total {filterChar.length}
          </div>
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
              onClick={actions.save}
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
              onClick={actions.reload}
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
              onClick={() => openModal("add")}
            />

          </div>
        </div>
        
        <div className="list-container">
          <ul>
            { 
              page.items.map((char) => (
                <ItemRow 
                  item={char}
                  type={modal.type}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              ))
            }
          </ul>
        </div>

        <div className="pagination flex-row">
          <Button
            content={
              <Direction  color="none" stroke="#949473" />
            }
            className={"left-button"}
            onClick={() => navigate.prev(page.current)}
            disabled={page.current === 1}
          />

          <span>
            Page {page.current} of {page.total || 1}
          </span>

          <Button
            content={
              <Direction  color="none" stroke="#949473" direction="right"/>
            }
            className={"right-button"}
            onClick={() => navigate.next(page)}
            disabled={page.current === page.total || page.total === 0}
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
      { modal.type  === 'edit' && (
        <EditModal close={closeModal} data={modal.data}/>
      )}

      { modal.type === 'add' && (
        <AddModal close={closeModal} data={modal.data}/>
      )}
    </>
  );
}

export default Characters;