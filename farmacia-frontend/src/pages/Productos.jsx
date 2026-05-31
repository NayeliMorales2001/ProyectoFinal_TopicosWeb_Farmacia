import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
    toastSuccess,
    toastError
} from "../utils/toast";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Productos() {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const navigate = useNavigate();

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

    // =========================================
    // CARGAR PRODUCTOS
    // =========================================
    useEffect(() => {

        cargarProductos();

    }, []);

    const cargarProductos = async () => {

        try {

            setLoading(true);

            const res = await api.get("/productos");

            setProductos(
                res.data.data || res.data
            );

        } catch (error) {

            console.log(error);

            toastError(
                "Error al cargar productos"
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================================
    // COLOR STOCK
    // =========================================
    const getStockColor = (
        stock,
        stockMinimo
    ) => {

        if (stock <= stockMinimo) {

            return "badge bg-danger px-3 py-2";
        }

        if (stock <= stockMinimo + 5) {

            return "badge bg-warning text-dark px-3 py-2";
        }

        return "badge bg-success px-3 py-2";
    };

    // =========================================
    // ELIMINAR
    // =========================================
    const eliminarProducto = (id) => {

        Swal.fire({

            title: "¿Eliminar producto?",

            text: "El producto será eliminado",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Sí eliminar",

            cancelButtonText: "Cancelar"

        }).then(async (result) => {

            if (result.isConfirmed) {

                try {

                    await api.delete(
                        `/productos/${id}`
                    );

                    toastSuccess(
                        "Producto eliminado"
                    );

                    cargarProductos();

                } catch (error) {

                    console.log(error);

                    toastError(
                        "No se pudo eliminar"
                    );
                }
            }
        });
    };

    // =========================================
    // EXPORTAR EXCEL
    // =========================================
    const exportarExcel = () => {

        const data = productos.map(p => ({

            ID: p.id,

            Nombre: p.nombre,

            Código: p.codigo,

            Tipo: p.tipo,

            Precio: p.precio,

            Stock: p.stock,

            "Stock mínimo":
                p.stock_minimo,

            Categoría:
                p.categoria?.nombre || "N/A"
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(data);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Productos"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

        const fileData = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        saveAs(fileData, "Productos.xlsx");
    };

    // =========================================
    // FILTRO
    // =========================================
    const productosFiltrados =
        productos.filter(p =>

            p.nombre
                ?.toLowerCase()
                .includes(
                    busqueda.toLowerCase()
                )

            ||

            p.codigo
                ?.toLowerCase()
                .includes(
                    busqueda.toLowerCase()
                )
        );

    return (

        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h2 className="fw-bold mb-1">
                        📦 Gestión de Productos
                    </h2>

                    <p className="text-muted mb-0">
                        Administra el inventario
                    </p>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-success"
                        onClick={exportarExcel}
                    >
                        📊 Exportar
                    </button>

                    {
                        user?.rol === "admin" && (

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "/productos/crear"
                                    )
                                }
                            >
                                ➕ Nuevo
                            </button>

                        )
                    }

                </div>

            </div>

            {/* CARD */}
            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    {/* BUSCADOR */}
                    <input
                        className="form-control mb-4"
                        placeholder="🔍 Buscar producto..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                    />

                    {/* LOADING */}
                    {
                        loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary" />

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table align-middle table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Imagen</th>

                                            <th>ID</th>

                                            <th>Nombre</th>

                                            <th>Código</th>

                                            <th>Tipo</th>

                                            <th>Precio</th>

                                            <th>Stock</th>

                                            <th>Categoría</th>

                                            {
                                                user?.rol === "admin" && (
                                                    <th>Acciones</th>
                                                )
                                            }

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            productosFiltrados.map((row) => (

                                                <tr key={row.id}>

                                                    <td>

                                                        {
                                                            row.imagen ? (

                                                                <img
                                                                    src={`http://127.0.0.1:8000/storage/${row.imagen}`}
                                                                    alt={row.nombre}
                                                                    width="60"
                                                                    height="60"
                                                                    className="rounded object-fit-cover"
                                                                />

                                                            ) : (

                                                                <span className="text-muted">
                                                                    Sin imagen
                                                                </span>

                                                            )
                                                        }

                                                    </td>

                                                    <td>{row.id}</td>

                                                    <td>{row.nombre}</td>

                                                    <td>{row.codigo}</td>

                                                    <td>{row.tipo}</td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            row.precio
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={getStockColor(
                                                                row.stock,
                                                                row.stock_minimo
                                                            )}
                                                        >
                                                            {row.stock}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            row.categoria?.nombre || "N/A"
                                                        }
                                                    </td>

                                                    {
                                                        user?.rol === "admin" && (

                                                            <td>

                                                                <div className="d-flex gap-2">

                                                                    <button
                                                                        className="btn btn-warning btn-sm"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/productos/editar/${row.id}`
                                                                            )
                                                                        }
                                                                    >
                                                                        ✏️
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() =>
                                                                            eliminarProducto(row.id)
                                                                        }
                                                                    >
                                                                        🗑️
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        )
                                                    }

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>
    );
}

export default Productos;