function InputLabel({ type = "text", label, value = "", onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default InputLabel