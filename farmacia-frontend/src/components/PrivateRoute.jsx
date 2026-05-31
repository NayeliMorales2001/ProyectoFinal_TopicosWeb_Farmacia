import {
    Navigate,
    Outlet
} from "react-router-dom";

function PrivateRoute({ children }) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children
        ? children
        : <Outlet />;

}

export default PrivateRoute;