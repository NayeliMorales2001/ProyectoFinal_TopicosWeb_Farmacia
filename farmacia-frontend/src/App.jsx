import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// =========================================
// PAGES
// =========================================

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";
import Ventas from "./pages/Ventas";
import Pacientes from "./pages/Pacientes";
import Medicos from "./pages/Medicos";

import NotFound from "./pages/NotFound";

// =========================================
// COMPONENTS
// =========================================

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AutoLogout from "./components/AutoLogout";

// =========================================
// LAYOUT
// =========================================

import DashboardLayout from "./layouts/DashboardLayout";

function App() {

    return (

        <BrowserRouter>

            {/* AUTO LOGOUT */}
            <AutoLogout />

            <Routes>

                {/* ========================================= */}
                {/* RUTAS PUBLICAS */}
                {/* ========================================= */}

                <Route
                    path="/"
                    element={<Navigate to="/landing" replace />}
                />

                <Route
                    path="/landing"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ========================================= */}
                {/* RUTAS PRIVADAS */}
                {/* ========================================= */}

                <Route
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >

                    {/* DASHBOARD */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* PRODUCTOS */}
                    <Route
                        path="/productos"
                        element={<Productos />}
                    />

                    {/* CREAR PRODUCTO */}
                    <Route
                        path="/productos/crear"
                        element={
                            <AdminRoute>
                                <CrearProducto />
                            </AdminRoute>
                        }
                    />

                    {/* EDITAR PRODUCTO */}
                    <Route
                        path="/productos/editar/:id"
                        element={
                            <AdminRoute>
                                <EditarProducto />
                            </AdminRoute>
                        }
                    />

                    {/* VENTAS */}
                    <Route
                        path="/ventas"
                        element={<Ventas />}
                    />

                    {/* PACIENTES */}
                    <Route
                        path="/pacientes"
                        element={<Pacientes />}
                    />

                    {/* MEDICOS */}
                    <Route
                        path="/medicos"
                        element={
                            <AdminRoute>
                                <Medicos />
                            </AdminRoute>
                        }
                    />

                </Route>

                {/* ========================================= */}
                {/* 404 */}
                {/* ========================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;