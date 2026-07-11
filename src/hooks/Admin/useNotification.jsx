import { useState, useRef } from "react"

const colors = {
  success: "green",
  error: "red",
  warning: "orange",
};

function useNotification() {
  const [notif, setNotification] = useState({
    message: "",
    type: null,
  });
  
  const color = notif.type ? colors[notif.type] : null;
  const status = notif.type !== null;

  const timeoutRef = useRef(null);

  const showMessage = (message, type) => {
    clearTimeout(timeoutRef.current);

    setNotification({ 
      message, 
      type,
    });

    timeoutRef.current = setTimeout(() => {
      setNotification({ 
        message: "",
        type: null,
      });
    }, 3000);
  };

  return {
    notif: {
      ...notif,
      color,
      status,
    },
    showMessage,
  };
}

export default useNotification