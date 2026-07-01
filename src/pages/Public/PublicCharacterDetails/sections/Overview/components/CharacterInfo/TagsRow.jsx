import Tags from "./Tags"

function TagsRow({ tags }) {
  return(
    <>
      <div className="tags">
        {
          tags.map((tag) => {
            return <Tags info={tag}/>
          })
        }
      </div>
    </>
  )
}

export default TagsRow