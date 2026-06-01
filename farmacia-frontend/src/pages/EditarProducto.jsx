import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

function EditarProducto() {

  const { id } = useParams();

  const navigate = useNavigate();

  // =========================================
  // TIPOS DE PRODUCTOS
  // =========================================

  const tipos = [
    "Antibiótico",
    "Antigripal",
    "Analgésico",
    "Antiinflamatorio",
    "Jarabe",
    "Vitaminas",
    "Suplemento",
    "Antihistamínico",
    "Antiacido",
    "Dermatológico",
    "Pediátrico",
    "Controlado"
  ];

  const [form, setForm] = useState({

    nombre: "",
    codigo: "",
    tipo: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    categoria_id: ""

  });

  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // CARGAR DATOS
  // =========================================

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const [resProducto, resCategorias] =
          await Promise.all([

            api.get(`/productos/${id}`),

            api.get("/categorias"),

          ]);

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

        setCategorias(

          Array.isArray(resCategorias.data)

            ? resCategorias.data

            : resCategorias.data.data || []

        );

      } catch (error) {

        console.error(
          "Error cargando producto",
          error
        );

        Swal.fire(
          "Error",
          "No se pudo cargar el producto",
          "error"
        );

      } finally {

        setLoading(false);

      }

    };

    cargarDatos();

  }, [id]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  // =========================================
  // ACTUALIZAR
  // =========================================
const actualizar = async () => {

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

    try {

        const formData = new FormData();

        formData.append("_method", "PUT");

        formData.append("nombre", form.nombre.trim());
        formData.append("codigo", form.codigo.trim());
        formData.append("tipo", form.tipo);
        formData.append("precio", form.precio);
        formData.append("stock", form.stock);
        formData.append("stock_minimo", form.stock_minimo || 0);
        formData.append("categoria_id", form.categoria_id);

        await api.post(`/productos/${id}`, formData);

        Swal.fire(
            "Actualizado",
            "Producto actualizado correctamente",
            "success"
        );

        navigate("/productos");

    } catch (error) {

        console.log(error.response?.data);

        Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo actualizar",
            "error"
        );
    }
};

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "70vh"
        }}
      >

        <div className="text-center">

          <div
            className="spinner-border text-primary"
            style={{
              width: "3rem",
              height: "3rem"
            }}
          ></div>

          <p className="mt-3 fw-semibold text-secondary">

            Cargando producto...

          </p>

        </div>

      </div>

    );

  }

  // =========================================
  // VISTA
  // =========================================

  return (

    <div
      className="container py-5"
      style={{
        maxWidth: "900px"
      }}
    >

      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{
          backgroundColor: "#ffffff"
        }}
      >

        <div
          className="p-4 text-white"
          style={{
            background:
              "linear-gradient(135deg, #0d6efd, #0a58ca)",
          }}
        >

          <h2 className="mb-1 fw-bold">

            Editar Producto

          </h2>

          <p className="mb-0 opacity-75">

            Actualiza la información del producto

          </p>

        </div>

        <div className="card-body p-4 p-md-5">

          <div className="row g-4">

            {/* NOMBRE */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Nombre

              </label>

              <input
                type="text"
                name="nombre"
                className="form-control form-control-lg rounded-3"
                value={form.nombre}
                onChange={handleChange}
              />

            </div>

            {/* CODIGO */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Código

              </label>

              <input
                type="text"
                name="codigo"
                className="form-control form-control-lg rounded-3"
                value={form.codigo}
                onChange={handleChange}
              />

            </div>

            {/* TIPO */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Tipo

              </label>

              <select
                name="tipo"
                className="form-select form-select-lg rounded-3"
                value={form.tipo}
                onChange={handleChange}
              >

                <option value="">
                  Seleccione tipo
                </option>

                {
                  tipos.map((tipo, index) => (

                    <option
                      key={index}
                      value={tipo}
                    >
                      {tipo}
                    </option>

                  ))
                }

              </select>

            </div>

            {/* PRECIO */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Precio

              </label>

              <input
                type="number"
                name="precio"
                className="form-control form-control-lg rounded-3"
                value={form.precio}
                onChange={handleChange}
              />

            </div>

            {/* STOCK */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Stock

              </label>

              <input
                type="number"
                name="stock"
                className="form-control form-control-lg rounded-3"
                value={form.stock}
                onChange={handleChange}
              />

            </div>

            {/* STOCK MINIMO */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">

                Stock mínimo

              </label>

              <input
                type="number"
                name="stock_minimo"
                className="form-control form-control-lg rounded-3"
                value={form.stock_minimo}
                onChange={handleChange}
              />

            </div>

            {/* CATEGORIA */}

            <div className="col-12">

              <label className="form-label fw-semibold">

                Categoría

              </label>

              <select
                name="categoria_id"
                className="form-select form-select-lg rounded-3"
                value={form.categoria_id}
                onChange={handleChange}
              >

                <option value="">
                  Seleccione categoría
                </option>

                {
                  categorias.map((c) => (

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

          {/* BOTON */}

          <div className="d-flex justify-content-end mt-5">

            <button
              className="btn btn-primary btn-lg px-5 rounded-3 fw-semibold shadow-sm"
              onClick={actualizar}
            >

              Actualizar Producto

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EditarProducto;