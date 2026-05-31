import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation,
        setPasswordConfirmation] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8000/api/reset-password",
                {
                    token,
                    email,
                    password,
                    password_confirmation:
                        passwordConfirmation
                }
            );

            setMessage(response.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Error al cambiar contraseña"
            );
        }
    };

    return (

        <div className="container mt-5">

            <div className="card p-4 shadow">

                <h2>
                    Nueva Contraseña
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder="Confirmar contraseña"
                        value={passwordConfirmation}
                        onChange={(e) =>
                            setPasswordConfirmation(
                                e.target.value
                            )
                        }
                        required
                    />

                    <button
                        className="btn btn-success mt-3"
                    >
                        Cambiar contraseña
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

export default ResetPassword;