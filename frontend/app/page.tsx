"use client";

import { useState } from "react";

export default function Home() {
    const [input, setInput] = useState("Enter an array");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const runAlgorithm = async () => {
        setLoading(true);
        setError(null);

        try {
            const array = input
                .split(",")
                .map((n) => Number(n.trim()))
                .filter((n) => !isNaN(n));

            const res = await fetch("http://127.0.0.1:8000/run-algorithm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    algorithm: "bubble_sort",
                    array,
                }),
            });

            if (!res.ok) {
                throw new Error("API request failed");
            }

            const data = await res.json();
            console.log("API RESPONSE:", data);

            setResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    function Bars({
        array,
        highlight,
    }: {
        array: number[];
        highlight: { i: number; j: number; op: string } | null;
    }) {
        return (
            <div
                style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
            >
                {array.map((value, idx) => {
                    let background = "#888";

                    if (
                        highlight &&
                        (idx === highlight.i || idx === highlight.j)
                    ) {
                        background =
                            highlight.op === "swap" ? "#e63946" : "#f4a261";
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                width: "40px",
                                height: `${value * 20}px`,
                                background,
                                color: "#fff",
                                textAlign: "center",
                            }}
                        >
                            {value}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "monospace" }}>
            <h1>Algorithm Visualizer (Skeleton)</h1>

            <div style={{ marginTop: "1rem" }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: "300px", marginRight: "1rem" }}
                />
                <button onClick={runAlgorithm} disabled={loading}>
                    {loading ? "Running..." : "Run"}
                </button>
            </div>

            {error && (
                <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
            )}

            {result && (
                <>
                    <Bars
                        array={result.steps[currentStep]?.array || []}
                        highlight={
                            result.steps[currentStep]
                                ? {
                                      i: result.steps[currentStep].i,
                                      j: result.steps[currentStep].j,
                                      op: result.steps[currentStep].op,
                                  }
                                : null
                        }
                    />
                    <div style={{ marginTop: "1rem" }}>
                        <button
                            onClick={() =>
                                setCurrentStep((s) =>
                                    Math.min(s + 1, result.steps.length - 1)
                                )
                            }
                        >
                            Next Step
                        </button>
                    </div>

                    <p style={{ marginTop: "0.5rem" }}>
                        Step {currentStep + 1} / {result.steps.length} —{" "}
                        {result.steps[currentStep]?.op}
                    </p>
                </>
            )}
        </main>
    );
}
