import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  useEffect(() => {
    // placeholder effect — replace with real admin logic
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin</h1>
      <p>Welcome to the admin page.</p>
      <p>
        <Link to="/tier-list">Go to Quality Tier List</Link>
      </p>
      <p>
        <Link to="/tier-builder">Go to Tier Builder</Link>
      </p>
    </main>
  );
}

