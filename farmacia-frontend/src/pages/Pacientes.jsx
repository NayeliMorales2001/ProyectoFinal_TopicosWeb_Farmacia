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

    let user = null;

try {

    const storedUser =
        localStorage.getItem("user");

    user = storedUser
        ? JSON.parse(storedUser)
        : null;

} catch {

    user = null;

}

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

    const direccionValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]*$/;

    const dosisValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/;

    const soloNumeros = /^[0-9]*$/;

    // =========================
    // MODAL AGREGAR
    // =========================

    const [nuevoPaciente, setNuevoPaciente] = useState({
        nombre: "",
        edad: "",
        doctor: "",
        direccion: "",
        medicamento: "",
        dosis: "",
        fecha: ""
    });

    // =========================================
    // CARGAR
    // =========================================

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {

        // PACIENTES
        try {

            const resPacientes =
                await api.get("/pacientes");

            setPacientes(

                Array.isArray(resPacientes.data)

                    ? resPacientes.data

                    : resPacientes.data?.data || []
            );

        } catch (error) {

            console.error(
                "Error pacientes:",
                error
            );

            setPacientes([]);
        }

        // PRODUCTOS
        try {

            const resProductos =
                await api.get("/productos");

            setProductos(

                Array.isArray(resProductos.data)

                    ? resProductos.data

                    : resProductos.data?.data || []
            );

        } catch (error) {

            console.error(
                "Error productos:",
                error
            );

            setProductos([]);
        }

        // MEDICOS
        try {

            const resMedicos =
                await api.get("/medicos");

            setMedicos(

                Array.isArray(resMedicos.data)

                    ? resMedicos.data

                    : resMedicos.data?.data || []
            );

        } catch (error) {

            console.error(
                "Error medicos:",
                error
            );

            setMedicos([]);
        }
    };

    // =========================================
    // AGREGAR PACIENTE
    // =========================================

    const agregarPaciente = async (e) => {

        e.preventDefault();


        if (!soloLetras.test(nuevoPaciente.nombre)) {

    Swal.fire(
        "Error",
        "El nombre solo puede contener letras",
        "warning"
    );

    return;
}

if (!direccionValida.test(nuevoPaciente.direccion)) {

    Swal.fire(
        "Error",
        "La dirección solo permite letras, números y #",
        "warning"
    );

    return;
}

if (!dosisValida.test(nuevoPaciente.dosis)) {

    Swal.fire(
        "Error",
        "La dosis solo permite letras y números",
        "warning"
    );

    return;
}

        try {

            await api.post(
                "/pacientes",
                nuevoPaciente
            );

            Swal.fire(
                "Éxito",
                "Paciente agregado correctamente",
                "success"
            );

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

            // cerrar modal bootstrap
            const modal =
                document.getElementById("cerrarModal");

            if (modal) {
                modal.click();
            }

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudo agregar el paciente",
                "error"
            );
        }
    };

    // =========================================
    // EXPORTAR EXCEL
    // =========================================

    const exportarExcel = () => {

        const datos = pacientes.map(p => ({

            Nombre: p.nombre,

            Edad: p.edad,

            Doctor: p.doctor,

            Direccion: p.direccion,

            Medicamentos:
                p.medicamento,

            Dosis: p.dosis,

            Fecha: p.fecha
        }));

        const ws =
            XLSX.utils.json_to_sheet(datos);

        const wb =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Pacientes"
        );

        const excelBuffer = XLSX.write(
            wb,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

        const data = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
            }
        );

        saveAs(data, "Pacientes.xlsx");
    };

    // =========================================
    // ELIMINAR
    // =========================================

    const eliminar = async (id) => {

        const result = await Swal.fire({

            title: "¿Eliminar paciente?",

            text:
                "Esta acción no se puede deshacer",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText:
                "Sí, eliminar",

            cancelButtonText:
                "Cancelar"
        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(
                `/pacientes/${id}`
            );

            Swal.fire(
                "Eliminado",
                "Paciente eliminado correctamente",
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

    const pacientesFiltrados =
        pacientes.filter(p =>

            (p.nombre || "")
                .toLowerCase()
                .includes(
                    buscar.toLowerCase()
                )
        );

    return (

        <div className="container-fluid py-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h2 className="fw-bold mb-1">
                        🏥 Gestión de Pacientes
                    </h2>

                    <p className="text-muted mb-0">
                        Administración de pacientes
                    </p>

                </div>

                <div className="d-flex gap-2">

                    {/* BOTON AGREGAR */}

                    <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalPaciente"
                    >
                        ➕ Agregar Paciente
                    </button>

                    {/* EXPORTAR */}

                    <button
                        className="btn btn-success"
                        onClick={exportarExcel}
                    >
                        📊 Exportar Excel
                    </button>

                </div>

            </div>

            {/* CARD */}

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    {/* BUSCADOR */}

                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="🔍 Buscar paciente..."
                        value={buscar}
                        onChange={(e) =>
                            setBuscar(
                                e.target.value
                            )
                        }
                    />

                    {/* TABLA */}

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead
                                className="table-dark"
                            >

                                <tr>

                                    <th>ID</th>

                                    <th>Nombre</th>

                                    <th>Edad</th>

                                    <th>Doctor</th>

                                    <th>Dirección</th>

                                    <th>Medicamentos</th>

                                    <th>Dosis</th>

                                    <th>Fecha</th>

                                    {
                        user?.rol === "admin" && (
                            <th>Acciones</th>
                        )
                    }

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    pacientesFiltrados
                                        .length > 0 ? (

                                        pacientesFiltrados.map((p) => (

                                            <tr key={p.id}>

                                                <td>
                                                    {p.id}
                                                </td>

                                                <td>
                                                    {p.nombre}
                                                </td>

                                                <td>
                                                    {p.edad}
                                                </td>

                                                <td>
                                                    {p.doctor}
                                                </td>

                                                <td>
                                                    {p.direccion}
                                                </td>

                                                <td>
                                                    {p.medicamento}
                                                </td>

                                                <td>
                                                    {p.dosis}
                                                </td>

                                                <td>
                                                    {p.fecha}
                                                </td>

                                                <td>

                                                   {
                                            user?.rol === "admin" && (

                                                <td>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            eliminar(p.id)
                                                        }
                                                    >
                                                        🗑️
                                                    </button>

                                                </td>

                                            )
                                        }

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="text-center py-4"
                                            >
                                                No hay pacientes registrados
                                            </td>

                                        </tr>

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* MODAL AGREGAR PACIENTE */}

            <div
                className="modal fade"
                id="modalPaciente"
                tabIndex="-1"
                aria-hidden="true"
            >

                <div className="modal-dialog modal-lg">

                    <div className="modal-content rounded-4 border-0">

                        <div className="modal-header">

                            <h5 className="modal-title">
                                ➕ Agregar Paciente
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>

                        </div>

                        <form onSubmit={agregarPaciente}>

                            <div className="modal-body">

                                <div className="row g-3">

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Nombre
                                        </label>

                                       <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.nombre}
                                            onChange={(e) => {

                                                const valor = e.target.value;

                                                if (soloLetras.test(valor)) {

                                                    setNuevoPaciente({
                                                        ...nuevoPaciente,
                                                        nombre: valor
                                                    });

                                                }

                                            }}
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Edad
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            maxLength={3}
                                            value={nuevoPaciente.edad}
                                            onChange={(e) => {

                                                const valor = e.target.value;

                                                if (soloNumeros.test(valor)) {

                                                    setNuevoPaciente({
                                                        ...nuevoPaciente,
                                                        edad: valor
                                                    });

                                                }

                                            }}
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Doctor
                                        </label>

                                        <select
                                            className="form-select"
                                            required
                                            value={nuevoPaciente.doctor}
                                            onChange={(e) =>
                                                setNuevoPaciente({
                                                    ...nuevoPaciente,
                                                    doctor: e.target.value
                                                })
                                            }
                                        >

                                            <option value="">
                                                Selecciona un médico
                                            </option>

                                            {
                                                medicos.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.nombre}
                                                    >
                                                        {m.nombre}
                                                    </option>
                                                ))
                                            }

                                        </select>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Dirección
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.direccion}
                                            onChange={(e) => {

                                                const valor = e.target.value;

                                                if (direccionValida.test(valor)) {

                                                    setNuevoPaciente({
                                                        ...nuevoPaciente,
                                                        direccion: valor
                                                    });

                                                }

                                            }}
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Medicamento
                                        </label>

                                        <select
                                            className="form-select"
                                            required
                                            value={nuevoPaciente.medicamento}
                                            onChange={(e) =>
                                                setNuevoPaciente({
                                                    ...nuevoPaciente,
                                                    medicamento: e.target.value
                                                })
                                            }
                                        >

                                            <option value="">
                                                Selecciona medicamento
                                            </option>

                                            {
                                                productos.map((prod) => (
                                                    <option
                                                        key={prod.id}
                                                        value={prod.nombre}
                                                    >
                                                        {prod.nombre}
                                                    </option>
                                                ))
                                            }

                                        </select>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Dosis
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.dosis}
                                            onChange={(e) => {

                                                const valor = e.target.value;

                                                if (dosisValida.test(valor)) {

                                                    setNuevoPaciente({
                                                        ...nuevoPaciente,
                                                        dosis: valor
                                                    });

                                                }

                                            }}
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Fecha
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={nuevoPaciente.fecha}
                                            onChange={(e) =>
                                                setNuevoPaciente({
                                                    ...nuevoPaciente,
                                                    fecha: e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    id="cerrarModal"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
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