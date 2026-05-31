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
    </style>
</head>

<body>

    <!-- 🔥 ENCABEZADO -->
    <div class="header">

        <img src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png" class="logo">

        <div class="titulo">FARMACIA SALUD+</div>
        <div class="subtitulo">Sistema de Gestión Médica</div>

    </div>

    <!-- 🔥 DATOS PACIENTE -->
    <div class="section">
        <p><span class="label">Paciente:</span> {{ $venta->paciente->nombre }}</p>
        <p><span class="label">Fecha:</span> {{ date('d/m/Y', strtotime($venta->created_at)) }}</p>
    </div>

    <!-- 🔥 RECETA -->
    <div class="section box">

        <p><span class="label">Medicamento:</span> {{ $venta->producto->nombre }}</p>

        <p><span class="label">Cantidad:</span> {{ $venta->cantidad }}</p>

        <p><span class="label">Precio Unitario:</span> ${{ $venta->precio }}</p>

        <p><span class="label">Total:</span> ${{ $venta->total }}</p>

    </div>

    <!-- 🔥 INDICACIONES -->
    <div class="section">
        <p class="label">Indicaciones:</p>

        <div class="box">
            Tomar según indicaciones médicas. No exceder la dosis recomendada.
        </div>
    </div>

    <!-- 🔥 FIRMA -->
    <div class="firma">
        ___________________________<br>
        Firma del Médico
    </div>

    <!-- 🔥 FOOTER -->
    <div class="footer">
        Farmacia Salud+ | Tel: 123-456-7890 | Dirección: Zacatecas, México
    </div>

</body>
</html>