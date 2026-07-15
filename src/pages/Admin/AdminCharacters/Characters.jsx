import './Characters.scss'

import { Header, Button, Search, LineSeparator } from '../../../components/index'

import { Direction, Save, Fetch, Add} from '../../../assets/components/index'


import useCharacterController from '@/hooks/Admin/useCharacterController'

import EditModal from './EditModal'
import AddModal from './AddModal'

import StatusMsg from './StatusMsg'


import ItemRow from './ItemRow'

function Characters({ data, loadData }) {
  const {
    filterChar,
    page,
    navigate,
    searchTerm,
    setSearchTerm,
    modal,
    openModal,
    closeModal,
    notif,
    actions
  } = useCharacterController(data, loadData)
  return (
    <>
      <Header />
      <LineSeparator />
      <div className="char-list">
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
              onClick={actions.reload}
              content={
                <>
                  <Fetch 
                    size="24" 
                    stroke="#ffffff"
                    fill="none"
                  /> Fetch
                </>
              }
              
            />
            <Button
              type="button"
              className="add-button"
              onClick={() => openModal("add")}
              content={
                <>
                  <Add 
                    size="24" 
                    stroke="#ffffff"
                    fill="none"
                  /> Add New
                </>
              }
            />

          </div>
        </div>
        
        <div className="list-container">
          <ul>
            { 
              page.items.map((char) => (
                <ItemRow
                  key={char.id} 
                  item={char}
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
      <StatusMsg notif={notif} />
      { modal.type  === 'edit' && (
        <EditModal
          editData={actions.update}  
          close={closeModal} 
          data={modal.data}
        />
      )}
      { modal.type === 'add' && (
        <AddModal 
          close={closeModal} 
          addData={actions.add}
        />
      )}
    </>
  );
}

export default Characters;