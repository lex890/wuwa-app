import { useState, useEffect } from "react";

import InputLabel from "./InputLabel"
import SelectLabel from "./SelectLabel"

function Form({ data, selected, close, submit }) {
  const [formData, setFormData] = useState(selected ?? {})
  const [error, setError] = useState("")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(selected ?? {})
  }, [selected])

  const handleChange = (field, value) => {
    setError("")

    const parsedValue =
      field === "id" ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }))
  }

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(selected);

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const hasEmptyFields = Object.entries(formData).some(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) =>
        value === "" ||
        value === null ||
        value === undefined
    )

    if (hasEmptyFields) {
      setError("Please fill in all fields.");
      return
    }

    const isEditing = selected?.id !== "";

    const recordsToCheck = isEditing
      ? data.filter(record => record.id !== selected.id)
      : data

    const duplicateId = recordsToCheck.some(
      record => record.id === formData.id
    )

    if (duplicateId) {
      setError("ID already exists.")
      return
    }
    console.log('I am here')
    setError("")
    submit(formData)
  }

  return(
    <>
      <form onSubmit={handleSubmit}>
        <InputLabel
          type="number"
          label="ID"
          value={formData.id}
          onChange={(value) => handleChange("id", value)}
        />

        <InputLabel
          label="Name"
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
        />

        <SelectLabel
          label="Weapon Type"
          value={formData.weapon_type}
          options={[
            "Sword",
            "Rectifier",
            "Gauntlets",
            "Pistols",
            "Broadblade",
          ]}
          onChange={(value) => handleChange("weapon_type", value)}
        />

        <SelectLabel
          label="Quality"
          value={formData.quality_id}
          options={[
            { value: 4, label: "4 Star" },
            { value: 5, label: "5 Star" },
          ]}
          onChange={(value) => handleChange("quality_id", value)}
        />

        <SelectLabel
          label="Element"
          value={formData.elemen_type}
          options={[
            "Glacio",
            "Fusion",
            "Electro",
            "Spectro",
            "Aero",
            "Havoc"
          ]}
          onChange={(value) => handleChange("elemen_type", value)}
        />

        <InputLabel
          label="Icon"
          value={formData.icon}
          onChange={(value) => handleChange("icon", value)}
        />

        <button type="submit" disabled={!hasChanges}>
          Submit
        </button>

        <button type="button" onClick={close}>
          Close
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>        
    </>
  )
}

export default Form