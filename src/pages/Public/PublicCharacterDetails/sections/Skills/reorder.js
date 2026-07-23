const reOrderData = (skills) => {
  const skillOrder = [
    "normal",
    "skill",
    "liberation",
    "inherent_1",
    "inherent_2",
    "intro",
    "forte",
    "inherent_3",
    "outro",
    "tune"
  ];

  return Object.entries(skills).sort(([keyA], [keyB]) => {
    return skillOrder.indexOf(keyA) - skillOrder.indexOf(keyB);
  });
}

export default reOrderData