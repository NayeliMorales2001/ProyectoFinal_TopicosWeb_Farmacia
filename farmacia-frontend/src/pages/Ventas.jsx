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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const cambiarCantidad = (id, value) => {
        setProductosSeleccionados(prev =>
            prev.map(p =>
                p.id === id ? { ...p, cantidad: Number(value) } : p
            )
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
                productos: productosSeleccionados.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad
                }))
            });

            Swal.fire("Éxito", "Venta registrada correctamente", "success");

            limpiar();
            cargar();

        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Error al guardar",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const descargarPDF = (id) => {
        window.open(`${api.defaults.baseURL}/ventas/pdf/${id}`, "_blank");
    };

    const totalActual = productosSeleccionados.reduce(
        (acc, p) => acc + (p.precio * p.cantidad),
        0
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
            <div className="container py-4">

                <div className="mb-4">
                    <div className="card border-0 shadow-sm" style={{borderRadius:"18px",background:"linear-gradient(135deg,#eff6ff,#ffffff)"}}>
                        <div className="card-body">
                            <h2 className="fw-bold">💊 Nueva Venta</h2>
                            <p className="text-muted mb-0">Gestión de ventas de farmacia</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm border-0 mb-4" style={{borderRadius:"15px"}}>
                    <div className="card-body">

                        <h5 className="fw-semibold mb-3">Datos de venta</h5>

                        <select className="form-select mb-3" value={pacienteId} onChange={(e)=>setPacienteId(e.target.value)}>
                            <option value="">Seleccionar paciente</option>
                            {pacientes.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>

                        <select className="form-select mb-3" value={medicoId} onChange={(e)=>setMedicoId(e.target.value)}>
                            <option value="">Seleccionar médico</option>
                            {medicos.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>

                        <h5 className="mb-3">Productos</h5>

                        {productos.map(p=>{
                            const sel = productosSeleccionados.find(x=>x.id===p.id);

                            return (
                                <div key={p.id} className="mb-3 p-3" style={{border:"1px solid #e5e7eb",borderRadius:"12px",background:"#f8fafc"}}>
                                    <label>
                                        <input type="checkbox" checked={!!sel} onChange={()=>toggleProducto(p)} />{" "}
                                        {p.nombre} - ${p.precio} (Stock: {p.stock})
                                    </label>

                                    {sel && (
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control mt-2"
                                            value={sel.cantidad}
                                            onChange={(e)=>cambiarCantidad(p.id,e.target.value)}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <h4 className="fw-bold mt-4">
                            Total: <span style={{color:"#16a34a"}}>${totalActual.toFixed(2)}</span>
                        </h4>

                        <button
                            className="btn me-2"
                            style={{background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff"}}
                            onClick={guardarVenta}
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "💰 Guardar Venta"}
                        </button>

                        <button className="btn btn-secondary" onClick={limpiar}>
                            Limpiar
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm border-0" style={{borderRadius:"15px"}}>
                    <div className="card-body">
                        <h5 className="fw-semibold mb-3">📄 Historial de Ventas</h5>

                        {ventas.map(v=>(
                            <div key={v.id} className="mb-3 p-3 shadow-sm" style={{borderRadius:"12px",border:"1px solid #e5e7eb"}}>
                                <div><b>Paciente:</b> {v.paciente?.nombre}</div>
                                <div><b>Médico:</b> {v.medico?.nombre}</div>
                                <div className="fw-bold text-success">${v.total}</div>

                                <button
                                    className="btn btn-sm mt-2"
                                    style={{background:"#2563eb",color:"#fff"}}
                                    onClick={()=>descargarPDF(v.id)}
                                >
                                    PDF
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
}

export default Ventas;
