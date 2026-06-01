import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

function Medicos() {

    // =========================================
    // STATES
    // =========================================

    const [medicos, setMedicos] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        especialidad: "",
        telefono: "",
        cedula: ""
    });

    const [busqueda, setBusqueda] = useState("");

    const [editando, setEditando] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    // =========================================
    // VALIDACIONES
    // =========================================
    const soloLetras =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    const soloNumeros =
        /^[0-9]+$/;

    // =========================================
    // LOAD
    // =========================================

    useEffect(() => {

        cargar();

    }, []);

    const cargar = async () => {

        try {

            setLoading(true);

            const res = await api.get("/medicos");

            setMedicos(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.data || []
            );

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar los médicos",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    // =========================================
    // VALIDAR
    // =========================================

    const validar = (data) => {

        if (
            !data.nombre?.trim() ||
            !data.especialidad?.trim() ||
            !data.telefono?.trim() ||
            !data.cedula?.trim()
        ) {

            Swal.fire(
                "Error",
                "Todos los campos son obligatorios",
                "warning"
            );

            return false;

        }

        if (!soloLetras.test(data.nombre)) {

            Swal.fire(
                "Error",
                "Nombre inválido",
                "warning"
            );

            return false;

        }

        if (!soloLetras.test(data.especialidad)) {

            Swal.fire(
                "Error",
                "Especialidad inválida",
                "warning"
            );

            return false;

        }

        if (!soloNumeros.test(data.telefono)) {

            Swal.fire(
                "Error",
                "El teléfono solo acepta números",
                "warning"
            );

            return false;

        }

        if (data.telefono.length < 8) {

            Swal.fire(
                "Error",
                "El teléfono es demasiado corto",
                "warning"
            );

            return false;

        }

        if (!soloNumeros.test(data.cedula)) {

    Swal.fire(
        "Error",
        "La cédula solo acepta números",
        "warning"
    );

    return false;

}

if (data.cedula.length < 6) {

    Swal.fire(
        "Error",
        "La cédula debe contener al menos 6 números",
        "warning"
    );

    return false;

}

return true;
};
}

    

    // =========================================
    // LIMPIAR
    // =========================================

    const limpiarFormulario = () => {

        setForm({
            nombre: "",
            especialidad: "",
            telefono: "",
            cedula: ""
        });

    };

    // =========================================
    // GUARDAR
    // =========================================

    const guardar = async () => {

        if (!validar(form)) return;

        try {

            setSaving(true);

            await api.post("/medicos", {
                nombre: form.nombre.trim(),
                especialidad: form.especialidad.trim(),
                telefono: form.telefono.trim(),
                cedula: form.cedula.trim()
            });

            Swal.fire(
                "Guardado",
                "Médico registrado correctamente",
                "success"
            );

            limpiarFormulario();

            cargar();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "No se pudo guardar",
                "error"
            );

        } finally {

            setSaving(false);

        }

    };

    // =========================================
    // ABRIR EDITAR
    // =========================================

    const abrirEditar = (medico) => {

        setEditando({
            id: medico.id,
            nombre: medico.nombre || "",
            especialidad: medico.especialidad || "",
            telefono: medico.telefono || "",
            cedula: medico.cedula || ""
        });

    };

    // =========================================
    // ACTUALIZAR
    // =========================================

    const actualizar = async () => {

        if (!validar(editando)) return;

        try {

            setSaving(true);

            await api.put(
                `/medicos/${editando.id}`,
                {
                    nombre: editando.nombre.trim(),
                    especialidad: editando.especialidad.trim(),
                    telefono: editando.telefono.trim(),
                    cedula: editando.cedula.trim()
                }
            );

            Swal.fire(
                "Actualizado",
                "Médico actualizado correctamente",
                "success"
            );

            setEditando(null);

            cargar();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "No se pudo actualizar",
                "error"
            );

        } finally {

            setSaving(false);

        }

    };

    // =========================================
    // ELIMINAR
    // =========================================

    const eliminar = async (id) => {

        const confirmacion = await Swal.fire({

            title: "¿Eliminar médico?",

            text: "Esta acción no se puede deshacer",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar"

        });

        if (!confirmacion.isConfirmed) return;

        try {

            await api.delete(`/medicos/${id}`);

            Swal.fire(
                "Eliminado",
                "Médico eliminado correctamente",
                "success"
            );

            cargar();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudo eliminar",
                "error"
            );

        }

    };

    // =========================================
    // FILTRO
    // =========================================

    const filtrados = medicos.filter((m) =>

        (m.nombre || "")
            .toLowerCase()
            .includes(busqueda.toLowerCase())

        ||

        (m.especialidad || "")
            .toLowerCase()
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

            <div
                className="card border-0 shadow-sm"
                style={{
                    borderRadius: "20px"
                }}
            >

                <div className="card-body p-4">

                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                        <div>

                            <h2 className="fw-bold mb-1">
                                👨‍⚕️ Gestión de Médicos
                            </h2>

                            <p className="text-muted mb-0">
                                Administra médicos y especialidades
                            </p>

                        </div>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar médico..."
                            value={busqueda}
                            onChange={(e) =>
                                setBusqueda(e.target.value)
                            }
                            style={{
                                maxWidth: "320px"
                            }}
                        />

                    </div>

                    {/* FORM */}
                    <div className="row g-3 mb-4">

                        <div className="col-lg-3 col-md-6">
                           <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={(e) => {

                                const valor = e.target.value;

                                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) {

                                    setForm({
                                        ...form,
                                        nombre: valor
                                    });

                                }

                            }}
                        />
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Especialidad"
                                value={form.especialidad}
                                onChange={(e) => {

                                    const valor = e.target.value;

                                    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) {

                                        setForm({
                                            ...form,
                                            especialidad: valor
                                        });

                                    }

                                }}
                            />
                        </div>

                        <div className="col-lg-2 col-md-6">
                           <input
                                type="text"
                                className="form-control"
                                placeholder="Teléfono"
                                maxLength={10}
                                value={form.telefono}
                                onChange={(e) => {

                                    const valor = e.target.value;

                                    if (/^\d*$/.test(valor)) {

                                        setForm({
                                            ...form,
                                            telefono: valor
                                        });

                                    }

                                }}
                            />
                        </div>

                        <div className="col-lg-2 col-md-6">
                           <input
                            type="text"
                            className="form-control"
                            placeholder="Cédula"
                            maxLength={15}
                            value={form.cedula}
                            onChange={(e) => {

                                const valor = e.target.value;

                                if (/^\d*$/.test(valor)) {

                                    setForm({
                                        ...form,
                                        cedula: valor
                                    });

                                }

                            }}
                        />
                        </div>

                        <div className="col-lg-2 col-md-12">

                            <button
                                className="btn btn-success w-100"
                                onClick={guardar}
                                disabled={saving}
                            >

                                {
                                    saving
                                        ? "Guardando..."
                                        : "+ Guardar"
                                }

                            </button>

                        </div>

                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>Nombre</th>
                                    <th>Especialidad</th>
                                    <th>Teléfono</th>
                                    <th>Cédula</th>
                                    <th className="text-center">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    filtrados.length > 0 ? (

                                        filtrados.map((m) => (

                                            <tr key={m.id}>

                                                <td>{m.nombre}</td>

                                                <td>{m.especialidad}</td>

                                                <td>{m.telefono}</td>

                                                <td>{m.cedula}</td>

                                                <td className="text-center">

                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() =>
                                                            abrirEditar(m)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            eliminar(m.id)
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-4"
                                            >
                                                No hay médicos registrados
                                            </td>

                                        </tr>

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* MODAL */}
            {
                editando && (

                    <div
                        className="modal fade show d-block"
                        style={{
                            background: "rgba(0,0,0,.5)"
                        }}
                    >

                        <div className="modal-dialog modal-dialog-centered">

                            <div className="modal-content rounded-4 border-0">

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Editar Médico
                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() =>
                                            setEditando(null)
                                        }
                                    />

                                </div>

                                <div className="modal-body">

                                    <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Nombre"
                                    value={editando.nombre}
                                    onChange={(e) => {

                                        const valor = e.target.value;

                                        if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) {

                                            setEditando({
                                                ...editando,
                                                nombre: valor
                                            });

                                        }

                                    }}
                                />

                                   <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Especialidad"
                                    value={editando.especialidad}
                                    onChange={(e) => {

                                        const valor = e.target.value;

                                        if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) {

                                            setEditando({
                                                ...editando,
                                                especialidad: valor
                                            });

                                        }

                                    }}
                                />
                                    
                                    <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Teléfono"
                                    maxLength={10}
                                    value={editando.telefono}
                                    onChange={(e) => {

                                        const valor = e.target.value;

                                        if (/^\d*$/.test(valor)) {

                                            setEditando({
                                                ...editando,
                                                telefono: valor
                                            });

                                        }

                                    }}
                                />

                                   <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cédula"
                                        maxLength={15}
                                        value={editando.cedula}
                                        onChange={(e) => {

                                            const valor = e.target.value;

                                            if (/^\d*$/.test(valor)) {

                                                setEditando({
                                                    ...editando,
                                                    cedula: valor
                                                });

                                            }

                                        }}
                                    />

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setEditando(null)
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        onClick={actualizar}
                                        disabled={saving}
                                    >

                                        {
                                            saving
                                                ? "Guardando..."
                                                : "Guardar cambios"
                                        }

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default Medicos;