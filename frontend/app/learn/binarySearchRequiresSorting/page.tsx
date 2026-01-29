"use client";

import { useState } from "react";
import SortingVisualizer from "@/components/SortingVisualizer";
import SearchingVisualizer from "@/components/SearchingVisualizer";
import { Phase } from "@/types";

export default function BinarySearchLearningFlow() {
    const [phase, setPhase] = useState<Phase>("input");
    const [array, setArray] = useState("Enter array");
    const [target, setTarget] = useState("target");
    const [sortedArray, setSortedArray] = useState<number[]>([]);
    const [busy, setBusy] = useState(false);

    const explanation: Record<Phase, string> = {
        input: "Enter any array. We will attempt Binary Search on it.",
        explain:
            "Binary Search requires sorted data. Without ordering, it cannot discard half the search space.",
        sorting:
            "We sort the array first to satisfy Binary Search’s precondition.",
        searching: "Now Binary Search works because the array is sorted.",
        done: "Sorting enables Binary Search to run in logarithmic time.",
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "900px" }}>
            <h1>Why Binary Search Requires Sorting</h1>

            {phase === "input" && (
                <>
                    <p>Enter an array and a target value.</p>

                    <input
                        value={array}
                        onChange={(e) => setArray(e.target.value)}
                        placeholder="Array (comma separated)"
                    />
                    <input
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Target"
                        style={{ marginLeft: "0.5rem", width: "80px" }}
                    />

                    <button
                        onClick={() => setPhase("explain")}
                        style={{ marginLeft: "0.5rem" }}
                        disabled={busy}
                    >
                        Try Binary Search
                    </button>
                </>
            )}

            {phase === "explain" && (
                <>
                    <h3>Why this doesn’t work</h3>
                    <p>
                        Binary Search assumes the array is sorted. Without
                        sorting, it cannot reliably eliminate half the search
                        space.
                    </p>

                    <button onClick={() => setPhase("sorting")} disabled={busy}>
                        Sort the Array First
                    </button>
                </>
            )}
            <div
                style={{
                    background: "#111827",
                    color: "#e5e7eb",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                }}
            >
                {explanation[phase]}
            </div>

            {phase === "sorting" && (
                <>
                    <h3>Sorting the Array</h3>
                    <SortingVisualizer
                        algorithm="merge"
                        title="Merge Sort"
                        inputOverride={array}
                        onComplete={(result: number[]) => {
                            setSortedArray(result);
                            setPhase("searching");
                        }}
                    />
                </>
            )}

            {phase === "searching" && (
                <>
                    <h3>Binary Search on Sorted Array</h3>
                    <SearchingVisualizer
                        algorithm="binary"
                        title="Binary Search"
                        arrayOverride={sortedArray}
                        targetOverride={Number(target)}
                        onComplete={() => setPhase("done")}
                    />
                </>
            )}

            {phase === "done" && (
                <>
                    <h3>What You Learned</h3>
                    <p>
                        Binary Search works because the array is sorted,
                        allowing the algorithm to discard half of the remaining
                        elements at each step.
                    </p>
                </>
            )}

            <button
                onClick={() => {
                    setPhase("input");
                    setSortedArray([]);
                }}
            >
                Restart Lesson
            </button>
        </div>
    );
}
