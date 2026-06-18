function Button({ text = "button", onClick, disabled, dataId="" }) {
  return (
    <button onClick={onClick} disabled={disabled} data-id={dataId}>
      {text}
    </button>
  )
}

export default Button