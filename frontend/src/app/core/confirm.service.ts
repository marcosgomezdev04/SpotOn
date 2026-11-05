import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  // Líneas de detalle (cancha, fecha, hora...) que se muestran destacadas
  details?: { label: string; value: string }[];
  confirmLabel?: string;
  cancelLabel?: string;
  // "danger" pinta el botón de confirmar en rojo (cancelar / eliminar)
  tone?: 'primary' | 'danger';
}

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (accepted: boolean) => void;
}

// Reemplaza a window.confirm: se pide con `await confirm.ask({...})`
// y el diálogo se dibuja en <app-confirm-dialog> (montado en el shell).
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly pending = signal<PendingConfirm | null>(null);

  ask(options: ConfirmOptions): Promise<boolean> {
    // Si ya había uno abierto, se descarta como "cancelado"
    this.pending()?.resolve(false);

    return new Promise<boolean>((resolve) => {
      this.pending.set({ options, resolve });
    });
  }

  answer(accepted: boolean): void {
    const current = this.pending();

    if (!current) return;

    this.pending.set(null);
    current.resolve(accepted);
  }
}
