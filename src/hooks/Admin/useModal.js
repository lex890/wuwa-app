import { useState } from "react";

function useModal() {
  const [modal, setModal] = useState({
    type: null,
    data: null,
  });

  const openModal = (type, data = null) => {
    setModal({
      type,
      data,
    });
  };

  const closeModal = () => {
    setModal({
      type: null,
      data: null,
    });
  };

  return {
    modal,
    openModal,
    closeModal,
  };
}

export default useModal;