function SelectLabel({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div>
      <label>
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => {
          const isObject =
            typeof option === "object"

          return (
            <option
              key={isObject ? option.value : option}
              value={isObject ? option.value : option}
            >
              {isObject ? option.label : option}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default SelectLabel