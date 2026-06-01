import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Ventas() {

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
            Swal.fire("Error", "Error cargando datos", "error");
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
        setProductosSeleccionados(prev => {
            const existe = prev.find(p => p.id === producto.id);

            if (existe) {
                return prev.filter(p => p.id !== producto.id);
            }

            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const cambiarCantidad = (id, value) => {
        setProductosSeleccionados(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, cantidad: Math.max(1, Number(value)) }
                    : p
            )
        );
    };

    const limpiar = () => {
        setProductosSeleccionados([]);
        setPacienteId("");
        setMedicoId("");
    };

    // =========================
    // GUARDAR
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

            Swal.fire("Éxito", "Venta registrada", "success");

            limpiar();
            cargar();

        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Error",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

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
                <p className="text-muted">
                    Sistema de registro de ventas farmacia
                </p>
            </div>

            <div className="row g-4">

                {/* IZQUIERDA - FORM */}
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h4 className="fw-bold mb-4">🛒 Nueva venta</h4>

                            {/* PACIENTE Y MÉDICO */}
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        👤 Paciente
                                    </label>

                                    <select
                                        className="form-select"
                                        value={pacienteId}
                                        onChange={(e) => setPacienteId(e.target.value)}
                                    >
                                        <option value="">Seleccionar paciente</option>
                                        {pacientes.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        🩺 Médico
                                    </label>

                                    <select
                                        className="form-select"
                                        value={medicoId}
                                        onChange={(e) => setMedicoId(e.target.value)}
                                    >
                                        <option value="">Seleccionar médico</option>
                                        {medicos.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            {/* PRODUCTOS */}
                            <hr className="my-4" />

                            <h5 className="fw-bold mb-3">📦 Productos</h5>

                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>

                                {productos.map(p => {
                                    const sel = productosSeleccionados.find(x => x.id === p.id);

                                    return (
                                        <div
                                            key={p.id}
                                            className={`p-3 mb-2 rounded border d-flex justify-content-between align-items-center ${sel ? "bg-light" : ""}`}
                                        >

                                            <div>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={!!sel}
                                                    onChange={() => toggleProducto(p)}
                                                />

                                                <span className="fw-semibold">
                                                    {p.nombre}
                                                </span>

                                                <div className="text-muted small">
                                                    Stock: {p.stock} | ${p.precio}
                                                </div>
                                            </div>

                                            {sel && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control"
                                                    style={{ width: "90px" }}
                                                    value={sel.cantidad}
                                                    onChange={(e) =>
                                                        cambiarCantidad(p.id, e.target.value)
                                                    }
                                                />
                                            )}

                                        </div>
                                    );
                                })}

                            </div>

                            {/* TOTAL + BOTONES */}
                            <div className="mt-4 d-flex justify-content-between align-items-center">

                                <h4 className="text-success fw-bold">
                                    Total: ${totalActual.toFixed(2)}
                                </h4>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-success"
                                        onClick={guardarVenta}
                                        disabled={saving}
                                    >
                                        {saving ? "Guardando..." : "💾 Guardar"}
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

                </div>

                {/* DERECHA - HISTORIAL */}
                <div className="col-lg-4">

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h5 className="fw-bold mb-3">📋 Historial</h5>

                            <div style={{ maxHeight: "600px", overflowY: "auto" }}>

                                {ventas.length > 0 ? (
                                    ventas.map(v => (
                                        <div key={v.id} className="border rounded p-2 mb-2">

                                            <div className="fw-semibold">
                                                {v.paciente?.nombre}
                                            </div>

                                            <small className="text-muted">
                                                {v.medico?.nombre}
                                            </small>

                                            <div className="text-success fw-bold">
                                                ${Number(v.total).toFixed(2)}
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center">
                                        Sin ventas
                                    </p>
                                )}

                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Ventas;