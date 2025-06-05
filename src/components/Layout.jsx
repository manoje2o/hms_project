import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/sidebar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex vh-100 m-0 p-0 overflow-hidden">
        <Sidebar />

        <main className="flex-grow-1 p-3 overflow-auto " style={{backgroundColor:"#f0f2f5"}}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
