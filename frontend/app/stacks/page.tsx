"use client";

import { useState } from "react";
import StackView from "@/components/visualizers/StackView";
import { Step } from "@/types";

export default function StackPage() {
    const [value, setValue] = useState("");
    const [step, setStep] = useState<Step | null>(null);
    const [error, setError] = useState("");

    const runOperation = async (operation: "push" | "pop" | "peek") => {
        setError("");

        interface Payload {
            operation: "push" | "pop" | "peek";
            value?: number;
        }
        const payload: Payload = { operation };
        if (operation === "push") {
            if (value.trim() === "") {
                setError("Value required for push");
                return;
            }
            payload.value = Number(value);
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/stack", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setStep(data.steps[0]);
            setValue("");
        } catch {
            setError("Stack operation failed");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Stack (LIFO)</h1>

            {/* Controls */}
            <div style={{ marginTop: "1rem" }}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Value"
                    style={{ marginRight: "0.5rem", width: "100px" }}
                />

                <button onClick={() => runOperation("push")}>Push</button>
                <button
                    onClick={() => runOperation("pop")}
                    style={{ marginLeft: "0.5rem" }}
                >
                    Pop
                </button>
                <button
                    onClick={() => runOperation("peek")}
                    style={{ marginLeft: "0.5rem" }}
                >
                    Peek
                </button>
            </div>

            {error && (
                <p style={{ color: "#ef4444", marginTop: "0.5rem" }}>{error}</p>
            )}

            {/* Visualization */}
            <StackView step={step} />
        </div>
    );
}
