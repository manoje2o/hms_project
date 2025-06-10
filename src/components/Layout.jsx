import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar"; // Capitalized to follow component naming convention
import bgImage from "../assets/bg-medical.jpg"; // Ensure this path is correct

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex vh-100 m-0 p-0 overflow-hidden">
        <Sidebar />
        <main
          className="flex-grow-1 overflow-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            color: "#fff",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
