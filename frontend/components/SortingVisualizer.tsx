"use client";

import { useState, useCallback } from "react";
import { Step } from "@/types";
import { useAnimator } from "@/lib/utils";
import ArrayBars from "@/components/visualizers/ArrayBars";

type Props = {
    algorithm: string;
    title: string;
    inputOverride?: string;
    onComplete?: (result: number[]) => void;
};

export default function SortingVisualizer({
    algorithm,
    title,
    inputOverride,
}: Props) {
    const [input, setInput] = useState(inputOverride ?? "5,3,8,1,2");
    const [steps, setSteps] = useState<Step[]>([]);
    const [current, setCurrent] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    async function runSorting(
        algorithm: string,
        array: number[],
        target?: number,
    ) {
        const res = await fetch("http://127.0.0.1:8000/sorting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                algorithm,
                array,
                target,
            }),
        });

        if (!res.ok) {
            throw new Error("Backend request failed");
        }

        return res.json();
    }

    const handleRun = async () => {
        const array = input
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !isNaN(n));

        const res = await runSorting(algorithm, array);
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

    return (
        <>
            <h1>{title}</h1>

            {/* Input */}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: "300px" }}
            />
            <button onClick={handleRun} style={{ marginLeft: "1rem" }}>
                Run
            </button>

            {steps.length > 0 && (
                <>
                    {/* Controls */}
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
                        <ArrayBars step={steps[current]} />
                    </div>
                </>
            )}
        </>
    );
}
