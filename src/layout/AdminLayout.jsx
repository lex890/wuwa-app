import { Outlet } from "react-router-dom";

import NavBar from "@/components/NavBar/NavBar";
import SideBar from "@/components/SideBar/SideBar";
import Footer from "@/components/Footer";


function MainLayout() {
  return (
    <main id="admin">
      <NavBar />
      <SideBar />

      <div id="content">
        <section id="main-wrapper">
          <Outlet />
        </section>

        <Footer />
      </div>
    </main>
  );
}

export default MainLayout;