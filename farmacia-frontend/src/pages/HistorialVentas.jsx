import { useEffect, useState } from "react";

import api from "../services/api";

import Loader from "../components/Loader";

import Swal from "sweetalert2";

function HistorialVentas() {

    const [ventas, setVentas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        cargarVentas();

    }, []);

    // =========================================
    // API
    // =========================================

    const cargarVentas = async () => {

        try {

            setLoading(true);

            const res = await api.get(
                "/ventas-historial"
            );

            setVentas(
                res.data.data || []
            );

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                "No se pudo cargar el historial",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    // =========================================
    // FILTRO
    // =========================================

    const ventasFiltradas = ventas.filter((venta) =>

        venta?.producto?.nombre
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())

        ||

        venta?.paciente?.nombre
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())

    );

    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>

                    <h2 className="fw-bold">
                        📜 Historial de Ventas
                    </h2>

                    <p className="text-muted mb-0">
                        Registro completo de ventas
                    </p>

                </div>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar venta..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    style={{
                        maxWidth: "320px"
                    }}
                />

            </div>

            {/* TABLE */}
            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Paciente</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    <th>PDF</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    ventasFiltradas.length > 0 ? (

                                        ventasFiltradas.map((venta) => (

                                            <tr key={venta.id}>

                                                <td>{venta.id}</td>

                                                <td>
                                                    {
                                                        venta?.producto?.nombre ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        venta?.paciente?.nombre ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {venta.cantidad}
                                                </td>

                                                <td className="fw-bold text-success">

                                                    $
                                                    {
                                                        Number(
                                                            venta.total
                                                        ).toFixed(2)
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        venta.created_at
                                                            ? new Date(
                                                                venta.created_at
                                                            ).toLocaleDateString()
                                                            : "N/A"
                                                    }

                                                </td>

                                                <td>

                                                    <a
                                                        href={`http://127.0.0.1:8000/api/ventas/pdf/${venta.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        PDF
                                                    </a>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center py-4 text-muted"
                                            >
                                                No hay ventas registradas
                                            </td>

                                        </tr>

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default HistorialVentas;