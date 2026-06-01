import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import Layout from "../components/Layout";

function Ventas() {
    const [productos, setProductos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [ventas, setVentas] = useState([]);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [pacienteId, setPacienteId] = useState("");
    const [medicoId, setMedicoId] = useState("");
    const [buscarVenta, setBuscarVenta] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const cargar = async () => {
        try {
            setLoading(true);
            const [productosRes, pacientesRes, medicosRes, ventasRes] = await Promise.all([
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
            Swal.fire("Error", "No se pudieron cargar datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const toggleProducto = (producto) => {
        const existe = productosSeleccionados.find(p => p.id === producto.id);
        if (existe) {
            setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== producto.id));
        } else {
            setProductosSeleccionados([
                ...productosSeleccionados,
                { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }
            ]);
        }
    };

    const cambiarCantidad = (id, value) => {
        setProductosSeleccionados(prev =>
            prev.map(p => p.id === id ? { ...p, cantidad: Number(value) } : p)
        );
    };

    const limpiar = () => {
        setProductosSeleccionados([]);
        setPacienteId("");
        setMedicoId("");
    };

    const guardarVenta = async () => {
        if (!pacienteId || !medicoId || productosSeleccionados.length === 0) {
            return Swal.fire("Error", "Completa todos los campos", "warning");
        }

        try {
            setSaving(true);
            await api.post("/ventas", {
                paciente_id: pacienteId,
                medico_id: medicoId,
                productos: productosSeleccionados.map(p => ({ producto_id: p.id, cantidad: p.cantidad }))
            });
            Swal.fire("Éxito", "Venta registrada correctamente", "success");
            limpiar();
            cargar();
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Error al guardar", "error");
        } finally {
            setSaving(false);
        }
    };

    const descargarPDF = (id) => {
        window.open(`${api.defaults.baseURL}/ventas/pdf/${id}`, "_blank");
    };

    const totalActual = productosSeleccionados.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    // Filtrar ventas
    const ventasFiltradas = ventas.filter(v =>
        (v.paciente?.nombre || "").toLowerCase().includes(buscarVenta.toLowerCase()) ||
        (v.medico?.nombre || "").toLowerCase().includes(buscarVenta.toLowerCase())
    );

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1">💊 Ventas</h2>
                        <p className="text-muted mb-0">Total: {ventas.length}</p>
                    </div>
                </div>

                {/* Formulario de nueva venta */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-header bg-white border-0 pt-4">
                        <h4 className="fw-bold mb-0">➕ Nueva Venta</h4>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Paciente */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">👤 Paciente</label>
                                <select 
                                    className="form-select" 
                                    value={pacienteId} 
                                    onChange={(e) => setPacienteId(e.target.value)}
                                >
                                    <option value="">Seleccionar paciente</option>
                                    {pacientes.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Médico */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">👨‍⚕️ Médico</label>
                                <select 
                                    className="form-select" 
                                    value={medicoId} 
                                    onChange={(e) => setMedicoId(e.target.value)}
                                >
                                    <option value="">Seleccionar médico</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>{m.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Productos */}
                            <div className="col-12">
                                <label className="form-label fw-bold">💊 Productos</label>
                                <div className="row">
                                    {productos.map(p => {
                                        const sel = productosSeleccionados.find(x => x.id === p.id);
                                        return (
                                            <div className="col-md-6 col-lg-4 mb-3" key={p.id}>
                                                <div className={`card h-100 ${sel ? 'border-primary shadow-sm' : 'border'}`} style={{ borderRadius: "12px", cursor: "pointer" }}>
                                                    <div className="card-body">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={!!sel}
                                                                onChange={() => toggleProducto(p)}
                                                                id={`producto-${p.id}`}
                                                            />
                                                            <label className="form-check-label fw-semibold" htmlFor={`producto-${p.id}`}>
                                                                {p.nombre}
                                                            </label>
                                                        </div>
                                                        <div className="mt-2">
                                                            <small className="text-muted">💰 Precio: ${p.precio}</small>
                                                            <br />
                                                            <small className="text-muted">📦 Stock: {p.stock}</small>
                                                        </div>
                                                        {sel && (
                                                            <div className="mt-2">
                                                                <label className="form-label small">Cantidad:</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={p.stock}
                                                                    className="form-control form-control-sm"
                                                                    value={sel.cantidad}
                                                                    onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {productos.length === 0 && (
                                    <div className="alert alert-warning">No hay productos disponibles</div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="col-12">
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="fw-bold mb-0">Total:</h3>
                                    <h2 className="fw-bold text-success mb-0">${totalActual.toFixed(2)}</h2>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="col-12">
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={guardarVenta}
                                    disabled={saving}
                                >
                                    {saving ? "Guardando..." : "💰 Guardar Venta"}
                                </button>
                                <button className="btn btn-secondary" onClick={limpiar}>
                                    🧹 Limpiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historial de Ventas */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">📋 Historial de Ventas</h4>

                        {/* Buscador */}
                        <input
                            type="text"
                            className="form-control mb-4"
                            placeholder="🔍 Buscar por paciente o médico..."
                            value={buscarVenta}
                            onChange={(e) => setBuscarVenta(e.target.value)}
                        />

                        {/* Tabla de ventas */}
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Paciente</th>
                                        <th>Médico</th>
                                        <th>Productos</th>
                                        <th>Total</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventasFiltradas.length > 0 ? (
                                        ventasFiltradas.map(v => (
                                            <tr key={v.id}>
                                                <td>#{v.id}</td>
                                                <td>
                                                    <strong>{v.paciente?.nombre}</strong>
                                                    <br />
                                                    <small className="text-muted">{v.paciente?.edad} años</small>
                                                </td>
                                                <td>{v.medico?.nombre}</td>
                                                <td>
                                                    {v.productos?.map((prod, idx) => (
                                                        <div key={idx}>
                                                            <small>{prod.nombre} x{prod.cantidad}</small>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="fw-bold text-success">${v.total}</td>
                                                <td>{new Date(v.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => descargarPDF(v.id)}
                                                    >
                                                        📄 PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                No hay ventas registradas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Ventas;