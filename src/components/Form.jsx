import { useState, useEffect } from "react";

import InputLabel from "./InputLabel"

function Form({ data, selected, close, submit }) {
  const [formData, setFormData] = useState(selected ?? {})
  const [error, setError] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(selected ?? {})
  }, [selected])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(selected);

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!hasChanges) {
      setError("No changes detected.");
      return;
    }

    // Exclude the current record being edited
    const otherRecords = data.filter(
      record => record.id !== selected.id
    )
    // Check for duplicate ID
    const duplicateId = otherRecords.some(
      record => record.id === formData.id
    )

    if (duplicateId) {
      setError("ID already exists.")
      return
    }

    setError("")
    submit(formData)
  }

  return(
    <>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <InputLabel
            key={key}
            label={key}
            value={value}
            onChange={(value) => handleChange(key, value)}
          />
        ))}
        <button type="submit">submit</button>
        <button type="button" onClick={close}>close</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
             
    </>
  )
}

export default Form