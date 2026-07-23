import { useEffect, useState } from "react";
import { addRow } from "@/api";

function useEchoesData(data, loadData) {
  const [echo, setEcho] = useState([])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEcho(data ?? []);
  }, [data]);

  const addEcho = (echoData) => {
    if (!echoData) {
      return {
        message: "Something went wrong.",
        type: "error",
      }
    }
    setEcho(prev => [...prev, echoData])
    return {
      message: "New echo added.",
      type: "success",
    }
  }

  const removeEcho = (echoData) => {
    if (!echoData) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    setEcho(prev => 
      prev.filter(echo => echo.id !== echoData.id)
    );
    return {
      message: "Echo deleted.",
      type: "success",
    }
  };

  const updateEcho  = (echoData) => {
    if (!echoData) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    setEcho(prev =>
      prev.map(echo =>
        echo.id === echoData.id ? echoData : echo
      )
    );
    return {
      message: `${echoData.id} has been updated.`,
      type: "success",
    }
  };

  const saveEcho = async () => {
    const newData = echo.filter(e => !e.id);
    if (newData.length === 0) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    const confirmed = confirm(
      `Save ${newData.length} new character(s)?`
    );
    if (!confirmed) {
      return {
        message: "Save cancelled.",
        type: "neutral",
      };
    }

    const { error } = await addRow("wuwa_echoes", newData)
    if (error) { 
      return {
        message: "Adding failed.",
        type: "error",
      }
    }
    localStorage.clear();
    await loadData();
    return {
      message: "Echoes(s) saved.",
      type: "success"
    }
  }

  const reloadEcho = async () => {
    localStorage.clear();

    await loadData();

    return {
      message: "Echoes reloaded.",
      type: "success",
    };
  };

  return{
    echo,
    actions: {
      add: addEcho,
      save: saveEcho,
      remove: removeEcho,
      update: updateEcho,
      reload: reloadEcho,
    }
  }

}
export default useEchoesData