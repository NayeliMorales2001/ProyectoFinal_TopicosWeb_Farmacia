import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import api from "../services/api";
import registerImg from "../assets/login.jpg";

function Register() {
    const navigate = useNavigate();

    const [captcha, setCaptcha] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        rol: "empleado"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const registrar = async () => {

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.password_confirmation ||
            !form.rol
        ) {
            return Swal.fire(
                "Error",
                "Todos los campos son obligatorios",
                "warning"
            );
        }

        // Nombre mínimo
        if (form.name.trim().length < 3) {
            return Swal.fire(
                "Error",
                "El nombre debe tener mínimo 3 caracteres",
                "warning"
            );
        }

        // No permitir números
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name)) {
            return Swal.fire(
                "Error",
                "El nombre solo puede contener letras",
                "warning"
            );
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            return Swal.fire(
                "Error",
                "Ingresa un correo electrónico válido",
                "warning"
            );
        }

        // Contraseña mínima
        if (form.password.length < 6) {
            return Swal.fire(
                "Error",
                "La contraseña debe tener mínimo 6 caracteres",
                "warning"
            );
        }

        // Confirmación
        if (form.password !== form.password_confirmation) {
            return Swal.fire(
                "Error",
                "Las contraseñas no coinciden",
                "warning"
            );
        }

        // Rol válido
        if (
            form.rol !== "admin" &&
            form.rol !== "empleado"
        ) {
            return Swal.fire(
                "Error",
                "Selecciona un rol válido",
                "warning"
            );
        }

        // Captcha
        if (!captcha) {
            return Swal.fire(
                "Error",
                "Verifica el captcha",
                "warning"
            );
        }

        try {

            Swal.fire({
                title: "Registrando...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            await api.post("/register", {
                ...form,
                captcha
            });

            Swal.fire({
                icon: "success",
                title: "Usuario registrado",
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/login");

        } catch (error) {

            Swal.fire(
                "Error",
                error.response?.data?.message || "Error al registrar",
                "error"
            );
        }
    };

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
            }}
        >

            <div
                className="d-flex flex-column flex-md-row shadow-lg"
                style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#fff",
                    maxWidth: "900px",
                    width: "100%"
                }}
            >

                {/* IMAGEN */}
                <div className="d-none d-md-block">
                    <img
                        src={registerImg}
                        alt="register"
                        style={{
                            height: "100%",
                            width: "350px",
                            objectFit: "cover"
                        }}
                    />
                </div>

                {/* FORMULARIO */}
                <div style={{ padding: "40px", width: "100%" }}>

                    <h3 className="fw-bold mb-1 text-center">
                        Crear Cuenta
                    </h3>

                    <p className="text-muted text-center mb-4">
                        Regístrate para acceder al sistema
                    </p>

                    {/* NOMBRE */}
                    <div className="form-floating mb-1">
                        <input
                            className="form-control"
                            placeholder="Nombre"
                            name="name"
                            value={form.name}
                            onChange={(e) => {

                                const valor = e.target.value;

                                if (
                                    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)
                                ) {
                                    setForm({
                                        ...form,
                                        name: valor
                                    });
                                }
                            }}
                        />
                        <label>Nombre completo</label>
                    </div>

                    {form.name && form.name.trim().length < 3 && (
                        <small className="text-danger d-block mb-3">
                            El nombre debe tener mínimo 3 caracteres
                        </small>
                    )}

                    {/* EMAIL */}
                    <div className="form-floating mb-1">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <label>Correo electrónico</label>
                    </div>

                    {form.email && !emailValido && (
                        <small className="text-danger d-block mb-3">
                            Ejemplo válido: usuario@correo.com
                        </small>
                    )}

                    {/* ROL */}
                    <div className="form-floating mb-3">
                        <select
                            className="form-select"
                            name="rol"
                            value={form.rol}
                            onChange={handleChange}
                        >
                            <option value="empleado">
                                Empleado
                            </option>
                            <option value="admin">
                                Administrador
                            </option>
                        </select>
                        <label>Rol de usuario</label>
                    </div>

                    {/* PASSWORD */}
                    <div className="form-floating mb-1">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <label>Contraseña</label>
                    </div>

                    {form.password.length > 0 && (
                        <small
                            className={`d-block mb-3 ${
                                form.password.length >= 6
                                    ? "text-success"
                                    : "text-danger"
                            }`}
                        >
                            {form.password.length >= 6
                                ? "✓ Contraseña válida"
                                : "La contraseña debe tener mínimo 6 caracteres"}
                        </small>
                    )}

                    {/* CONFIRMAR PASSWORD */}
                    <div className="form-floating mb-1">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirmar Password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                        <label>Confirmar contraseña</label>
                    </div>

                    {form.password_confirmation && (
                        <small
                            className={`d-block mb-3 ${
                                form.password === form.password_confirmation
                                    ? "text-success"
                                    : "text-danger"
                            }`}
                        >
                            {form.password === form.password_confirmation
                                ? "✓ Las contraseñas coinciden"
                                : "Las contraseñas no coinciden"}
                        </small>
                    )}

                    {/* CAPTCHA */}
                    <div className="d-flex justify-content-center mb-3">
                        <ReCAPTCHA
                            sitekey="6LcUiuwsAAAAADzrJ1M-14hFRrZLc5b61rrRkLOs"
                            onChange={(val) => setCaptcha(val)}
                        />
                    </div>

                    {/* BOTÓN */}
                    <button
                        className="btn w-100 mb-3"
                        style={{
                            background:
                                "linear-gradient(135deg,#16a34a,#15803d)",
                            color: "#fff",
                            borderRadius: "10px",
                            padding: "10px",
                            fontWeight: "600"
                        }}
                        onClick={registrar}
                    >
                        Crear cuenta
                    </button>

                    {/* LOGIN */}
                    <div className="text-center">
                        <small className="text-muted">
                            ¿Ya tienes cuenta?{" "}
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: "none"
                                }}
                            >
                                Iniciar sesión
                            </Link>
                        </small>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;