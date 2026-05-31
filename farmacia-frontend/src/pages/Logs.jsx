import Layout from "../components/Layout";

function Logs() {

    return (

        <Layout>

            <div className="card shadow">

                <div className="card-header">

                    <h3>Logs del Sistema</h3>

                </div>

                <div className="card-body">

                    <table className="table table-striped">

                        <thead>

                            <tr>

                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>Fecha</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>admin</td>

                                <td>Creó producto</td>

                                <td>2026-05-17</td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </Layout>

    );

}

export default Logs;