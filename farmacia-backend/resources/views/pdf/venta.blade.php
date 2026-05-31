<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Factura</title>

    <style>

        body{
            font-family: Arial, sans-serif;
            color:#111;
        }

        .header{
            text-align:center;
            margin-bottom:20px;
        }

        table{
            width:100%;
            border-collapse:collapse;
        }

        table th,
        table td{
            border:1px solid #ddd;
            padding:10px;
        }

        table th{
            background:#2563eb;
            color:white;
        }

    </style>

</head>
<body>

    <div class="header">

        <h1>MyPharmacy</h1>

        <p>Factura de Venta</p>

    </div>

    <table>

        <tr>
            <th>ID</th>
            <td>{{ $venta->id }}</td>
        </tr>

        <tr>
            <th>Total</th>
            <td>${{ $venta->total }}</td>
        </tr>

        <tr>
            <th>Fecha</th>
            <td>{{ $venta->created_at }}</td>
        </tr>

    </table>

</body>
</html>
