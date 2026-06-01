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

    if (loading) {
        return <p className="text-center p-5">Cargando...</p>;
    }

    return (
        <div className="container py-4">

            <h2>💰 Ventas</h2>

            {/* PACIENTE */}
            <select
                className="form-select mb-2"
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
                const seleccionado = productosSeleccionados.find(x => x.id === p.id);

                return (
                    <div key={p.id} className="border p-2 mb-2">

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
                                min="1"
                                max={p.stock}
                                className="form-control mt-2"
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
            <button
                className="btn btn-success mt-3"
                onClick={guardarVenta}
                disabled={saving}
            >
                {saving ? "Guardando..." : "Guardar venta"}
            </button>

            <button
                className="btn btn-secondary ms-2 mt-3"
                onClick={limpiar}
            >
                Limpiar
            </button>

        </div>
    );
}

export default Ventas;