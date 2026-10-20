import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { PasswordField, TextField } from "../components/Fields";
import AuthLayout from "./AuthLayout";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos ingresar. Probá de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Ingresá a tu cuenta"
            subtitle="Entrá para ver horarios y manejar tus reservas."
            footer={<>¿Todavía no tenés cuenta? <Link to="/register">Crear cuenta</Link></>}
        >
            <form onSubmit={handleSubmit}>
                {error && <p className="error" role="alert">{error}</p>}

                <TextField
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                />
                <PasswordField
                    id="password"
                    label="Contraseña"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Ingresando…" : "Ingresar"}
                </button>
            </form>
        </AuthLayout>
    );
}
