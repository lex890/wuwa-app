import { useEcho } from "@/hooks/Admin/useEcho"

function StatusMsg() {
  const { notif } = useEcho()
  return(
    <div 
      id="status-msg"             
      className={`view-card ${notif.status ? "show" : ""}`}
      style={{
        transform: notif.status ? "translateX(0)" : "translateX(220px)"
      }}
    >
      <div>
        <p style={{ color: notif.color }}>{notif.message}</p>
      </div>
      <span>
        <span style={{ backgroundColor: notif.color }}/>
      </span>
    </div>
  )
}

export default StatusMsg