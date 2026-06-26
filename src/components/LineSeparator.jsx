function LineSeparator() {
  return <div 
    style={{
      padding: "0 20px",
      width: "100%",
      height: "2px",
      background:
        "linear-gradient(to right, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)",
      marginBottom: "24px",
      boxSizing: "border-box",
      flexShrink: "0"
    }} />
}

export default LineSeparator