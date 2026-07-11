import { Outlet } from "react-router-dom";
import { Footer } from "@/components";

function AuthLayout() {
  return(
    <>
      <div className='public user-access-layout'>
        <div className="content">
          <div className="main-wrapper">
            <Outlet />
          </div>
          <Footer /> 
        </div>
      </div>
    </>
  )
}
export default AuthLayout