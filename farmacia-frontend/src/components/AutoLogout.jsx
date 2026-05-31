import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AutoLogout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si existe sesión activa
        const token = localStorage.getItem("token");

        if (!token) return;

        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert("Sesión expirada por inactividad");

                navigate("/login");
            }, 1 * 60 * 1000); // 1 minuto
        };

        // eventos que reinician actividad
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
        };
    }, [navigate]);

    return null;
}

export default AutoLogout;