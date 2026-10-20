import { useState } from "react";

type BaseProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    hint?: string;
};

export function TextField({
    type = "text",
    ...props
}: BaseProps & { type?: "text" | "email" }) {
    return (
        <div className="field">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                id={props.id}
                type={type}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                autoComplete={props.autoComplete}
                required
            />
            {props.hint && <p className="hint">{props.hint}</p>}
        </div>
    );
}

export function PasswordField(props: BaseProps & { minLength?: number }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="field">
            <label htmlFor={props.id}>{props.label}</label>
            <div className="pw">
                <input
                    id={props.id}
                    type={visible ? "text" : "password"}
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    autoComplete={props.autoComplete}
                    minLength={props.minLength}
                    required
                />
                <button
                    type="button"
                    className="toggle"
                    onClick={() => setVisible((v) => !v)}
                    aria-pressed={visible}
                >
                    {visible ? "Ocultar" : "Mostrar"}
                </button>
            </div>
            {props.hint && <p className="hint">{props.hint}</p>}
        </div>
    );
}
