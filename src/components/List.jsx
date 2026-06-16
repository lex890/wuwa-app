function List({ items, renderItem }) {
  return (
    <ul>
      {items.map(renderItem)}
    </ul>
  );
}

export default List