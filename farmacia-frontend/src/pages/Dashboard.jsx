import { useEffect, useState, useRef } from "react";
import api from "../services/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

// =========================================
// DATATABLES
// =========================================
import $ from "jquery";

import "datatables.net-dt";
import "datatables.net-buttons-dt";
import "datatables.net-responsive-dt";

import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import JSZip from "jszip";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// =========================================
// CONFIG EXPORTS
// =========================================
window.JSZip = JSZip;

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts.vfs;

// =========================================
// REGISTER CHART
// =========================================
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {

    // =========================================
    // STATES
    // =========================================
    const [totalVentas, setTotalVentas] = useState(0);

    const [totalHoy, setTotalHoy] = useState(0);

    const [productosBajos, setProductosBajos] = useState([]);

    const [ventasPorDia, setVentasPorDia] = useState({});

    const [totalProductos, setTotalProductos] = useState(0);

    const [promedioVentas, setPromedioVentas] = useState(0);

    const [mejorDia, setMejorDia] = useState("");

    const [loading, setLoading] = useState(true);

    const tableRef = useRef(null);

    const dataTable = useRef(null);

    // =========================================
    // LOAD DATA
    // =========================================
    useEffect(() => {

        cargarDatos();

        return () => {

            if (dataTable.current) {

                dataTable.current.destroy(true);

            }

        };

    }, []);

    // =========================================
    // API
    // =========================================
    const cargarDatos = async () => {

        try {

            setLoading(true);

            // =========================================
            // VENTAS
            // =========================================
            const resVentas = await api.get("/ventas");

            const ventasData =
                Array.isArray(resVentas.data)
                    ? resVentas.data
                    : resVentas.data.data || [];

            // =========================================
            // PRODUCTOS
            // =========================================
            const resProductos = await api.get("/productos");

            const productosData =
                Array.isArray(resProductos.data)
                    ? resProductos.data
                    : resProductos.data.data || [];

            // =========================================
            // TOTAL VENTAS
            // =========================================
            const total = ventasData.reduce(
                (acc, venta) =>
                    acc + Number(venta.total || 0),
                0
            );

            setTotalVentas(total);

            // =========================================
            // TOTAL HOY
            // =========================================
            const hoy = new Date().toDateString();

            const ventasHoy = ventasData
                .filter(
                    venta =>
                        new Date(
                            venta.created_at
                        ).toDateString() === hoy
                )
                .reduce(
                    (acc, venta) =>
                        acc + Number(venta.total || 0),
                    0
                );

            setTotalHoy(ventasHoy);

            // =========================================
            // AGRUPAR VENTAS
            // =========================================
            const agrupadas = {};

            ventasData.forEach(venta => {

                if (!venta.created_at) return;

                const fecha = new Date(
                    venta.created_at
                )
                    .toISOString()
                    .split("T")[0];

                agrupadas[fecha] =
                    (agrupadas[fecha] || 0) +
                    Number(venta.total || 0);

            });

            setVentasPorDia(agrupadas);

            // =========================================
            // MEJOR DIA
            // =========================================
            let maxVenta = 0;

            let diaTop = "";

            Object.entries(agrupadas).forEach(
                ([dia, monto]) => {

                    if (monto > maxVenta) {

                        maxVenta = monto;

                        diaTop = dia;

                    }

                }
            );

            setMejorDia(diaTop);

            // =========================================
            // PROMEDIO
            // =========================================
            const promedio =
                ventasData.length > 0
                    ? total / ventasData.length
                    : 0;

            setPromedioVentas(promedio);

            // =========================================
            // STOCK BAJO
            // =========================================
            const bajos = productosData.filter(
                producto =>
                    Number(producto.stock) <=
                    Number(producto.stock_minimo || 10)
            );

            setProductosBajos(bajos);

            setTotalProductos(productosData.length);

            // =========================================
            // INIT DATATABLE
            // =========================================
            setTimeout(() => {

                if (
                    dataTable.current &&
                    $.fn.DataTable.isDataTable(
                        tableRef.current
                    )
                ) {

                    dataTable.current.destroy(true);

                }

                dataTable.current =
                    $(tableRef.current).DataTable({

                        responsive: true,

                        destroy: true,

                        paging: true,

                        pageLength: 5,

                        searching: true,

                        ordering: true,

                        autoWidth: false,

                        dom: "Bfrtip",

                        buttons: [

                            {
                                extend: "copyHtml5",
                                text: "📋 Copiar",
                                className:
                                    "btn btn-secondary btn-sm"
                            },

                            {
                                extend: "csvHtml5",
                                text: "📄 CSV",
                                className:
                                    "btn btn-info btn-sm"
                            },

                            {
                                extend: "excelHtml5",
                                text: "📗 Excel",
                                className:
                                    "btn btn-success btn-sm"
                            },

                            {
                                extend: "pdfHtml5",
                                text: "📕 PDF",
                                className:
                                    "btn btn-danger btn-sm"
                            },

                            {
                                extend: "print",
                                text: "🖨 Imprimir",
                                className:
                                    "btn btn-primary btn-sm"
                            }

                        ],

                        language: {

                            search: "🔍 Buscar:",

                            lengthMenu:
                                "Mostrar _MENU_ registros",

                            info:
                                "Mostrando _START_ a _END_ de _TOTAL_ registros",

                            zeroRecords:
                                "No se encontraron registros",

                            emptyTable:
                                "No hay datos disponibles",

                            paginate: {

                                first: "Primero",

                                last: "Último",

                                next: "➡",

                                previous: "⬅"

                            }

                        }

                    });

            }, 300);

        } catch (error) {

            console.error(
                "Error dashboard:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    // =========================================
    // CHART DATA
    // =========================================
    const labels =
        Object.keys(ventasPorDia).sort();

    const barData = {

        labels,

        datasets: [

            {

                label: "Ventas",

                data: labels.map(
                    label => ventasPorDia[label]
                ),

                backgroundColor:
                    "rgba(59,130,246,0.8)",

                borderRadius: 10

            }

        ]

    };

    const doughnutData = {

        labels: [
            "Stock Bajo",
            "Stock OK"
        ],

        datasets: [

            {

                data: [

                    productosBajos.length,

                    totalProductos -
                    productosBajos.length

                ],

                backgroundColor: [
                    "#ef4444",
                    "#22c55e"
                ]

            }

        ]

    };

    // =========================================
    // LOADING
    // =========================================
    if (loading) {

        return (

            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3">
                    Cargando dashboard...
                </p>

            </div>

        );

    }

    return (

        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="mb-4">

                <h2 className="fw-bold">
                    📊 Dashboard ERP
                </h2>

                <p className="text-muted">
                    Panel administrativo farmacia
                </p>

            </div>

            {/* KPI */}
            <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Ventas
                            </h6>

                            <h3 className="fw-bold">
                                $
                                {totalVentas.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Ventas Hoy
                            </h6>

                            <h3 className="fw-bold">
                                $
                                {totalHoy.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Stock Bajo
                            </h6>

                            <h3 className="fw-bold text-danger">
                                {productosBajos.length}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Productos
                            </h6>

                            <h3 className="fw-bold">
                                {totalProductos}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* EXTRA */}
            <div className="row g-4 mt-2">

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Promedio por venta
                            </h6>

                            <h3 className="fw-bold text-primary">
                                $
                                {promedioVentas.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Mejor día
                            </h6>

                            <h3 className="fw-bold text-success">
                                {mejorDia || "N/A"}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* CHARTS */}
            <div className="row g-4 mt-2">

                <div className="col-lg-8">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body">

                            <h5 className="fw-bold mb-4">
                                📊 Ventas por día
                            </h5>

                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />

                        </div>

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body">

                            <h5 className="fw-bold mb-4">
                                📦 Inventario
                            </h5>

                            <Doughnut
                                data={doughnutData}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* ALERT */}
            {
                productosBajos.length > 0 && (

                    <div className="alert alert-warning mt-4">

                        ⚠️ Hay productos con stock crítico.

                    </div>

                )
            }

            {/* TABLE */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">

                <div className="card-body">

                    <h5 className="fw-bold mb-4">

                        🧾 Productos con bajo stock

                    </h5>

                    <table
                        ref={tableRef}
                        className="table table-hover nowrap"
                        style={{ width: "100%" }}
                    >

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Producto</th>

                                <th>Stock</th>

                                <th>Stock mínimo</th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                productosBajos.map(
                                    producto => (

                                        <tr
                                            key={
                                                producto.id
                                            }
                                        >

                                            <td>
                                                {producto.id}
                                            </td>

                                            <td>
                                                {producto.nombre}
                                            </td>

                                            <td>

                                                <span className="badge bg-danger">

                                                    {
                                                        producto.stock
                                                    }

                                                </span>

                                            </td>

                                            <td>
                                                {
                                                    producto.stock_minimo || 10
                                                }
                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;