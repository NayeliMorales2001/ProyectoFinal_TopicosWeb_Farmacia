import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Ventas() {

    // =========================
    // STATES
    // =========================
    const [productos, setProductos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [ventas, setVentas] = useState([]);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const [pacienteId, setPacienteId] = useState("");
    const [medicoId, setMedicoId] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================
    // CARGAR DATOS
    // =========================
    const cargar = async () => {
        try {
            setLoading(true);

            const [productosRes, pacientesRes, medicosRes, ventasRes] =
                await Promise.all([
                    api.get("/productos"),
                    api.get("/pacientes"),
                    api.get("/medicos"),
                    api.get("/ventas")
                ]);

            setProductos(productosRes.data.data || []);
            setPacientes(pacientesRes.data.data || []);
            setMedicos(medicosRes.data.data || []);
            setVentas(ventasRes.data.data || []);

        } catch (error) {
            console.log(error);
            Swal.fire("Error", "No se pudieron cargar datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    // =========================
    // TOGGLE PRODUCTO
    // =========================
    const toggleProducto = (producto) => {

        const existe = productosSeleccionados.find(p => p.id === producto.id);

        if (existe) {
            setProductosSeleccionados(
                productosSeleccionados.filter(p => p.id !== producto.id)
            );
        } else {
            setProductosSeleccionados([
                ...productosSeleccionados,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1
                }
            ]);
        }
    };

    // =========================
    // CAMBIAR CANTIDAD
    // =========================
    const cambiarCantidad = (id, value) => {
        setProductosSeleccionados(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, cantidad: Number(value) }
                    : p
            )
        );
    };

    // =========================
    // LIMPIAR
    // =========================
    const limpiar = () => {
        setProductosSeleccionados([]);
        setPacienteId("");
        setMedicoId("");
    };

    // =========================
    // GUARDAR VENTA
    // =========================
    const guardarVenta = async () => {

        if (!pacienteId || !medicoId || productosSeleccionados.length === 0) {
            return Swal.fire("Error", "Completa todos los campos", "warning");
        }

        try {
            setSaving(true);

            const data = {
                paciente_id: pacienteId,
                medico_id: medicoId,
                productos: productosSeleccionados.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad
                }))
            };

            await api.post("/ventas", data);

            Swal.fire("Éxito", "Venta registrada correctamente", "success");

            limpiar();
            cargar();

        } catch (error) {
            console.log(error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "Error al guardar",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // PDF
    // =========================
    const descargarPDF = (id) => {
        window.open(`${api.defaults.baseURL}/ventas/pdf/${id}`, "_blank");
    };

    // =========================
    // TOTAL
    // =========================
    const totalActual = productosSeleccionados.reduce(
        (acc, p) => acc + (p.precio * p.cantidad),
        0
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="fw-bold">💰 Ventas</h2>
                <p className="text-muted">Registro de ventas farmacia</p>
            </div>

            <div className="row g-4">

                {/* FORM */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h4 className="fw-bold mb-3">🛒 Nueva venta</h4>

                            {/* PACIENTE */}
                            <select
                                className="form-select mb-3"
                                value={pacienteId}
                                onChange={(e) => setPacienteId(e.target.value)}
                            >
                                <option value="">Selecciona paciente</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>

                            {/* MÉDICO */}
                            <select
                                className="form-select mb-3"
                                value={medicoId}
                                onChange={(e) => setMedicoId(e.target.value)}
                            >
                                <option value="">Selecciona médico</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </select>

                            {/* PRODUCTOS */}
                            <h5>Productos</h5>

                            {productos.map(p => {

                                const sel = productosSeleccionados.find(x => x.id === p.id);

                                return (
                                    <div key={p.id} className="border p-2 mb-2 rounded">

                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!sel}
                                                onChange={() => toggleProducto(p)}
                                            />{" "}
                                            {p.nombre} - ${p.precio} (Stock: {p.stock})
                                        </label>

                                        {sel && (
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control mt-2"
                                                value={sel.cantidad}
                                                onChange={(e) =>
                                                    cambiarCantidad(p.id, e.target.value)
                                                }
                                            />
                                        )}

                                    </div>
                                );
                            })}

                            <h4 className="mt-3 text-success">
                                Total: ${totalActual.toFixed(2)}
                            </h4>

                            <button
                                className="btn btn-success mt-2"
                                onClick={guardarVenta}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar venta"}
                            </button>

                            <button
                                className="btn btn-secondary mt-2 ms-2"
                                onClick={limpiar}
                            >
                                Limpiar
                            </button>

                        </div>
                    </div>
                </div>

                {/* HISTORIAL */}
                <div className="col-lg-4">

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h5 className="fw-bold">📋 Historial</h5>

                            {ventas.map(v => (

                                <div key={v.id} className="border p-2 mb-2 rounded">

                                    <div><b>Paciente:</b> {v.paciente?.nombre}</div>
                                    <div><b>Médico:</b> {v.medico?.nombre}</div>

                                    <div className="text-success fw-bold">
                                        ${v.total}
                                    </div>

                                    <button
                                        className="btn btn-sm btn-danger mt-2"
                                        onClick={() => descargarPDF(v.id)}
                                    >
                                        📄 PDF
                                    </button>

                                </div>

                            ))}

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Ventas;