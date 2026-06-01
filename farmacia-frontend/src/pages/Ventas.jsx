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
            console.log(error);
            Swal.fire("Error", "Error cargando datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    // =========================
    // SELECCIONAR PRODUCTO
    // =========================
    const toggleProducto = (producto) => {
        setProductosSeleccionados(prev => {
            const existe = prev.find(p => p.id === producto.id);

            if (existe) {
                return prev.filter(p => p.id !== producto.id);
            }

            return [
                ...prev,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stock: producto.stock,
                    cantidad: 1
                }
            ];
        });
    };

    // =========================
    // CAMBIAR CANTIDAD
    // =========================
    const cambiarCantidad = (id, value) => {
        const cantidad = Number(value);

        setProductosSeleccionados(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, cantidad: cantidad > 0 ? cantidad : 1 }
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
                error.response?.data?.message || "Error al guardar venta",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // TOTAL GENERAL
    // =========================
    const totalVentas = ventas.reduce(
        (acc, v) => acc + Number(v.total || 0),
        0
    );

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
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">💰 Ventas</h2>
                    <p className="text-muted mb-0">
                        Total histórico: ${totalVentas.toFixed(2)}
                    </p>
                </div>

            </div>

            {/* FORM */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">

                    <h4 className="fw-bold mb-4">🛒 Nueva venta</h4>

                    <div className="row g-3">

                        {/* PACIENTE */}
                        <div className="col-md-4">
                            <label className="form-label">Paciente</label>
                            <select
                                className="form-select"
                                value={pacienteId}
                                onChange={(e) => setPacienteId(e.target.value)}
                            >
                                <option value="">Selecciona</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* MÉDICO */}
                        <div className="col-md-4">
                            <label className="form-label">Médico</label>
                            <select
                                className="form-select"
                                value={medicoId}
                                onChange={(e) => setMedicoId(e.target.value)}
                            >
                                <option value="">Selecciona</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* TOTAL */}
                        <div className="col-md-4">
                            <label className="form-label">Total actual</label>
                            <input
                                className="form-control"
                                value={`$${totalActual.toFixed(2)}`}
                                readOnly
                            />
                        </div>

                    </div>

                    {/* PRODUCTOS */}
                    <h5 className="mt-4">Productos</h5>

                    {productos.map(p => {
                        const seleccionado = productosSeleccionados.find(x => x.id === p.id);

                        return (
                            <div key={p.id} className="border p-2 mb-2 rounded">

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={!!seleccionado}
                                        onChange={() => toggleProducto(p)}
                                    />{" "}
                                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                                </label>

                                {seleccionado && (
                                    <input
                                        type="number"
                                        className="form-control mt-2"
                                        min="1"
                                        max={p.stock}
                                        value={seleccionado.cantidad}
                                        onChange={(e) =>
                                            cambiarCantidad(p.id, e.target.value)
                                        }
                                    />
                                )}

                            </div>
                        );
                    })}

                    {/* BOTONES */}
                    <div className="mt-3 d-flex gap-2">

                        <button
                            className="btn btn-success"
                            onClick={guardarVenta}
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar venta"}
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

            {/* TABLA HISTORIAL */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">

                    <h4 className="fw-bold mb-4">📋 Historial de ventas</h4>

                    <div className="table-responsive">

                        <table className="table table-hover">

                            <thead className="table-light">
                                <tr>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>

                            <tbody>

                                {ventas.length > 0 ? (
                                    ventas.map(v => (
                                        <tr key={v.id}>
                                            <td>{v.paciente?.nombre}</td>
                                            <td>{v.medico?.nombre}</td>
                                            <td className="text-success fw-bold">
                                                ${Number(v.total).toFixed(2)}
                                            </td>
                                            <td>
                                                {v.created_at
                                                    ? new Date(v.created_at).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            Sin ventas
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Ventas;