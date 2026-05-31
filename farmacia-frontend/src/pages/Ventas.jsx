import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Ventas() {

    // =========================================
    // STATES
    // =========================================
    const [ventas, setVentas] = useState([]);

    const [productos, setProductos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);

    const [productoId, setProductoId] = useState("");
    const [pacienteId, setPacienteId] = useState("");
    const [medicoId, setMedicoId] = useState("");

    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    let user = null;

try {

    const storedUser =
        localStorage.getItem("user");

    user = storedUser
        ? JSON.parse(storedUser)
        : null;

} catch {

    user = null;

}

    // =========================================
    // PAGINACION
    // =========================================
    const [paginaActual, setPaginaActual] = useState(1);

    const ventasPorPagina = 5;

    const indexUltimaVenta =
        paginaActual * ventasPorPagina;

    const indexPrimeraVenta =
        indexUltimaVenta - ventasPorPagina;

    const ventasActuales =
        ventas.slice(
            indexPrimeraVenta,
            indexUltimaVenta
        );

    const totalPaginas = Math.ceil(
        ventas.length / ventasPorPagina
    );

    // =========================================
    // CARGAR DATOS
    // =========================================
    const cargar = async () => {

        try {

            setLoading(true);

            const [
                productosRes,
                pacientesRes,
                medicosRes,
                ventasRes
            ] = await Promise.all([

                api.get("/productos"),
                api.get("/pacientes"),
                api.get("/medicos"),
                api.get("/ventas")

            ]);

            setProductos(
                productosRes.data.data || []
            );

            setPacientes(
                pacientesRes.data.data || []
            );

            setMedicos(
                medicosRes.data.data || []
            );

            setVentas(
                ventasRes.data.data || []
            );

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar los datos",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        cargar();

    }, []);

    // =========================================
    // AUTO PRECIO
    // =========================================
    useEffect(() => {

        if (productoId) {

            const productoSeleccionado =
                productos.find(
                    p => String(p.id) === String(productoId)
                );

            if (productoSeleccionado) {

                setPrecio(
                    productoSeleccionado.precio || ""
                );

            }

        }

    }, [productoId, productos]);

    // =========================================
    // LIMPIAR
    // =========================================
    const limpiar = () => {

        setProductoId("");
        setPacienteId("");
        setMedicoId("");

        setCantidad("");
        setPrecio("");

    };

    // =========================================
    // GUARDAR VENTA
    // =========================================
    const guardarVenta = async () => {

        try {

            if (
                !productoId ||
                !pacienteId ||
                !medicoId ||
                !cantidad
            ) {

                return Swal.fire(
                    "Campos requeridos",
                    "Completa toda la información",
                    "warning"
                );

            }

            const productoSeleccionado =
                productos.find(
                    p => String(p.id) === String(productoId)
                );

            if (
                productoSeleccionado &&
                parseInt(cantidad) >
                parseInt(productoSeleccionado.stock)
            ) {

                return Swal.fire(
                    "Stock insuficiente",
                    "No hay suficiente stock disponible",
                    "warning"
                );

            }

            setSaving(true);

            const data = {

                producto_id: productoId,

                paciente_id: pacienteId,

                medico_id: medicoId,

                cantidad: parseInt(cantidad),

                precio: parseFloat(precio),

                total:
                    parseInt(cantidad) *
                    parseFloat(precio)

            };

            await api.post(
                "/ventas",
                data
            );

            Swal.fire(
                "Éxito",
                "Venta registrada correctamente",
                "success"
            );

            limpiar();

            cargar();

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "No se pudo registrar la venta",
                "error"
            );

        } finally {

            setSaving(false);

        }

    };

    // =========================================
    // ELIMINAR
    // =========================================
    const eliminarVenta = (id) => {

        Swal.fire({

            title: "¿Eliminar venta?",

            text: "Esta acción no se puede deshacer",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar"

        }).then(async (result) => {

            if (result.isConfirmed) {

                try {

                    await api.delete(`/ventas/${id}`);

                    cargar();

                    Swal.fire(
                        "Eliminado",
                        "Venta eliminada correctamente",
                        "success"
                    );

                } catch (error) {

                    Swal.fire(
                        "Error",
                        "No se pudo eliminar",
                        "error"
                    );

                }

            }

        });

    };

    // =========================================
    // TOTAL GENERAL
    // =========================================
    const totalVentas = ventas.reduce(
        (acc, item) =>
            acc + Number(item.total || 0),
        0
    );

    // =========================================
    // LOADING
    // =========================================
    if (loading) {

        return (

            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3">
                    Cargando ventas...
                </p>

            </div>

        );

    }

    return (

        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>

                    <h2 className="fw-bold mb-0">
                        💰 Ventas
                    </h2>

                    <p className="text-muted mb-0">
                        Total ventas:
                        ${totalVentas.toFixed(2)}
                    </p>

                </div>

            </div>

            {/* FORMULARIO */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">
                        🛒 Nueva venta
                    </h4>

                    <div className="row g-3">

                        {/* PRODUCTO */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Producto
                            </label>

                            <select
                                className="form-select"
                                value={productoId}
                                onChange={(e) =>
                                    setProductoId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Seleccionar producto
                                </option>

                                {
                                    productos.map(p => (

                                        <option
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.nombre} |
                                            Stock: {p.stock}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>

                        {/* PACIENTE */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Paciente
                            </label>

                            <select
                                className="form-select"
                                value={pacienteId}
                                onChange={(e) =>
                                    setPacienteId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Seleccionar paciente
                                </option>

                                {
                                    pacientes.map(p => (

                                        <option
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.nombre}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>

                        {/* MEDICO */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Médico
                            </label>

                            <select
                                className="form-select"
                                value={medicoId}
                                onChange={(e) =>
                                    setMedicoId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Seleccionar médico
                                </option>

                                {
                                    medicos.map(m => (

                                        <option
                                            key={m.id}
                                            value={m.id}
                                        >
                                            {m.nombre}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>

                        {/* CANTIDAD */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Cantidad
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={cantidad}
                                onChange={(e) =>
                                    setCantidad(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* PRECIO */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Precio
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={precio}
                                readOnly
                            />

                        </div>

                        {/* TOTAL */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Total
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={
                                    cantidad && precio
                                        ? (
                                            parseInt(cantidad || 0) *
                                            parseFloat(precio || 0)
                                        ).toFixed(2)
                                        : ""
                                }
                            />

                        </div>

                        {/* BOTONES */}
                        <div className="col-12 d-flex gap-2 mt-3">

                            <button
                                className="btn btn-success"
                                onClick={guardarVenta}
                                disabled={saving}
                            >

                                {
                                    saving
                                        ? "Guardando..."
                                        : "Guardar venta"
                                }

                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={limpiar}
                            >
                                Limpiar
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLA */}
            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">
                        📋 Historial de ventas
                    </h4>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th>Producto</th>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    {
                                        user?.rol === "admin" && (
                                            <th>Acciones</th>
                                        )
                                    }
                                </tr>

                            </thead>

                            <tbody>

                                {
                                    ventasActuales.length > 0 ? (

                                        ventasActuales.map(v => (

                                            <tr key={v.id}>

                                                <td>
                                                    {v.producto?.nombre || "—"}
                                                </td>

                                                <td>
                                                    {v.paciente?.nombre || "—"}
                                                </td>

                                                <td>
                                                    {v.medico?.nombre || "—"}
                                                </td>

                                                <td>
                                                    {v.cantidad}
                                                </td>

                                                <td>
                                                    ${Number(v.precio).toFixed(2)}
                                                </td>

                                                <td className="fw-bold text-success">
                                                    ${Number(v.total).toFixed(2)}
                                                </td>

                                                <td>
                                                    {
                                                        v.created_at
                                                            ? new Date(v.created_at).toLocaleDateString()
                                                            : "—"
                                                    }
                                                </td>

                                                <td>

                                                    {
                                        user?.rol === "admin" && (

                                            <td>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarVenta(v.id)
                                                    }
                                                >
                                                    🗑
                                                </button>

                                            </td>

                                        )
                                    }

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="text-center py-4"
                                            >
                                                No hay ventas registradas
                                            </td>

                                        </tr>

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINACION */}
                    <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">

                        {
                            [...Array(totalPaginas)].map((_, index) => (

                                <button
                                    key={index}
                                    className={`btn btn-sm ${
                                        paginaActual === index + 1
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() =>
                                        setPaginaActual(index + 1)
                                    }
                                >
                                    {index + 1}
                                </button>

                            ))
                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Ventas;