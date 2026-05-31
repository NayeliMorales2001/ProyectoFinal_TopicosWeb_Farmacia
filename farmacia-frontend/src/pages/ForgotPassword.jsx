import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8000/api/forgot-password",
                { email }
            );

            setMessage(response.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Error al enviar correo"
            );
        }
    };

    return (

        <div className="container mt-5">

            <div className="card p-4 shadow">

                <h2>
                    Recuperar Contraseña
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        className="form-control mt-3"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <button
                        className="btn btn-primary mt-3"
                    >
                        Enviar enlace
                    </button>

                </form>

                {message && (
                    <div className="alert alert-info mt-3">
                        {message}
                    </div>
                )}

            </div>

        </div>
    );
}

export default ForgotPassword;