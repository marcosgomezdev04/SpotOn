// Todas las llamadas al backend pasan por acá.
// En desarrollo, "/api" lo reenvía Vite al backend (ver vite.config.ts).
const BASE = "/api";

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

type Options = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    token?: string | null;
    // Mensajes propios para ciertos códigos de estado (ej. 401 en el login)
    messages?: Partial<Record<number, string>>;
};

const DEFAULT_MESSAGES: Record<number, string> = {
    400: "Revisá los datos e intentá de nuevo.",
    401: "Tu sesión venció. Ingresá de nuevo.",
    403: "No tenés permiso para hacer esto.",
    404: "No encontramos lo que buscabas."
};

const SERVER_ERROR =
    "El servidor no respondió bien. Revisá que el backend esté corriendo e intentá de nuevo.";

export async function api<T>(
    path: string,
    { method = "GET", body, token, messages = {} }: Options = {}
): Promise<T> {
    let res: Response;

    try {
        res = await fetch(BASE + path, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new ApiError(0, "No pudimos conectar con el servidor. Revisá tu conexión.");
    }

    const text = await res.text();
    let data: unknown = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        // la respuesta no era JSON; no pasa nada
    }

    if (!res.ok) {
        throw new ApiError(
            res.status,
            messages[res.status] ?? DEFAULT_MESSAGES[res.status] ?? SERVER_ERROR
        );
    }

    return data as T;
}
