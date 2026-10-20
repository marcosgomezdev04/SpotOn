import type { ReactNode } from "react";

// Media cancha vista desde arriba: el punto penal es el "spot" de SpotOn.
function Pitch() {
    return (
        <svg
            className="pitch-art"
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
        >
            <g fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2">
                <rect x="20" y="20" width="360" height="560" />
                <rect x="90" y="400" width="220" height="180" />
                <rect x="150" y="520" width="100" height="60" />
                <path d="M161 400 A80 80 0 0 1 239 400" />
                <path d="M120 20 A80 80 0 0 0 280 20" />
            </g>
            <circle className="spot-ring" cx="200" cy="470" r="6" fill="none" stroke="#ffc933" strokeWidth="2" />
            <circle cx="200" cy="470" r="6" fill="#ffc933" />
        </svg>
    );
}

type Props = {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
};

export default function AuthLayout({ title, subtitle, children, footer }: Props) {
    return (
        <main className="auth">
            <aside className="pitch">
                <Pitch />
                <p className="wordmark">SpotOn</p>
                <p className="tagline">Elegí cancha, día y horario. Nosotros guardamos tu turno.</p>
            </aside>

            <section className="panel">
                <h1>{title}</h1>
                <p className="sub">{subtitle}</p>
                {children}
                <p className="alt">{footer}</p>
            </section>
        </main>
    );
}
