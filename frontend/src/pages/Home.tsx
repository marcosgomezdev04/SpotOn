import { useAuth } from "../auth/AuthContext";

// Pantalla provisoria: confirma que la sesión funciona.
// Acá se van a sumar Horarios, Reservas y Usuarios.
export default function Home() {
    const { session, logout } = useAuth();

    return (
        <div className="shell">
            <header>
                <p className="wordmark">SpotOn</p>
                <button className="btn-quiet" onClick={logout}>Cerrar sesión</button>
            </header>

            <main className="home">
                <h1>Hola, {session?.email}</h1>
                <p>
                    Tu rol es {session?.role === "ADMIN" ? "administrador" : "usuario"}.
                    Acá van a aparecer los horarios y tus reservas.
                </p>
            </main>
        </div>
    );
}
