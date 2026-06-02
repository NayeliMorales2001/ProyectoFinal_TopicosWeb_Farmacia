import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Ventas() {
    const [productos, setProductos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [ventas, setVentas] = useState([]);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoActual, setProductoActual] = useState("");
    const [cantidadActual, setCantidadActual] = useState(1);
    const [pacienteId, setPacienteId] = useState("");
    const [medicoId, setMedicoId] = useState("");
    const [buscarVenta, setBuscarVenta] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    const cargar = async () => {
        try {
            setLoading(true);
            
            const [productosRes, pacientesRes, medicosRes, ventasRes] = await Promise.all([
                api.get("/productos"),
                api.get("/pacientes"),
                api.get("/medicos"),
                api.get("/ventas")
            ]);

            setProductos(Array.isArray(productosRes.data) ? productosRes.data : productosRes.data?.data || []);
            setPacientes(Array.isArray(pacientesRes.data) ? pacientesRes.data : pacientesRes.data?.data || []);
            setMedicos(Array.isArray(medicosRes.data) ? medicosRes.data : medicosRes.data?.data || []);
            setVentas(Array.isArray(ventasRes.data) ? ventasRes.data : ventasRes.data?.data || []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            Swal.fire("Error", "No se pudieron cargar datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const agregarProducto = () => {
        if (!productoActual) {
            Swal.fire("Error", "Selecciona un producto", "warning");
            return;
        }

        const producto = productos.find(p => p.id === parseInt(productoActual));
        
        if (!producto) return;

        const existe = productosSeleccionados.find(p => p.id === producto.id);
        
        if (existe) {
            Swal.fire("Error", "El producto ya fue agregado. Puedes editar la cantidad en la lista.", "warning");
            return;
        }

        if (cantidadActual > producto.stock) {
            Swal.fire("Error", `Stock insuficiente. Solo hay ${producto.stock} unidades`, "warning");
            return;
        }

        setProductosSeleccionados([
            ...productosSeleccionados,
            {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidadActual,
                stock: producto.stock
            }
        ]);

        setProductoActual("");
        setCantidadActual(1);
    };

    const eliminarProducto = (id) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== id));
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
        const producto = productosSeleccionados.find(p => p.id === id);
        if (nuevaCantidad > producto.stock) {
            Swal.fire("Error", `Stock insuficiente. Solo hay ${producto.stock} unidades`, "warning");
            return;
        }
        if (nuevaCantidad < 1) {
            Swal.fire("Error", "La cantidad debe ser al menos 1", "warning");
            return;
        }
        setProductosSeleccionados(prev =>
            prev.map(p => p.id === id ? { ...p, cantidad: nuevaCantidad } : p)
        );
    };

    const limpiar = () => {
    setProductosSeleccionados([]);
    setPacienteId("");
    setMedicoId("");
    setProductoActual("");
    setCantidadActual(1);
    setPacienteSeleccionado(null);
};

    const guardarVenta = async () => {
        if (!pacienteId || !medicoId || productosSeleccionados.length === 0) {
            return Swal.fire("Error", "Completa todos los campos (paciente, médico y al menos un producto)", "warning");
        }

        try {
            setSaving(true);
            
            // Calcular el total
            const total = productosSeleccionados.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
            
            // Estructura de datos para el backend
            const data = {
                paciente_id: parseInt(pacienteId),
                medico_id: parseInt(medicoId),
                total: total,
                productos: productosSeleccionados.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad,
                    precio: p.precio
                }))
            };
            
            console.log("Enviando datos:", data); // Para depurar
            
            const response = await api.post("/ventas", data);
            
            console.log("Respuesta:", response.data);
            
            Swal.fire("Éxito", "Venta registrada correctamente", "success");
            limpiar();
            cargar();
        } catch (error) {
            console.error("Error guardando venta:", error);
            console.error("Detalles del error:", error.response?.data);
            
            let mensajeError = "Error al guardar la venta";
            if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            } else if (error.response?.data?.error) {
                mensajeError = error.response.data.error;
            }
            
            Swal.fire("Error", mensajeError, "error");
        } finally {
            setSaving(false);
        }
    };

    const descargarPDF = (id) => {
        window.open(`${api.defaults.baseURL}/ventas/pdf/${id}`, "_blank");
    };

    const totalActual = productosSeleccionados.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    const ventasFiltradas = ventas.filter(v =>
        (v.paciente?.nombre || "").toLowerCase().includes(buscarVenta.toLowerCase()) ||
        (v.medico?.nombre || "").toLowerCase().includes(buscarVenta.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header con título y contador */}
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
                    <div className="row g-4">
                        {/* Paciente */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">👤 Paciente</label>
                            <select
                                className="form-select"
                                value={pacienteId}
                                onChange={(e) => {

                                    const id = e.target.value;

                                    setPacienteId(id);

                                    const paciente = pacientes.find(
                                        p => p.id === parseInt(id)
                                    );

                                    setPacienteSeleccionado(paciente || null);

                                    if (paciente?.doctor) {
                                    const medicoEncontrado = medicos.find(
                                        m =>
                                            m.nombre?.trim().toLowerCase() ===
                                            paciente.doctor.trim().toLowerCase()
                                    );

                                    if (medicoEncontrado) {
                                        setMedicoId(medicoEncontrado.id);
                                    }
                                }
                                }}
                            >
                                <option value="">Seleccionar paciente</option>

                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
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
                            {
                                pacienteSeleccionado && (

                                    <div className="alert alert-info mt-3">

                                        <h6>📋 Receta del paciente</h6>

                                        <p>
                                            <strong>Médico:</strong>
                                            {" "}
                                            {pacienteSeleccionado.doctor}
                                        </p>

                                        <p>
                                            <strong>Medicamento:</strong>
                                            {" "}
                                            {pacienteSeleccionado.medicamento}
                                        </p>

                                        <p>
                                            <strong>Dosis:</strong>
                                            {" "}
                                            {pacienteSeleccionado.dosis}
                                        </p>

                                    </div>
                                )
                            }
                        </div>

                        {/* Agregar Productos */}
                        <div className="col-12">
                            <label className="form-label fw-bold">💊 Agregar Producto</label>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <select 
                                        className="form-select" 
                                        value={productoActual} 
                                        onChange={(e) => setProductoActual(e.target.value)}
                                    >
                                        <option value="">Seleccionar producto</option>
                                        {productos
                                            .filter(p => !productosSeleccionados.find(sel => sel.id === p.id))
                                            .map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                                                </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Cantidad"
                                        min="1"
                                        value={cantidadActual}
                                        onChange={(e) => setCantidadActual(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-primary w-100"
                                        onClick={agregarProducto}
                                    >
                                        ➕ Agregar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lista de productos seleccionados */}
                        {productosSeleccionados.length > 0 && (
                            <div className="col-12">
                                <label className="form-label fw-bold">📋 Productos seleccionados</label>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosSeleccionados.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.nombre}</td>
                                                    <td>${p.precio}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            style={{ width: "80px" }}
                                                            min="1"
                                                            max={p.stock}
                                                            value={p.cantidad}
                                                            onChange={(e) => actualizarCantidad(p.id, parseInt(e.target.value) || 1)}
                                                        />
                                                    </td>
                                                    <td className="fw-bold">${(p.precio * p.cantidad).toFixed(2)}</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => eliminarProducto(p.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-active">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold text-success fs-5">${totalActual.toFixed(2)}</td>
                                                <td>                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="col-12">
                            <hr />
                            <button
                                className="btn btn-primary me-2 px-4"
                                onClick={guardarVenta}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "💰 Guardar Venta"}
                            </button>
                            <button className="btn btn-secondary px-4" onClick={limpiar}>
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
                                            {v.detalles?.map((detalle, idx) => (
                                                <div key={idx}>
                                                    <small>
                                                        {detalle.producto?.nombre} x{detalle.cantidad}
                                                    </small>
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
    );
}

export default Ventas;