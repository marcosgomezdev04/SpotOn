import {
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { ConfirmService } from '../core/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (confirm.pending(); as pending) {
      <div class="backdrop" (click)="confirm.answer(false)">
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          [class.danger]="pending.options.tone === 'danger'"
          (click)="$event.stopPropagation()"
        >
          <div class="icon" aria-hidden="true">
            @if (pending.options.tone === 'danger') { ! } @else { ✓ }
          </div>

          <h2 id="confirm-title">{{ pending.options.title }}</h2>
          <p id="confirm-message">{{ pending.options.message }}</p>

          @if (pending.options.details?.length) {
            <dl class="details">
              @for (item of pending.options.details; track item.label) {
                <div>
                  <dt>{{ item.label }}</dt>
                  <dd>{{ item.value }}</dd>
                </div>
              }
            </dl>
          }

          <div class="actions">
            <button type="button" class="secondary" (click)="confirm.answer(false)">
              {{ pending.options.cancelLabel ?? 'Volver' }}
            </button>
            <button #accept type="button" class="accept" (click)="confirm.answer(true)">
              {{ pending.options.confirmLabel ?? 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(10, 30, 22, 0.55);
      backdrop-filter: blur(3px);
      animation: fade 0.15s ease-out;
    }

    .dialog {
      width: min(440px, 100%);
      padding: 28px 28px 24px;
      border-radius: 18px;
      background: #fff;
      color: #18212f;
      text-align: center;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
      animation: pop 0.18s ease-out;
    }

    .icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      margin: 0 auto 14px;
      border-radius: 50%;
      background: #dcfce7;
      color: #166534;
      font-size: 26px;
      font-weight: 800;
    }

    .danger .icon {
      background: #fee2e2;
      color: #991b1b;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 22px;
    }

    p {
      margin: 0;
      color: #4b5766;
      line-height: 1.45;
    }

    .details {
      display: grid;
      gap: 8px;
      margin: 18px 0 0;
      padding: 14px 16px;
      border-radius: 12px;
      background: #f4f7f6;
      text-align: left;
    }

    .details div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    dt {
      color: #5f6c7b;
    }

    dd {
      margin: 0;
      font-weight: 700;
      text-align: right;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 22px;
    }

    button {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #bac5ce;
      border-radius: 10px;
      background: #fff;
      color: #18212f;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      background: #f1f5f4;
    }

    button.accept {
      border-color: #166534;
      background: #166534;
      color: #fff;
    }

    button.accept:hover {
      background: #14573a;
    }

    .danger button.accept {
      border-color: #b91c1c;
      background: #b91c1c;
    }

    .danger button.accept:hover {
      background: #991b1b;
    }

    button:focus-visible {
      outline: 3px solid #86b7fe;
      outline-offset: 2px;
    }

    @keyframes fade {
      from { opacity: 0; }
    }

    @keyframes pop {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop, .dialog { animation: none; }
    }

    @media (max-width: 420px) {
      .actions { flex-direction: column-reverse; }
    }
  `,
})
export class ConfirmDialogComponent {
  protected readonly confirm = inject(ConfirmService);

  private readonly accept = viewChild<ElementRef<HTMLButtonElement>>('accept');
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const button = this.accept();

      if (button) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        button.nativeElement.focus();
      } else {
        this.previouslyFocused?.focus?.();
        this.previouslyFocused = null;
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.confirm.pending()) this.confirm.answer(false);
  }

  // Mantiene el foco dentro del diálogo con Tab
  @HostListener('document:keydown.tab', ['$event'])
  protected onTab(event: Event): void {
    if (!this.confirm.pending()) return;

    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('app-confirm-dialog .actions button')
    );
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = document.activeElement;
    const shift = (event as KeyboardEvent).shiftKey;

    if (shift && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!shift && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
