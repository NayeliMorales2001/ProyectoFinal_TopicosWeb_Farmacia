import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import api from "../services/api";
import loginImg from "../assets/login.jpg";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState(null);

    const [showPassword, setShowPassword] = useState(false);

    const [remember, setRemember] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

    }, []);

    const login = async () => {

        // VALIDACIONES
        if (!email || !password) {

            return Swal.fire(
                "Error",
                "Correo y contraseña son obligatorios",
                "warning"
            );

        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return Swal.fire(
                "Error",
                "Ingresa un correo válido",
                "warning"
            );

        }

        if (password.length < 6) {

            return Swal.fire(
                "Error",
                "La contraseña debe tener mínimo 6 caracteres",
                "warning"
            );

        }

        // CAPTCHA OPCIONAL
        if (
            import.meta.env.VITE_RECAPTCHA_SITE_KEY &&
            !captcha
        ) {

            return Swal.fire(
                "Error",
                "Verifica el captcha",
                "warning"
            );

        }

        try {

            setLoading(true);

            Swal.fire({
                title: "Iniciando sesión...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            // LOGIN
            const res = await api.post("/login", {
                email,
                password
            });

            // VALIDAR TOKEN
            if (!res.data?.token) {

                throw new Error("No se recibió token");

            }

            // GUARDAR
          localStorage.setItem(
    "token",
    res.data.token
);

localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
);



            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "Bienvenido",
                timer: 1200,
                showConfirmButton: false
            });

            // REDIRECCION
            navigate("/dashboard", { replace: true });

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Credenciales incorrectas",
                "error"
            );

        } finally {

            setLoading(false);

        }

        };

    const emailValido =
        email.length === 0 ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const passwordValida =
        password.length === 0 ||
        password.length >= 6;

    return (

        <div
            className="d-flex"
            style={{
                minHeight: "100vh",
                background: "#f8fafc"
            }}
        >

            {/* IMAGEN */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="d-none d-lg-block"
                style={{
                    flex: 1,
                    backgroundImage: `url(${loginImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                }}
            >

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(rgba(15,23,42,.55), rgba(15,23,42,.55))"
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: "50px",
                        left: "50px",
                        color: "#fff",
                        zIndex: 2
                    }}
                >

                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: "700"
                        }}
                    >
                        Farma ERP
                    </h1>

                    <p
                        style={{
                            fontSize: "18px",
                            opacity: 0.9
                        }}
                    >
                        Sistema administrativo moderno
                    </p>

                </div>

            </motion.div>

            {/* LOGIN */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "30px"
                }}
            >

                <div
                    className="card border-0 shadow-lg"
                    style={{
                        width: "100%",
                        maxWidth: "420px",
                        borderRadius: "24px"
                    }}
                >

                    <div className="card-body p-5">

                        {/* HEADER */}
                        <div className="text-center mb-4">

                            <h2
                                className="fw-bold mb-2"
                                style={{
                                    color: "#0f172a"
                                }}
                            >
                                Iniciar sesión
                            </h2>

                            <p className="text-muted mb-0">
                                Accede al panel administrativo
                            </p>

                        </div>

                        {/* EMAIL */}
                            <div className="mb-3">

                                <label className="form-label fw-semibold">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    className={`form-control ${
                                        !emailValido ? "is-invalid" : ""
                                    } ${
                                        email && emailValido ? "is-valid" : ""
                                    }`}
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    style={{
                                        padding: "12px",
                                        borderRadius: "12px"
                                    }}
                                />

                                {
                                    email &&
                                    !emailValido && (
                                        <div className="invalid-feedback d-block">
                                            Ingresa un correo válido (ejemplo@correo.com)
                                        </div>
                                    )
                                }

                            </div>

                        {/* PASSWORD */}
                        <div className="mb-3 position-relative">

                            <label className="form-label fw-semibold">
                                Contraseña
                            </label>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className={`form-control ${
                                    !passwordValida ? "is-invalid" : ""
                                } ${
                                    password.length >= 6 ? "is-valid" : ""
                                }`}
                                placeholder="********"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                style={{
                                    padding: "12px",
                                    borderRadius: "12px"
                                }}
                            />

                            <span
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "45px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#64748b"
                                }}
                            >
                                {showPassword ? "Ocultar" : "Ver"}
                            </span>

                            {
                                password.length > 0 && (
                                    <small
                                        className={`d-block mt-2 ${
                                            password.length >= 6
                                                ? "text-success"
                                                : "text-danger"
                                        }`}
                                    >
                                        {
                                            password.length >= 6
                                                ? "✓ Contraseña válida"
                                                : "La contraseña debe tener mínimo 6 caracteres"
                                        }
                                    </small>
                                )
                            }

                        </div>

                        {/* OPCIONES */}
                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={() =>
                                        setRemember(!remember)
                                    }
                                />

                                <small className="ms-2">
                                    Recordarme
                                </small>

                            </div>

                            <small
                                style={{
                                    color: "#2563eb",
                                    cursor: "pointer"
                                }}
                            >
                                Recuperar acceso
                            </small>

                        </div>

                        {/* CAPTCHA */}
                        {
                            import.meta.env.VITE_RECAPTCHA_SITE_KEY && (

                                <div className="d-flex justify-content-center mb-4">

                                    <ReCAPTCHA
                                        sitekey={
                                            import.meta.env
                                                .VITE_RECAPTCHA_SITE_KEY
                                        }
                                        onChange={(val) =>
                                            setCaptcha(val)
                                        }
                                    />

                                </div>

                            )
                        }

                        {/* BOTON */}
                        <button
                            className="btn w-100"
                            disabled={loading}
                            onClick={login}
                            style={{
                                background:
                                    "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                color: "#fff",
                                padding: "13px",
                                borderRadius: "12px",
                                border: "none",
                                fontWeight: "600",
                                fontSize: "15px"
                            }}
                        >

                            {
                                loading
                                    ? "Ingresando..."
                                    : "Iniciar sesión"
                            }

                        </button>

                        {/* REGISTER */}
                        <div className="text-center mt-4">

                            <small className="text-muted">

                                ¿No tienes cuenta?{" "}

                                <Link
                                    to="/register"
                                    style={{
                                        textDecoration: "none",
                                        fontWeight: "600"
                                    }}
                                >
                                    Crear cuenta
                                </Link>

                            </small>

                        </div>

                    </div>

                </div>

            </motion.div>

        </div>

    );

}

export default Login;