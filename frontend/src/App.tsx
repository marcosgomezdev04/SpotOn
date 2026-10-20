import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

// Solo para usuarios con sesión; si no, va al login y vuelve después
function Protected({ children }: { children: ReactNode }) {
    const { session } = useAuth();
    const location = useLocation();

    if (!session) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}

// Login y registro: si ya hay sesión, no tiene sentido mostrarlos
function GuestOnly({ children }: { children: ReactNode }) {
    const { session } = useAuth();

    if (session) return <Navigate to="/" replace />;

    return <>{children}</>;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/" element={<Protected><Home /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
