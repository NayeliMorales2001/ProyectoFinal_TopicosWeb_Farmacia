import {
    Navigate,
    Outlet
} from "react-router-dom";

const AdminRoute = ({ children }) => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // NO LOGUEADO

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // NO ADMIN

    if (user.rol !== "admin") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    // RENDER

    return children
        ? children
        : <Outlet />;

};

export default AdminRoute;