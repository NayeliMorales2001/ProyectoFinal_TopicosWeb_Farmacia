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

    const [productoId, setProductoId] = useState([]);
    const [pacienteId, setPacienteId] = useState("");
    const [medicoId, setMedicoId] = useState("");

    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    // =========================================
    // PAGINACION
    // =========================================
    const [paginaActual, setPaginaActual] = useState(1);
    const ventasPorPagina = 5;

    const indexUltimaVenta = paginaActual * ventasPorPagina;
    const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;

    const ventasActuales = ventas.slice(
        indexPrimeraVenta,
        indexUltimaVenta
    );

    const totalPaginas = Math.ceil(ventas.length / ventasPorPagina);

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

            setProductos(productosRes.data.data || productosRes.data || []);
            setPacientes(pacientesRes.data.data || pacientesRes.data || []);
            setMedicos(medicosRes.data.data || medicosRes.data || []);
            setVentas(ventasRes.data.data || ventasRes.data || []);

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
    // AUTO PRECIO (MULTIPLES PRODUCTOS)
    // =========================================
    useEffect(() => {
        if (productoId.length > 0) {

            const seleccionados = productos.filter(p =>
                productoId.includes(String(p.id))
            );

            const totalPrecio = seleccionados.reduce(
                (acc, item) => acc + Number(item.precio),
                0
            );

            setPrecio(totalPrecio);

        } else {
            setPrecio("");
        }
    }, [productoId, productos]);

    // =========================================
    // LIMPIAR
    // =========================================
    const limpiar = () => {
        setProductoId([]);
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
                productoId.length === 0 ||
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

            setSaving(true);

            const data = {
                productos: productoId,
                paciente_id: pacienteId,
                medico_id: medicoId,
                cantidad: parseInt(cantidad),
                precio: parseFloat(precio),
                total: parseInt(cantidad) * parseFloat(precio)
            };

            await api.post("/ventas", data);

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
                error.response?.data?.message || "No se pudo registrar la venta",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================
    // ELIMINAR
    // =========================================
    const eliminarVenta = async (id) => {
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
    };

    // =========================================
    // TOTAL
    // =========================================
    const totalVentas = ventas.reduce(
        (acc, item) => acc + Number(item.total || 0),
        0
    );

    // =========================================
    // LOADING
    // =========================================
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" />
                <p className="mt-3">Cargando ventas...</p>
            </div>
        );
    }

    // =========================================
    // UI
    // =========================================
    return (
        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="mb-4">
                <h2>💰 Ventas</h2>
                <p>Total: ${totalVentas.toFixed(2)}</p>
            </div>

            {/* FORM */}
            <div className="card mb-4">
                <div className="card-body">

                    <div className="row g-3">

                        {/* PRODUCTOS MULTI */}
                        <div className="col-md-4">
                            <label>Productos</label>
                            <select
                                multiple
                                className="form-select"
                                value={productoId}
                                onChange={(e) => {
                                    const options = Array.from(
                                        e.target.selectedOptions,
                                        opt => opt.value
                                    );
                                    setProductoId(options);
                                }}
                            >
                                {productos.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} | Stock: {p.stock}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PACIENTE */}
                        <div className="col-md-4">
                            <label>Paciente</label>
                            <select
                                className="form-select"
                                value={pacienteId}
                                onChange={(e) => setPacienteId(e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* MEDICO */}
                        <div className="col-md-4">
                            <label>Médico</label>
                            <select
                                className="form-select"
                                value={medicoId}
                                onChange={(e) => setMedicoId(e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* CANTIDAD */}
                        <div className="col-md-4">
                            <label>Cantidad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                            />
                        </div>

                        {/* PRECIO */}
                        <div className="col-md-4">
                            <label>Precio</label>
                            <input
                                className="form-control"
                                value={precio}
                                readOnly
                            />
                        </div>

                        {/* TOTAL */}
                        <div className="col-md-4">
                            <label>Total</label>
                            <input
                                className="form-control"
                                readOnly
                                value={
                                    cantidad && precio
                                        ? (cantidad * precio).toFixed(2)
                                        : ""
                                }
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="col-12">
                            <button
                                className="btn btn-success me-2"
                                onClick={guardarVenta}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar"}
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
            <div className="card">
                <div className="card-body table-responsive">

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ventasActuales.map(v => (
                                <tr key={v.id}>
                                    <td>{v.producto?.nombre || "—"}</td>
                                    <td>{v.paciente?.nombre || "—"}</td>
                                    <td>{v.medico?.nombre || "—"}</td>
                                    <td>{v.cantidad}</td>
                                    <td>${Number(v.total).toFixed(2)}</td>
                                    <td>
                                        {user?.rol === "admin" && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarVenta(v.id)}
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
}

export default Ventas;