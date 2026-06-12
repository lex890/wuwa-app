function processData(data) {
  const newObject = data?.map(row => ({
    id: row.id,
    name: row.name,
    card: {
      head: row.card,
    },
    element: {
      name: row.elementName,
      icon: row.elementIcon,
      icon6: row.elementIcon6
    }
  }));

  return newObject
}

export default processData