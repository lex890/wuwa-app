function handleDesc(desc) {
  const output = desc
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<[^>]+>/g, "");

  return output
}

function DescriptionRow({ text }) {
  return(
    <>
      <div>
        {handleDesc(text)}
      </div>
    </>
  )
}

export default DescriptionRow