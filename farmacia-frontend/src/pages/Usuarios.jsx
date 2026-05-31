import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);

    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");

    // =========================================
    // LOAD USERS
    // =========================================

    const cargarUsuarios = async () => {

        try {

            setLoading(true);

            const res = await api.get("/users");

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];

            setUsuarios(data);

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar usuarios",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        cargarUsuarios();

    }, []);

    // =========================================
    // FILTRO
    // =========================================

    const usuariosFiltrados = usuarios.filter((u) =>

        u.name
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())

        ||

        u.email
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())

    );

    return (

        <Layout>

            <div className="container-fluid py-4">

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            👥 Usuarios
                        </h2>

                        <p className="text-muted mb-0">
                            Gestión de usuarios del sistema
                        </p>

                    </div>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar usuario..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                        style={{
                            maxWidth: "320px"
                        }}
                    />

                </div>

                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body">

                        {
                            loading ? (

                                <Loader />

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle text-center">

                                        <thead className="table-dark">

                                            <tr>

                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Rol</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                usuariosFiltrados.length > 0 ? (

                                                    usuariosFiltrados.map((u) => (

                                                        <tr key={u.id}>

                                                            <td>{u.id}</td>

                                                            <td>{u.name}</td>

                                                            <td>{u.email}</td>

                                                            <td>

                                                                <span
                                                                    className={`badge ${
                                                                        u.rol === "admin"
                                                                            ? "bg-danger"
                                                                            : "bg-primary"
                                                                    }`}
                                                                >
                                                                    {u.rol}
                                                                </span>

                                                            </td>

                                                        </tr>

                                                    ))

                                                ) : (

                                                    <tr>

                                                        <td
                                                            colSpan="4"
                                                            className="text-center py-4"
                                                        >
                                                            No hay usuarios registrados
                                                        </td>

                                                    </tr>

                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )
                        }

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default Usuarios;