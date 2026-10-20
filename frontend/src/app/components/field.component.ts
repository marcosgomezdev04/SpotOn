import { Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-field',
  imports: [ReactiveFormsModule],
  template: `
    <div class="field">
      <label [attr.for]="inputId()">{{ label() }}</label>

      <div [class.pw]="kind() === 'password'">
        <input
          [id]="inputId()"
          [type]="inputType()"
          [formControl]="control()"
          [attr.autocomplete]="autofill()"
          [attr.aria-invalid]="showError() ? 'true' : null"
        />
        @if (kind() === 'password') {
          <button
            type="button"
            class="toggle"
            (click)="visible.set(!visible())"
            [attr.aria-pressed]="visible()"
          >
            {{ visible() ? 'Ocultar' : 'Mostrar' }}
          </button>
        }
      </div>

      @if (showError()) {
        <p class="field-error">{{ errorText() }}</p>
      } @else if (hint()) {
        <p class="hint">{{ hint() }}</p>
      }
    </div>
  `,
})
export class FieldComponent {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly kind = input<'text' | 'email' | 'password'>('text');
  readonly autofill = input<string>();
  readonly hint = input<string>();

  protected readonly visible = signal(false);
  protected readonly inputType = computed(() => {
    const kind = this.kind();
    return kind === 'password' && this.visible() ? 'text' : kind;
  });

  protected showError(): boolean {
    const control = this.control();
    return control.invalid && control.touched;
  }

  protected errorText(): string {
    const errors = this.control().errors;

    if (errors?.['required']) return 'Completá este campo.';
    if (errors?.['email']) return 'Ingresá un email válido.';
    if (errors?.['minlength']) return `Usá al menos ${errors['minlength'].requiredLength} caracteres.`;

    return 'Revisá este campo.';
  }
}
