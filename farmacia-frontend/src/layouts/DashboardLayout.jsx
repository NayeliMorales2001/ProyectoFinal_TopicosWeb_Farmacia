import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {

    return (

        <div
            className="d-flex"
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc"
            }}
        >

            {/* SIDEBAR */}
            <Sidebar />

            {/* CONTENIDO */}
            <main
                className="flex-grow-1"
                style={{
                    marginLeft: "260px",
                    padding: "25px",
                    width: "100%",
                    overflowX: "hidden"
                }}
            >

                <Outlet />

            </main>

        </div>

    );

}

export default DashboardLayout;