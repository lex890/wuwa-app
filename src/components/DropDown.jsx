
import Button from "./Button";

function Dropdown({
  id,
  Icon,
  children,
  openDropdown,
  setOpenDropdown,
}) {
  const open = openDropdown === id;

  const handleToggle = () => {
    setOpenDropdown(open ? null : id);
  };

  return (
    <div className="dropdown">
      <Button
        className="dropbtn"
        content={
          <Icon
            size="24"
            stroke="#000000"
            fill="none"
          />
        }
        onClick={handleToggle}
      />

      {open && (
        <div className="dropdown-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown