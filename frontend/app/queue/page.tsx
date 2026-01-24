"use client";

import { useState } from "react";
import QueueView from "@/components/visualizers/QueueView";
import { Step } from "@/types";

export default function QueuePage() {
    const [value, setValue] = useState("");
    const [step, setStep] = useState<Step | null>(null);
    const [error, setError] = useState("");

    const runOperation = async (operation: "enqueue" | "dequeue" | "front") => {
        setError("");

        const payload: any = { operation };

        if (operation === "enqueue") {
            if (value.trim() === "") {
                setError("Value required for enqueue");
                return;
            }
            payload.value = Number(value);
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/queue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setStep(data.steps[0]);
            setValue("");
        } catch {
            setError("Queue operation failed");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Queue (FIFO)</h1>

            {/* Controls */}
            <div style={{ marginTop: "1rem" }}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Value"
                    style={{ marginRight: "0.5rem", width: "100px" }}
                />

                <button onClick={() => runOperation("enqueue")}>Enqueue</button>
                <button
                    onClick={() => runOperation("dequeue")}
                    style={{ marginLeft: "0.5rem" }}
                >
                    Dequeue
                </button>
                <button
                    onClick={() => runOperation("front")}
                    style={{ marginLeft: "0.5rem" }}
                >
                    Front
                </button>
            </div>

            {error && (
                <p style={{ color: "#ef4444", marginTop: "0.5rem" }}>{error}</p>
            )}

            {/* Visualization */}
            <QueueView step={step} />
        </div>
    );
}
