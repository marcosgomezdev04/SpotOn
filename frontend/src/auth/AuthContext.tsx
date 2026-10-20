import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";
import { api } from "../api";

export type Role = "USER" | "ADMIN";

export type Session = {
    token: string;
    id: string;
    email: string;
    role: Role;
    expiresAt: number;
};

const STORAGE_KEY = "spoton_token";

// El backend firma el JWT con { id, email, role } y vence a las 24 h.
function readSession(token: string | null): Session | null {
    if (!token) return null;

    try {
        const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, "=")));
        const expiresAt = Number(payload.exp) * 1000;

        if (!payload.id || !payload.email || !(expiresAt > Date.now())) return null;

        return {
            token,
            id: payload.id,
            email: payload.email,
            role: payload.role === "ADMIN" ? "ADMIN" : "USER",
            expiresAt
        };
    } catch {
        return null;
    }
}

type AuthValue = {
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
    const session = useMemo(() => readSession(token), [token]);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
    }, []);

    // Token inválido o vencido guardado de antes: se descarta
    useEffect(() => {
        if (token && !session) logout();
    }, [token, session, logout]);

    // Cierra la sesión sola cuando vence el token
    useEffect(() => {
        if (!session) return;
        const id = window.setTimeout(logout, Math.min(session.expiresAt - Date.now(), 2 ** 31 - 1));
        return () => window.clearTimeout(id);
    }, [session, logout]);

    const login = useCallback(async (email: string, password: string) => {
        const { token } = await api<{ token: string }>("/auth/login", {
            method: "POST",
            body: { email, password },
            messages: { 401: "Email o contraseña incorrectos." }
        });

        localStorage.setItem(STORAGE_KEY, token);
        setToken(token);
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            await api("/auth/register", {
                method: "POST",
                body: { name, email, password },
                messages: { 409: "Ese email ya tiene una cuenta. Probá ingresar." }
            });

            // El registro no devuelve token, así que se inicia sesión directo
            await login(email, password);
        },
        [login]
    );

    const value = useMemo(
        () => ({ session, login, register, logout }),
        [session, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
