<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Receta Médica</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .logo {
            width: 80px;
        }

        .titulo {
            font-size: 22px;
            font-weight: bold;
        }

        .subtitulo {
            font-size: 14px;
            color: gray;
        }

        .section {
            margin-top: 20px;
        }

        .label {
            font-weight: bold;
        }

        .box {
            border: 1px solid #000;
            padding: 10px;
            margin-top: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table th,
        table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        table th {
            background: #f0f0f0;
        }

        .firma {
            margin-top: 60px;
            text-align: right;
        }

        .footer {
            margin-top: 40px;
            font-size: 12px;
            text-align: center;
            color: gray;
        }

        .total {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="header">

        <img
            src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png"
            class="logo"
        >

        <div class="titulo">
            FARMACIA SALUD+
        </div>

        <div class="subtitulo">
            Sistema de Gestión Médica
        </div>

    </div>

    <!-- DATOS PACIENTE -->

    <div class="section">

        <p>
            <span class="label">Paciente:</span>
            {{ $venta->paciente->nombre ?? 'N/A' }}
        </p>

        <p>
            <span class="label">Edad:</span>
            {{ $venta->paciente->edad ?? 'N/A' }}
        </p>

        <p>
            <span class="label">Fecha:</span>
            {{ $venta->created_at->format('d/m/Y') }}
        </p>

    </div>

    <!-- RECETA MÉDICA -->

    <div class="section box">

        <p>
            <strong>Médico:</strong>
{{ $venta->medico->nombre ?? $venta->paciente->doctor ?? 'N/A' }}
        </p>

        <p>
            <strong>Medicamento Recetado:</strong>
            {{ $venta->paciente->medicamento ?? 'N/A' }}
        </p>

        <p>
            <strong>Dosis:</strong>
            {{ $venta->paciente->dosis ?? 'N/A' }}
        </p>

    </div>

    <!-- PRODUCTOS VENDIDOS -->

    <div class="section">

        <h3>Productos Vendidos</h3>

        <table>

            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>

            <tbody>

                @forelse($venta->detalles as $detalle)

                    <tr>

                        <td>
                            {{ $detalle->producto->nombre ?? 'Producto eliminado' }}
                        </td>

                        <td>
                            {{ $detalle->cantidad }}
                        </td>

                        <td>
                            ${{ number_format($detalle->precio, 2) }}
                        </td>

                        <td>
                            ${{ number_format($detalle->subtotal, 2) }}
                        </td>

                    </tr>

                @empty

                    <tr>
                        <td colspan="4" style="text-align:center;">
                            No hay productos registrados
                        </td>
                    </tr>

                @endforelse

            </tbody>

        </table>

    </div>

    <!-- TOTAL -->

    <div class="section box">

        <h3>Total de la Venta</h3>

        <div class="total">
            ${{ number_format($venta->total, 2) }}
        </div>

    </div>

    <!-- INDICACIONES -->

    <div class="section">

        <p class="label">
            Indicaciones Médicas:
        </p>

        <div class="box">

            {{ $venta->paciente->dosis ?? 'Tomar según indicaciones médicas.' }}

        </div>

    </div>

    <!-- FIRMA -->

    <div class="firma">

        ___________________________

        <br><br>

{{ $venta->medico->nombre ?? $venta->paciente->doctor ?? 'Médico Tratante' }}
    </div>

    <!-- FOOTER -->

    <div class="footer">

        Farmacia Salud+ |
        Sistema de Gestión Médica

    </div>

</body>
</html>
