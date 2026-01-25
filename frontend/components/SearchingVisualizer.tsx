"use client";

import { useState, useCallback } from "react";
import { Step } from "@/types";
import { useAnimator } from "@/components/engine/useAnimator";
import SearchArray from "@/components/visualizers/SearchArray";
import { isSortedAscending } from "@/lib/utils";

export default function SearchingVisualizer({
    algorithm,
    title,
    arrayOverride,
    targetOverride,
}: {
    algorithm: string;
    title: string;
    arrayOverride?: number[];
    targetOverride?: number;
    onComplete?: () => void;
}) {
    const [input, setInput] = useState(
        arrayOverride ? arrayOverride.join(",") : "5,3,8,1,2",
    );
    const [target, setTarget] = useState(
        targetOverride !== undefined ? String(targetOverride) : "3",
    );
    const [steps, setSteps] = useState<Step[]>([]);
    const [current, setCurrent] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const isGuided = arrayOverride !== undefined;

    const handleRun = async () => {
        const array = input
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !isNaN(n));

        if (algorithm === "binary" && !isSortedAscending(array)) {
            alert(
                "Binary Search requires a sorted array.\nPlease sort the array first.",
            );
            return;
        }

        const res = await fetch("http://127.0.0.1:8000/searching", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                algorithm,
                array,
                target: Number(target),
            }),
        }).then((r) => r.json());

        setSteps(res.steps);
        setCurrent(0);
        setIsPlaying(false);
    };

    const nextStep = useCallback(() => {
        setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, [steps.length]);

    useAnimator({
        isPlaying,
        speed,
        stepsLength: steps.length,
        onNext: nextStep,
    });

    const step = steps[current] ?? null;

    return (
        <>
            <h1>{title}</h1>

            {/* Inputs */}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Array"
                disabled={isGuided}
            />
            <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target"
                style={{ marginLeft: "0.5rem", width: "80px" }}
                disabled={isGuided}
            />
            <button onClick={handleRun} style={{ marginLeft: "0.5rem" }}>
                Run
            </button>

            {/* Controls */}
            {steps.length > 0 && (
                <>
                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={() => setIsPlaying(true)}>Play</button>
                        <button onClick={() => setIsPlaying(false)}>
                            Pause
                        </button>
                        <button onClick={nextStep}>Step</button>
                        <button onClick={() => setCurrent(0)}>Reset</button>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                        Speed:
                        <input
                            type="range"
                            min="100"
                            max="1000"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                        />
                    </div>

                    {/* Visualization */}
                    <div className="visualizer">
                        <SearchArray step={step} />
                    </div>
                </>
            )}
        </>
    );
}
