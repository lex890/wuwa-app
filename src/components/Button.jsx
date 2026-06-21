function Button({ 
  content = "button", 
  className="",
  ...props 
}) {
  return (
    <button 
      className={className}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button