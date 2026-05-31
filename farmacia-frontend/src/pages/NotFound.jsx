import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import errorImg from "../assets/NotFound.svg";

const REDIRECT_TIME = 5;

function NotFound() {

    const navigate = useNavigate();
    const location = useLocation();

    const [contador, setContador] = useState(REDIRECT_TIME);
    const [search, setSearch] = useState("");

    const user = localStorage.getItem("token");

    // =========================================
    // REGISTRO ERROR
    // =========================================
    useEffect(() => {

        const errorData = {
            path: location.pathname,
            date: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        console.error("404:", errorData);

    }, [location]);

    // =========================================
    // REDIRECCION
    // =========================================
    useEffect(() => {

        if (contador <= 0) {

            navigate(user ? "/dashboard" : "/");

            return;
        }

        const timer = setTimeout(() => {
            setContador(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [contador, navigate, user]);

    const handleSearch = () => {

        if (!search.trim()) return;

        navigate(`/productos?search=${search}`);
    };

    return (

        <div style={styles.container}>

            {/* Glow */}
            <div style={styles.glow} />

            <div style={styles.card}>

                {/* IMAGE */}
                <motion.img
                    src={errorImg}
                    alt="404"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -15, 0]
                    }}
                    transition={{
                        duration: 1,
                        y: {
                            duration: 4,
                            repeat: Infinity
                        }
                    }}
                    style={styles.image}
                />

                {/* TEXT */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    style={styles.content}
                >

                    <h1 style={styles.title}>
                        404
                    </h1>

                    <h2 style={styles.subtitle}>
                        Página no encontrada
                    </h2>

                    <p style={styles.text}>
                        La página que buscas no existe o fue movida.

                        <br /><br />

                        Redirección automática en{" "}
                        <strong>{contador}</strong> segundos.
                    </p>

                    {/* SEARCH */}
                    <div style={styles.searchContainer}>

                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={styles.input}
                        />

                        <button
                            style={styles.searchBtn}
                            onClick={handleSearch}
                        >
                            Buscar
                        </button>

                    </div>

                    {/* BUTTONS */}
                    <div style={styles.buttons}>

                        <button
                            style={styles.primaryBtn}
                            onClick={() =>
                                navigate(user
                                    ? "/dashboard"
                                    : "/")
                            }
                        >
                            {user
                                ? "Dashboard"
                                : "Inicio"}
                        </button>

                        <button
                            style={styles.secondaryBtn}
                            onClick={() => navigate(-1)}
                        >
                            Regresar
                        </button>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "radial-gradient(circle at top,#1e293b,#020617)",
        padding: "20px",
        overflow: "hidden",
        position: "relative"
    },

    glow: {
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(59,130,246,0.25)",
        filter: "blur(120px)",
        borderRadius: "50%"
    },

    card: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "50px",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "30px",
        padding: "40px",
        zIndex: 2
    },

    image: {
        width: "320px",
        maxWidth: "100%"
    },

    content: {
        maxWidth: "450px",
        color: "#fff"
    },

    title: {
        fontSize: "90px",
        fontWeight: "800",
        marginBottom: "10px"
    },

    subtitle: {
        marginBottom: "20px"
    },

    text: {
        color: "#cbd5e1",
        lineHeight: "1.8"
    },

    searchContainer: {
        display: "flex",
        gap: "10px",
        marginTop: "25px"
    },

    input: {
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "none"
    },

    searchBtn: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#fff"
    },

    buttons: {
        display: "flex",
        gap: "15px",
        marginTop: "30px"
    },

    primaryBtn: {
        background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "#fff",
        border: "none",
        padding: "12px 22px",
        borderRadius: "12px"
    },

    secondaryBtn: {
        background: "#e2e8f0",
        border: "none",
        padding: "12px 22px",
        borderRadius: "12px"
    }
};

export default NotFound;