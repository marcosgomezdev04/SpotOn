import { HttpErrorResponse } from '@angular/common/http';

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Revisá los datos e intentá de nuevo.',
  401: 'Tu sesión venció. Ingresá de nuevo.',
  403: 'No tenés permiso para hacer esto.',
  404: 'No encontramos lo que buscabas.',
};

const SERVER_ERROR =
  'El servidor no respondió bien. Revisá que el backend esté corriendo e intentá de nuevo.';

// Convierte un error HTTP en un mensaje para mostrar en pantalla.
export function errorMessage(err: unknown, custom: Partial<Record<number, string>> = {}): string {
  const status = err instanceof HttpErrorResponse ? err.status : -1;

  if (status === 0) return 'No pudimos conectar con el servidor. Revisá tu conexión.';

  return custom[status] ?? DEFAULT_MESSAGES[status] ?? SERVER_ERROR;
}
