import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

function CrearProducto() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [categorias, setCategorias] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        codigo: "",
        tipo: "",
        precio: "",
        stock: "",
        stock_minimo: "",
        categoria_id: ""
    });

    useEffect(() => {

        cargarDatos();

    }, []);

    const cargarDatos = async () => {

        setLoading(true);

        try {

            // =====================================
            // CARGAR CATEGORÍAS
            // =====================================

            const resCategorias =
                await api.get("/categorias");

            const dataCategorias =
                Array.isArray(resCategorias.data)
                    ? resCategorias.data
                    : resCategorias.data.data || [];

            setCategorias(dataCategorias);

            // =====================================
            // SI ES EDICIÓN
            // =====================================

            if (id) {

                const resProducto =
                    await api.get(`/productos/${id}`);

                const p =
                    resProducto.data.data ||
                    resProducto.data;

                setForm({
                    nombre: p.nombre || "",
                    codigo: p.codigo || "",
                    tipo: p.tipo || "",
                    precio: p.precio || "",
                    stock: p.stock || "",
                    stock_minimo:
                        p.stock_minimo || "",
                    categoria_id:
                        p.categoria_id || ""
                });

            }

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar los datos",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

// =====================================
// HANDLE CHANGE CON VALIDACIONES
// =====================================

const handleChange = (e) => {

    const { name, value } = e.target;

    let nuevoValor = value;

    // =====================================
    // NOMBRE -> SOLO LETRAS Y ESPACIOS
    // =====================================

    if (name === "nombre") {

        nuevoValor = value.replace(
            /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
            ""
        );

    }

    // =====================================
    // CODIGO -> SOLO LETRAS Y NUMEROS
    // =====================================

    if (name === "codigo") {

        nuevoValor = value.replace(
            /[^a-zA-Z0-9]/g,
            ""
        );

    }

    // =====================================
    // PRECIO -> SOLO NUMEROS Y DECIMAL
    // =====================================

    if (name === "precio") {

        nuevoValor = value.replace(
            /[^0-9.]/g,
            ""
        );

        const partes =
            nuevoValor.split(".");

        if (partes.length > 2) {

            nuevoValor =
                partes[0] +
                "." +
                partes.slice(1).join("");

        }

    }

    // =====================================
    // STOCK Y STOCK MINIMO
    // SOLO NUMEROS ENTEROS
    // =====================================

    if (
        name === "stock" ||
        name === "stock_minimo"
    ) {

        nuevoValor =
            value.replace(/\D/g, "");

    }

    setForm({
        ...form,
        [name]: nuevoValor
    });

};

    // =====================================
// GUARDAR
// =====================================

const guardar = async (e) => {

    e.preventDefault();

    if (
        !form.nombre ||
        !form.codigo ||
        !form.tipo ||
        !form.precio ||
        !form.stock ||
        !form.categoria_id
    ) {

        Swal.fire(
            "Error",
            "Completa todos los campos obligatorios",
            "warning"
        );

        return;

    }

    // =====================================
    // VALIDACIONES
    // =====================================

    if (
        !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(
            form.nombre
        )
    ) {

        Swal.fire(
            "Error",
            "El nombre solo puede contener letras",
            "warning"
        );

        return;

    }

    if (
        !/^[a-zA-Z0-9]+$/.test(
            form.codigo
        )
    ) {

        Swal.fire(
            "Error",
            "El código solo puede contener letras y números",
            "warning"
        );

        return;

    }

    if (
        isNaN(form.precio) ||
        Number(form.precio) <= 0
    ) {

        Swal.fire(
            "Error",
            "Ingrese un precio válido",
            "warning"
        );

        return;

    }

    if (
        isNaN(form.stock) ||
        Number(form.stock) < 0
    ) {

        Swal.fire(
            "Error",
            "Ingrese un stock válido",
            "warning"
        );

        return;

    }

    if (
        form.stock_minimo &&
        (
            isNaN(form.stock_minimo) ||
            Number(form.stock_minimo) < 0
        )
    ) {

        Swal.fire(
            "Error",
            "Ingrese un stock mínimo válido",
            "warning"
        );

        return;

    }

    try {

        const payload = {

            nombre:
                form.nombre.trim(),

            codigo:
                form.codigo.trim(),

            tipo:
                form.tipo,

            precio:
                parseFloat(form.precio),

            stock:
                parseInt(form.stock),

            stock_minimo:
                parseInt(
                    form.stock_minimo || 0
                ),

            categoria_id:
                parseInt(
                    form.categoria_id
                )

        };

        console.log(payload);

        if (id) {

            await api.put(
                `/productos/${id}`,
                payload
            );

            Swal.fire(
                "Actualizado",
                "Producto actualizado correctamente",
                "success"
            );

        } else {

            await api.post(
                "/productos",
                payload
            );

            Swal.fire(
                "Guardado",
                "Producto creado correctamente",
                "success"
            );

        }

        navigate("/productos");

    } catch (error) {

        console.log(
            error.response?.data
        );

        Swal.fire(
            "Error",
            error.response?.data?.message ||
            "No se pudo guardar",
            "error"
        );

    }

};

    return (

        <div className="container-fluid py-4">

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    <h2 className="fw-bold mb-4">

                        {
                            id
                                ? "✏️ Editar Producto"
                                : "➕ Crear Producto"
                        }

                    </h2>

                    {
                        loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary"></div>

                            </div>

                        ) : (

                            <form onSubmit={guardar}>

                                <div className="row g-3">

                                    {/* NOMBRE */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={form.nombre}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* CÓDIGO */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Código
                                        </label>

                                        <input
                                            type="text"
                                            name="codigo"
                                            className="form-control"
                                            value={form.codigo}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* TIPO */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Presentación
                                        </label>

                                        <select
                                            name="tipo"
                                            className="form-select"
                                            value={form.tipo}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Seleccionar
                                            </option>

                                            <option value="Tabletas">
                                                Tabletas
                                            </option>

                                            <option value="Capsulas">
                                                Cápsulas
                                            </option>

                                            <option value="Jarabe">
                                                Jarabe
                                            </option>

                                            <option value="Inyeccion">
                                                Inyección
                                            </option>

                                            <option value="Crema">
                                                Crema
                                            </option>

                                            <option value="Gotas">
                                                Gotas
                                            </option>

                                            <option value="Spray">
                                                Spray
                                            </option>

                                            <option value="Suspension">
                                                Suspensión
                                            </option>

                                        </select>

                                    </div>

                                    {/* PRECIO */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Precio
                                        </label>

                                        <input
                                        type="text"
                                        name="precio"
                                        className="form-control"
                                        value={form.precio}
                                        onChange={handleChange}
                                    />

                                    </div>

                                    {/* STOCK */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Stock
                                        </label>

                                        <input
                                        type="text"
                                        name="stock"
                                        className="form-control"
                                        value={form.stock}
                                        onChange={handleChange}
                                    />

                                    </div>

                                    {/* STOCK MÍNIMO */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Stock mínimo
                                        </label>

                                        <input
                                            type="text"
                                            name="stock_minimo"
                                            className="form-control"
                                            value={form.stock_minimo}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* CATEGORÍA */}

                                    <div className="col-md-12">

                                        <label className="form-label">
                                            Categoría farmacéutica
                                        </label>

                                        <select
                                            className="form-select"
                                            name="categoria_id"
                                            value={form.categoria_id}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Seleccionar categoría
                                            </option>

                                            {
                                                categorias.map(c => (

                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.nombre}
                                                    </option>

                                                ))
                                            }

                                        </select>

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-4"
                                >
                                    {
                                        id
                                            ? "Actualizar Producto"
                                            : "Guardar Producto"
                                    }
                                </button>

                            </form>

                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default CrearProducto;