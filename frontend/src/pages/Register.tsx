import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { PasswordField, TextField } from "../components/Fields";
import AuthLayout from "./AuthLayout";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos crear la cuenta. Probá de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Creá tu cuenta"
            subtitle="Con tu cuenta podés reservar canchas en pocos pasos."
            footer={<>¿Ya tenés cuenta? <Link to="/login">Ingresar</Link></>}
        >
            <form onSubmit={handleSubmit}>
                {error && <p className="error" role="alert">{error}</p>}

                <TextField
                    id="name"
                    label="Nombre"
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                />
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
                    autoComplete="new-password"
                    minLength={8}
                    hint="Mínimo 8 caracteres."
                />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Creando cuenta…" : "Crear cuenta"}
                </button>
            </form>
        </AuthLayout>
    );
}
