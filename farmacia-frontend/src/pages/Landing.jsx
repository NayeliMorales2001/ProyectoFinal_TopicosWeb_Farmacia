import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

import pharmacyImg from "../assets/pharmacy.svg";
import logo from "../assets/logo.jpg";

function LandingPage() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    // =========================================
    // CAROUSEL
    // =========================================
    const slides = [
        "Control inteligente de inventario",
        "Ventas rápidas y seguras",
        "Dashboard en tiempo real",
        "Sistema farmacéutico moderno"
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentSlide((prev) =>
                prev === slides.length - 1
                    ? 0
                    : prev + 1
            );

        }, 3500);

        return () => clearInterval(interval);

    }, []);

    // =========================================
    // COLORS
    // =========================================
    const colors = {

        background: darkMode
            ? "#020617"
            : "#f8fbff",

        card: darkMode
            ? "rgba(15,23,42,0.65)"
            : "rgba(255,255,255,0.65)",

        text: darkMode
            ? "#f8fafc"
            : "#0f172a",

        subtext: darkMode
            ? "#cbd5e1"
            : "#475569",

        border: darkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)",

        primary: "#3b82f6"
    };

    return (

        <>
            {/* ========================================= */}
            {/* SEO */}
            {/* ========================================= */}
            <Helmet>

                <title>
                    MyPharmacy | Sistema Farmacéutico
                </title>

                <meta
                    name="description"
                    content="Sistema farmacéutico moderno para gestión de inventario, ventas y pacientes."
                />

            </Helmet>

            {/* ========================================= */}
            {/* MAIN CONTAINER */}
            {/* ========================================= */}
            <div
                style={{
                    minHeight: "100vh",
                    background: colors.background,
                    color: colors.text,
                    transition: "0.3s",
                    overflow: "hidden",
                    position: "relative",
                    fontFamily: "'Poppins', sans-serif"
                }}
            >

                {/* ========================================= */}
                {/* BACKGROUND GLOW */}
                {/* ========================================= */}
                <div
                    style={{
                        position: "absolute",
                        width: "500px",
                        height: "500px",
                        background: "rgba(59,130,246,0.18)",
                        filter: "blur(140px)",
                        borderRadius: "50%",
                        top: "-120px",
                        right: "-120px"
                    }}
                />

                {/* ========================================= */}
                {/* NAVBAR */}
                {/* ========================================= */}
                <nav
                    style={{
                        padding: "20px 7%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 999,
                        backdropFilter: "blur(12px)",
                        background: colors.card,
                        borderBottom:
                            `1px solid ${colors.border}`
                    }}
                >

                    {/* LOGO */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >

                        <img
                            src={logo}
                            alt="logo"
                            style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%"
                            }}
                        />

                        <h2
                            style={{
                                margin: 0,
                                color: colors.primary
                            }}
                        >
                            MyPharmacy
                        </h2>

                    </div>

                    {/* NAV LINKS */}
                    <div
                        style={{
                            display: "flex",
                            gap: "25px",
                            alignItems: "center"
                        }}
                    >

                        {[
                            "Inicio",
                            "Servicios",
                            "Beneficios",
                            "Contacto"
                        ].map((item) => (

                            <span
                                key={item}
                                style={{
                                    cursor: "pointer",
                                    color: colors.subtext,
                                    fontWeight: "500"
                                }}
                            >
                                {item}
                            </span>

                        ))}

                        {/* DARK MODE */}
                        <button
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        {/* LOGIN */}
                        <button
                            style={styles.loginBtn}
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                    </div>

                </nav>

                {/* ========================================= */}
                {/* HERO */}
                {/* ========================================= */}
                <section
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "80px 7%",
                        gap: "50px"
                    }}
                >

                    {/* LEFT */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: "300px"
                        }}
                    >

                        {/* CAROUSEL */}
                        <div
                            style={{
                                height: "60px",
                                overflow: "hidden",
                                marginBottom: "20px"
                            }}
                        >

                            <AnimatePresence mode="wait">

                                <motion.h3
                                    key={currentSlide}
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -20
                                    }}
                                    transition={{
                                        duration: 0.4
                                    }}
                                    style={{
                                        color: colors.primary
                                    }}
                                >
                                    {slides[currentSlide]}
                                </motion.h3>

                            </AnimatePresence>

                        </div>

                        <motion.h1
                            initial={{
                                opacity: 0,
                                x: -30
                            }}
                            animate={{
                                opacity: 1,
                                x: 0
                            }}
                            transition={{
                                duration: 0.6
                            }}
                            style={{
                                fontSize: "4rem",
                                lineHeight: "1.1",
                                marginBottom: "20px"
                            }}
                        >
                            Sistema Web
                            <br />
                            Farmacéutico
                        </motion.h1>

                        <p
                            style={{
                                fontSize: "18px",
                                lineHeight: "1.8",
                                color: colors.subtext,
                                maxWidth: "600px"
                            }}
                        >
                            Plataforma moderna para gestionar
                            productos, ventas, pacientes,
                            reportes y estadísticas en tiempo real.
                        </p>

                        {/* BUTTONS */}
                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                marginTop: "35px",
                                flexWrap: "wrap"
                            }}
                        >

                            <button
                                style={styles.primaryBtn}
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Comenzar
                            </button>

                            <button
                                style={styles.secondaryBtn}
                            >
                                Ver Demo
                            </button>

                        </div>

                        {/* STATS */}
                        <div
                            style={{
                                display: "flex",
                                gap: "40px",
                                marginTop: "50px",
                                flexWrap: "wrap"
                            }}
                        >

                            {[
                                {
                                    value: "+500",
                                    label: "Productos"
                                },
                                {
                                    value: "+1200",
                                    label: "Ventas"
                                },
                                {
                                    value: "99%",
                                    label: "Seguridad"
                                }
                            ].map((item) => (

                                <div key={item.label}>

                                    <h2
                                        style={{
                                            color:
                                                colors.primary,
                                            marginBottom: "5px"
                                        }}
                                    >
                                        {item.value}
                                    </h2>

                                    <p
                                        style={{
                                            color:
                                                colors.subtext
                                        }}
                                    >
                                        {item.label}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* RIGHT */}
                    <motion.img
                        src={pharmacyImg}
                        alt="Sistema farmacéutico"
                        initial={{
                            opacity: 0,
                            x: 50
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        transition={{
                            duration: 0.6
                        }}
                        style={{
                            flex: 1,
                            width: "500px",
                            maxWidth: "100%"
                        }}
                    />

                </section>

                {/* ========================================= */}
                {/* SERVICES */}
                {/* ========================================= */}
                <section
                    style={{
                        padding: "40px 7%"
                    }}
                >

                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "50px"
                        }}
                    >
                        Funcionalidades Principales
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(250px,1fr))",
                            gap: "25px"
                        }}
                    >

                        {[
                            "Gestión de Inventario",
                            "Ventas Inteligentes",
                            "Dashboard Analítico",
                            "Control de Usuarios"
                        ].map((service) => (

                            <motion.div
                                key={service}
                                whileHover={{
                                    y: -8
                                }}
                                style={{
                                    background: colors.card,
                                    border:
                                        `1px solid ${colors.border}`,
                                    padding: "30px",
                                    borderRadius: "25px",
                                    backdropFilter: "blur(12px)"
                                }}
                            >

                                <h3
                                    style={{
                                        color: colors.primary
                                    }}
                                >
                                    {service}
                                </h3>

                                <p
                                    style={{
                                        color: colors.subtext,
                                        lineHeight: "1.7"
                                    }}
                                >
                                    Sistema optimizado y seguro
                                    para farmacias modernas.
                                </p>

                            </motion.div>

                        ))}

                    </div>

                </section>

                {/* ========================================= */}
                {/* FOOTER */}
                {/* ========================================= */}
                <footer
                    style={{
                        marginTop: "70px",
                        padding: "40px 7%",
                        borderTop:
                            `1px solid ${colors.border}`,
                        textAlign: "center"
                    }}
                >

                    <h2
                        style={{
                            color: colors.primary
                        }}
                    >
                        MyPharmacy
                    </h2>

                    <p
                        style={{
                            color: colors.subtext
                        }}
                    >
                        Sistema farmacéutico moderno y seguro
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            marginTop: "20px"
                        }}
                    >
                        <span>Facebook</span>
                        <span>Instagram</span>
                        <span>LinkedIn</span>
                    </div>

                    <p
                        style={{
                            marginTop: "20px",
                            color: colors.subtext
                        }}
                    >
                        © 2026 MyPharmacy
                    </p>

                </footer>

            </div>
        </>
    );
}

const styles = {

    primaryBtn: {

        background:
            "linear-gradient(135deg,#3b82f6,#2563eb)",

        color: "#fff",

        border: "none",

        padding: "14px 30px",

        borderRadius: "14px",

        fontWeight: "600",

        cursor: "pointer",

        boxShadow:
            "0 10px 25px rgba(37,99,235,0.35)"
    },

    secondaryBtn: {

        background: "transparent",

        border: "1px solid #3b82f6",

        color: "#3b82f6",

        padding: "14px 30px",

        borderRadius: "14px",

        fontWeight: "600",

        cursor: "pointer"
    },

    loginBtn: {

        background:
            "linear-gradient(135deg,#3b82f6,#2563eb)",

        color: "#fff",

        border: "none",

        padding: "10px 20px",

        borderRadius: "12px",

        cursor: "pointer",

        fontWeight: "600"
    }
};

export default LandingPage;