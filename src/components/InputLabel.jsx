function InputLabel({ label, value = "", onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default InputLabel