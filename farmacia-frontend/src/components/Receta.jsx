import React from "react";

const Receta = React.forwardRef(({ venta }, ref) => {

    if(!venta) return null;

    const items = venta.detalles && venta.detalles.length > 0
        ? venta.detalles
        : [{
            producto: venta.producto,
            cantidad: venta.cantidad
        }];

    const medicoNombre = venta.medico?.nombre || "Médico";
    const medicoEspecialidad = venta.medico?.especialidad || "";
    const medicoCedula = venta.medico?.cedula || "";

    return(
        <div
            ref={ref}
            style={{
                width:"800px",
                padding:"40px",
                fontFamily:"Arial",
                background:"white"
            }}
        >

            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                    <h2 style={{margin:0}}>Centro Médico San Rafael</h2>
                    <small>Receta Médica</small>
                </div>

                <div style={{textAlign:"right"}}>
                    <strong>{medicoNombre}</strong><br/>
                    {medicoEspecialidad}<br/>
                    Cédula: {medicoCedula}
                </div>
            </div>

            <hr/>

            <h2 style={{textAlign:"center"}}>
                RECETA MÉDICA
            </h2>

            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                    <p>
                        <strong>Paciente:</strong>
                        {" "}
                        {venta.paciente?.nombre}
                    </p>
                </div>

                <div>
                    <p>
                        <strong>Fecha:</strong>
                        {" "}
                        {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            <h3>Rp/</h3>

            <div
                style={{
                    border:"1px solid #ccc",
                    padding:"20px",
                    minHeight:"250px"
                }}
            >

                <ul>
                    {items.map((item,i)=>(
                        <li key={i} style={{marginBottom:"15px"}}>
                            <strong>
                                {item.producto?.nombre}
                            </strong>
                            <br/>
                            Tomar {item.cantidad} cada 8 horas por 5 días
                        </li>
                    ))}
                </ul>

            </div>

            <div style={{marginTop:"60px"}}>
                <div style={{width:"300px",textAlign:"center"}}>
                    <hr/>
                    {medicoNombre}
                </div>
            </div>

        </div>
    );
});

export default Receta;