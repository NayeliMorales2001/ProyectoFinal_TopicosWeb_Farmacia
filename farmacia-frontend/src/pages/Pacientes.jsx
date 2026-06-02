import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Pacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const pacientesPorPagina = 5;

    // Estado para el paciente en edición
    const [pacienteEdit, setPacienteEdit] = useState({
        id: "",
        nombre: "",
        edad: "",
        doctor: "",
        direccion: "",
        medicamento: "",
        dosis: "",
        fecha: "",
        foto: ""
    });

    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
    const direccionValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]*$/;
    const dosisValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/;
    const soloNumeros = /^[0-9]*$/;

    // Estado para nuevo paciente (modal)
    const [nuevoPaciente, setNuevoPaciente] = useState({
        nombre: "",
        edad: "",
        doctor: "",
        direccion: "",
        medicamento: "",
        dosis: "",
        fecha: ""
    });

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        try {
            const resPacientes = await api.get("/pacientes");
            setPacientes(Array.isArray(resPacientes.data) ? resPacientes.data : resPacientes.data?.data || []);
        } catch (error) {
            console.error("Error pacientes:", error);
            setPacientes([]);
        }

        try {
            const resProductos = await api.get("/productos");
            setProductos(Array.isArray(resProductos.data) ? resProductos.data : resProductos.data?.data || []);
        } catch (error) {
            console.error("Error productos:", error);
            setProductos([]);
        }

        try {
            const resMedicos = await api.get("/medicos");
            setMedicos(Array.isArray(resMedicos.data) ? resMedicos.data : resMedicos.data?.data || []);
        } catch (error) {
            console.error("Error medicos:", error);
            setMedicos([]);
        }
    };

    // Función para seleccionar paciente a editar
    const seleccionarPaciente = (paciente) => {
        setPacienteEdit({
            id: paciente.id,
            nombre: paciente.nombre,
            edad: paciente.edad,
            doctor: paciente.doctor,
            direccion: paciente.direccion,
            medicamento: paciente.medicamento,
            dosis: paciente.dosis,
            fecha: paciente.fecha,
            foto: paciente.foto || ""
        });
        setPreviewUrl(paciente.foto || "");
        setSelectedFile(null);
    };

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Convertir archivo a base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Actualizar paciente
    const actualizarPaciente = async (e) => {
        e.preventDefault();

        if (!soloLetras.test(pacienteEdit.nombre)) {
            Swal.fire("Error", "El nombre solo puede contener letras", "warning");
            return;
        }
        if (!direccionValida.test(pacienteEdit.direccion)) {
            Swal.fire("Error", "La dirección solo permite letras, números y #", "warning");
            return;
        }
        if (!dosisValida.test(pacienteEdit.dosis)) {
            Swal.fire("Error", "La dosis solo permite letras y números", "warning");
            return;
        }

        try {
            let fotoBase64 = pacienteEdit.foto;
            if (selectedFile) {
                fotoBase64 = await fileToBase64(selectedFile);
            }

            const pacienteActualizado = {
                ...pacienteEdit,
                foto: fotoBase64
            };

            await api.put(`/pacientes/${pacienteEdit.id}`, pacienteActualizado);
            Swal.fire("Éxito", "Paciente actualizado correctamente", "success");

            // Limpiar formulario
            setPacienteEdit({
                id: "",
                nombre: "",
                edad: "",
                doctor: "",
                direccion: "",
                medicamento: "",
                dosis: "",
                fecha: "",
                foto: ""
            });
            setSelectedFile(null);
            setPreviewUrl("");
            cargar();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo actualizar el paciente", "error");
        }
    };

    // Limpiar formulario de edición
    const limpiarFormulario = () => {
        setPacienteEdit({
            id: "",
            nombre: "",
            edad: "",
            doctor: "",
            direccion: "",
            medicamento: "",
            dosis: "",
            fecha: "",
            foto: ""
        });
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const agregarPaciente = async (e) => {
        e.preventDefault();

        if (!soloLetras.test(nuevoPaciente.nombre)) {
            Swal.fire("Error", "El nombre solo puede contener letras", "warning");
            return;
        }
        if (!direccionValida.test(nuevoPaciente.direccion)) {
            Swal.fire("Error", "La dirección solo permite letras, números y #", "warning");
            return;
        }
        if (!dosisValida.test(nuevoPaciente.dosis)) {
            Swal.fire("Error", "La dosis solo permite letras y números", "warning");
            return;
        }

        try {
            await api.post("/pacientes", nuevoPaciente);
            Swal.fire("Éxito", "Paciente agregado correctamente", "success");
            setNuevoPaciente({
                nombre: "",
                edad: "",
                doctor: "",
                direccion: "",
                medicamento: "",
                dosis: "",
                fecha: ""
            });
            cargar();
            const modal = document.getElementById("cerrarModal");
            if (modal) modal.click();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo agregar el paciente", "error");
        }
    };

    const exportarExcel = () => {
        const datos = pacientes.map(p => ({
            Nombre: p.nombre,
            Edad: p.edad,
            Doctor: p.doctor,
            Direccion: p.direccion,
            Medicamentos: p.medicamento,
            Dosis: p.dosis,
            Fecha: p.fecha
        }));

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        saveAs(data, "Pacientes.xlsx");
    };

    const eliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar paciente?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/pacientes/${id}`);
            Swal.fire("Eliminado", "Paciente eliminado correctamente", "success");
            cargar();
            // Si el paciente eliminado estaba en edición, limpiar
            if (pacienteEdit.id === id) {
                limpiarFormulario();
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const pacientesFiltrados = pacientes.filter(p =>
        (p.nombre || "").toLowerCase().includes(buscar.toLowerCase())
    );

    // PAGINACIÓN
        const indiceUltimoPaciente = paginaActual * pacientesPorPagina;
        const indicePrimerPaciente = indiceUltimoPaciente - pacientesPorPagina;

        const pacientesPaginados = pacientesFiltrados.slice(
            indicePrimerPaciente,
            indiceUltimoPaciente
        );

        const totalPaginas = Math.ceil(
            pacientesFiltrados.length / pacientesPorPagina
        );
        

    return (
        <div className="container-fluid py-4">
            {/* Header con título y contador */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">🏥 Pacientes</h2>
                    <p className="text-muted mb-0">Total: {pacientes.length}</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPaciente">
                        ➕ Agregar Paciente
                    </button>
                    <button className="btn btn-success" onClick={exportarExcel}>
                        📊 Exportar Excel
                    </button>
                </div>
            </div>

            {/* Formulario de edición de paciente */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4">
                    <h4 className="fw-bold mb-0">✏️ Editar paciente</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={actualizarPaciente}>
                        <div className="row g-3">
                            {/* Foto */}
                            <div className="col-md-12">
                                <label className="form-label fw-bold">📷 Foto</label>
                                <div className="mb-2">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} />
                                    ) : (
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px", backgroundColor: "#f0f0f0" }}>
                                            <span className="text-muted">Sin foto</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <small className="text-muted">Elegir archivo {selectedFile ? `- ${selectedFile.name}` : "- No se ha seleccionado ningún archivo"}</small>
                            </div>

                            {/* Nombre */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">📝 Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={pacienteEdit.nombre}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        if (soloLetras.test(valor) || valor === "") {
                                            setPacienteEdit({ ...pacienteEdit, nombre: valor });
                                        }
                                    }}
                                    placeholder="Nombre completo"
                                />
                            </div>

                            {/* Edad */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">🎂 Edad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    maxLength={3}
                                    value={pacienteEdit.edad}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        if (soloNumeros.test(valor) || valor === "") {
                                            setPacienteEdit({ ...pacienteEdit, edad: valor });
                                        }
                                    }}
                                    placeholder="Edad"
                                />
                            </div>

                            {/* Fecha */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">📅 Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={pacienteEdit.fecha}
                                    onChange={(e) => setPacienteEdit({ ...pacienteEdit, fecha: e.target.value })}
                                />
                            </div>

                            {/* Médico */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">👨‍⚕️ Médico</label>
                                <select
                                    className="form-select"
                                    value={pacienteEdit.doctor}
                                    onChange={(e) => setPacienteEdit({ ...pacienteEdit, doctor: e.target.value })}
                                >
                                    <option value="">Selecciona un médico</option>
                                    {medicos.map((m) => (
                                        <option key={m.id} value={m.nombre}>{m.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dirección */}
                            <div className="col-md-12">
                                <label className="form-label fw-bold">📍 Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={pacienteEdit.direccion}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        if (direccionValida.test(valor) || valor === "") {
                                            setPacienteEdit({ ...pacienteEdit, direccion: valor });
                                        }
                                    }}
                                    placeholder="Dirección completa"
                                />
                            </div>

                            {/* Medicamento */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">💊 Medicamento</label>
                                <select
                                    className="form-select"
                                    value={pacienteEdit.medicamento}
                                    onChange={(e) => setPacienteEdit({ ...pacienteEdit, medicamento: e.target.value })}
                                >
                                    <option value="">Selecciona medicamento</option>
                                    {productos.map((prod) => (
                                        <option key={prod.id} value={prod.nombre}>{prod.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dosis */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">💊 Dosis</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={pacienteEdit.dosis}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        if (dosisValida.test(valor) || valor === "") {
                                            setPacienteEdit({ ...pacienteEdit, dosis: valor });
                                        }
                                    }}
                                    placeholder="Ej: 1 cada 8 hrs. Durante 5 días."
                                />
                            </div>

                            {/* Botones */}
                            <div className="col-12">
                                <hr />
                                <button type="submit" className="btn btn-primary me-2">🔄 Actualizar paciente</button>
                                <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>🧹 Limpiar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Lista de pacientes */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <h4 className="fw-bold mb-3">📋 Lista de pacientes</h4>

                    {/* Buscador */}
                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="🔍 Buscar paciente por nombre..."
                        value={buscar}
                        onChange={(e) => {
                            setBuscar(e.target.value);
                            setPaginaActual(1);
                        }}
                    />

                    {/* Tabla */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Foto</th>
                                    <th>Nombre</th>
                                    <th>Edad</th>
                                    <th>Doctor</th>
                                    <th>Medicamentos</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            {pacientesPaginados.length > 0 ? (
                                pacientesPaginados.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            {p.foto ? (
                                                <img
                                                    src={p.foto}
                                                    alt={p.nombre}
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        objectFit: "cover",
                                                        borderRadius: "50%"
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "40px",
                                                        height: "40px"
                                                    }}
                                                >
                                                    <span className="text-muted small">—</span>
                                                </div>
                                            )}
                                        </td>

                                        <td>{p.nombre}</td>
                                        <td>{p.edad}</td>
                                        <td>{p.doctor}</td>
                                        <td>{p.medicamento} - {p.dosis}</td>
                                        <td>{p.fecha}</td>

                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-1"
                                                onClick={() => seleccionarPaciente(p)}
                                            >
                                                ✏️
                                            </button>

                                            {user?.rol === "admin" && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminar(p.id)}
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No hay pacientes registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                    {
    totalPaginas > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">

            <button
                className="btn btn-outline-primary"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
            >
                ← Anterior
            </button>

            {
                [...Array(totalPaginas)].map((_, index) => (
                    <button
                        key={index}
                        className={
                            paginaActual === index + 1
                                ? "btn btn-primary"
                                : "btn btn-outline-primary"
                        }
                        onClick={() => setPaginaActual(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))
            }

                <button
                    className="btn btn-outline-primary"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(paginaActual + 1)}
                >
                    Siguiente →
                </button>

            </div>
        )
    }
                </div>
            </div>

            {/* MODAL AGREGAR PACIENTE */}
            <div className="modal fade" id="modalPaciente" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content rounded-4 border-0">
                        <div className="modal-header">
                            <h5 className="modal-title">➕ Agregar Paciente</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={agregarPaciente}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.nombre}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                if (soloLetras.test(valor) || valor === "") {
                                                    setNuevoPaciente({ ...nuevoPaciente, nombre: valor });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Edad</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            maxLength={3}
                                            value={nuevoPaciente.edad}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                if (soloNumeros.test(valor) || valor === "") {
                                                    setNuevoPaciente({ ...nuevoPaciente, edad: valor });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Doctor</label>
                                        <select
                                            className="form-select"
                                            required
                                            value={nuevoPaciente.doctor}
                                            onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, doctor: e.target.value })}
                                        >
                                            <option value="">Selecciona un médico</option>
                                            {medicos.map((m) => (
                                                <option key={m.id} value={m.nombre}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Dirección</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.direccion}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                if (direccionValida.test(valor) || valor === "") {
                                                    setNuevoPaciente({ ...nuevoPaciente, direccion: valor });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Medicamento</label>
                                        <select
                                            className="form-select"
                                            required
                                            value={nuevoPaciente.medicamento}
                                            onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, medicamento: e.target.value })}
                                        >
                                            <option value="">Selecciona medicamento</option>
                                            {productos.map((prod) => (
                                                <option key={prod.id} value={prod.nombre}>{prod.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Dosis</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.dosis}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                if (dosisValida.test(valor) || valor === "") {
                                                    setNuevoPaciente({ ...nuevoPaciente, dosis: valor });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Fecha</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.fecha}
                                            onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fecha: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Paciente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pacientes;