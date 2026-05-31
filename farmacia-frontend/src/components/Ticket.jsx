import React from "react";

const Ticket = React.forwardRef(({ venta }, ref) => {

    if(!venta) return null;

    const items = venta.detalles && venta.detalles.length > 0
        ? venta.detalles
        : [{
            producto: venta.producto,
            cantidad: venta.cantidad,
            precio: venta.total
        }];

    return(
        <div 
            ref={ref} 
            style={{
                width:"220px",
                padding:"5px",
                fontFamily:"monospace",
                fontSize:"11px"
            }}
        >

            <div style={{textAlign:"center"}}>
                <strong>Farmacia Topicos</strong><br/>
                Ticket de Venta
            </div>

            <hr/>

            <div>
                Fecha:<br/>
                {new Date(venta.created_at || Date.now()).toLocaleString()}
            </div>

            <div>
                Paciente: {venta.paciente?.nombre || "General"}
            </div>

            <hr/>

            <table style={{width:"100%"}}>
                <thead>
                    <tr>
                        <th style={{textAlign:"left"}}>Prod</th>
                        <th>Cant</th>
                        <th style={{textAlign:"right"}}>$</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        items.map((d,i)=>(
                            <tr key={i}>
                                <td>
                                    {d.producto?.nombre}
                                </td>
                                <td style={{textAlign:"center"}}>
                                    {d.cantidad}
                                </td>
                                <td style={{textAlign:"right"}}>
                                    {d.precio}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <hr/>

            <div style={{textAlign:"right"}}>
                <strong>
                    TOTAL: ${venta.total}
                </strong>
            </div>

            <hr/>

            <div style={{textAlign:"center"}}>
                Gracias por su compra
            </div>

        </div>
    );
});

export default Ticket;