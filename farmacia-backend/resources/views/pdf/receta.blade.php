<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Receta Médica</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .logo {
            width: 80px;
            margin-bottom: 10px;
        }

        .titulo {
            font-size: 24px;
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
            padding: 15px;
            margin-top: 10px;
            border-radius: 5px;
        }

        .producto {
            margin-bottom: 15px;
        }

        .producto hr {
            margin-top: 10px;
        }

        .total {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            text-align: right;
        }

        .firma {
            margin-top: 60px;
            text-align: right;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: gray;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th,
        table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }

        table th {
            background: #f2f2f2;
        }
    </style>
</head>

<body>

    <!-- ENCABEZADO -->
    <div class="header">

        <img
            src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png"
            class="logo">

        <div class="titulo">
            FARMACIA SALUD+
        </div>

        <div class="subtitulo">
            Sistema de Gestión Médica
        </div>

    </div>

    <!-- DATOS GENERALES -->
    <div class="section">

        <p>
            <span class="label">Folio Venta:</span>
            #{{ $venta->id }}
        </p>

        <p>
            <span class="label">Paciente:</span>
            {{ $venta->paciente->nombre ?? 'Sin paciente' }}
        </p>

        <p>
            <span class="label">Médico:</span>
            {{ $venta->medico->nombre ?? 'Sin médico' }}
        </p>

        <p>
            <span class="label">Fecha:</span>
            {{ date('d/m/Y H:i', strtotime($venta->created_at)) }}
        </p>

    </div>

    <!-- PRODUCTOS -->
    <div class="section">

        <h3>Detalle de Productos</h3>

        <table>

            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>

            <tbody>

                @foreach($venta->detalles as $detalle)

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

                @endforeach

            </tbody>

        </table>

        <div class="total">
            Total: ${{ number_format($venta->total, 2) }}
        </div>

    </div>

    <!-- INDICACIONES -->
    <div class="section">

        <p class="label">
            Indicaciones:
        </p>

        <div class="box">
            Tomar los medicamentos según las indicaciones médicas.
            No exceder la dosis recomendada.
        </div>

    </div>

    <!-- FIRMA -->
    <div class="firma">

        ___________________________

        <br>

        Dr(a). {{ $venta->medico->nombre ?? '' }}

    </div>

    <!-- FOOTER -->
    <div class="footer">

        Farmacia Salud+ <br>

        Sistema ERP de Farmacia

    </div>

</body>

</html>
