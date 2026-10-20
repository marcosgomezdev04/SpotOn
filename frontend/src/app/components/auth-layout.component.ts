import { Component, input } from '@angular/core';

// Pantalla partida: media cancha a la izquierda (el punto penal es el "spot" de SpotOn)
// y el formulario a la derecha. El pie lleva el atributo "footer".
@Component({
  selector: 'app-auth-layout',
  template: `
    <main class="auth">
      <aside class="pitch">
        <svg
          class="pitch-art"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2">
            <rect x="20" y="20" width="360" height="560" />
            <rect x="90" y="400" width="220" height="180" />
            <rect x="150" y="520" width="100" height="60" />
            <path d="M161 400 A80 80 0 0 1 239 400" />
          </g>
          <circle class="spot-ring" cx="200" cy="470" r="6" fill="none" stroke="#ffc933" stroke-width="2" />
          <circle cx="200" cy="470" r="6" fill="#ffc933" />
        </svg>

        <p class="wordmark">SpotOn</p>
        <p class="tagline">Elegí cancha, día y horario. Nosotros guardamos tu turno.</p>
      </aside>

      <section class="panel">
        <h1>{{ heading() }}</h1>
        <p class="sub">{{ lead() }}</p>
        <ng-content />
        <p class="alt"><ng-content select="[footer]" /></p>
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {
  readonly heading = input.required<string>();
  readonly lead = input.required<string>();
}
