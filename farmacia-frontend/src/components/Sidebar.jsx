import { Link, useLocation, useNavigate } from "react-router-dom";
function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    // =====================================
    // USER SAFE
    // =====================================
    let user = null;

    try {

        const storedUser = localStorage.getItem("user");

        user = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch {

        user = null;

    }

    // =====================================
    // LOGOUT
    // =====================================
    const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");

    navigate("/login");

};

    // =====================================
    // MENU
    // =====================================
    const rol = user?.rol;

    const menu = [

        {
            path: "/dashboard",
            icon: "📊",
            label: "Dashboard"
        },

        {
            path: "/productos",
            icon: "📦",
            label: "Productos"
        },

        {
            path: "/ventas",
            icon: "💰",
            label: "Ventas"
        },

        {
            path: "/pacientes",
            icon: "🧑‍⚕️",
            label: "Pacientes"
        }

    ];

    // SOLO ADMIN
    if (rol === "admin") {

        menu.push(

            {
                path: "/productos/crear",
                icon: "➕",
                label: "Crear Producto"
            },

            {
                path: "/medicos",
                icon: "👨‍⚕️",
                label: "Médicos"
            }

        );

    }

    return (

        <aside
            style={{
                width: "260px",
                background: "linear-gradient(180deg,#0f172a,#172554)",
                color: "#fff",
                padding: "24px 18px",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                overflowY: "auto",
                zIndex: 1000
            }}
        >

            {/* LOGO */}
            <div className="mb-5">

                <h2
                    className="fw-bold"
                    style={{ color: "#fff" }}
                >
                    💊 Farmacia ERP
                </h2>

                <small
                    style={{ color: "#94a3b8" }}
                >
                    Panel Administrativo
                </small>

            </div>

            {/* USER */}
            <div
                className="mb-4 p-3"
                style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "14px"
                }}
            >

                <div className="fw-bold">
                    👤 {user?.name || "Usuario"}
                </div>

                <small
                    style={{ color: "#94a3b8" }}
                >
                    {user?.rol || "Empleado"}
                </small>

            </div>

            {/* MENU */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    flex: 1
                }}
            >

                {menu.map((item) => {

                    const active =
                        location.pathname === item.path;

                    return (

                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                textDecoration: "none",
                                padding: "14px 16px",
                                borderRadius: "14px",
                                background: active
                                    ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                                    : "transparent",
                                color: "#fff",
                                fontWeight: active
                                    ? "600"
                                    : "500",
                                transition: "0.3s",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}
                        >

                            <span
                                style={{
                                    fontSize: "18px"
                                }}
                            >
                                {item.icon}
                            </span>

                            {item.label}

                        </Link>

                    );

                })}

            </div>

            {/* LOGOUT */}
            <button
                onClick={logout}
                className="btn mt-3"
                style={{
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    color: "#fff",
                    borderRadius: "14px",
                    padding: "12px",
                    border: "none",
                    fontWeight: "600"
                }}
            >
                🚪 Cerrar sesión
            </button>

        </aside>

    );

}

export default Sidebar;