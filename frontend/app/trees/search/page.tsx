"use client";

import { useState } from "react";
import TreeVisualizer from "../../../components/TreeVisualizer";

type Step = {
    op: string;
    i: number;
    j: number;
    tree: string[];
};

export default function TreeSearchPage() {
    const [values, setValues] = useState("1,2,3,4,5,null,6");
    const [buildType, setBuildType] = useState<"levelorder" | "bst">(
        "levelorder",
    );
    const [target, setTarget] = useState("");
    const [steps, setSteps] = useState<Step[]>([]);
    const [current, setCurrent] = useState(0);
    const [status, setStatus] = useState("");

    const buildTree = async () => {
        setStatus("");

        await fetch("http://127.0.0.1:8000/tree", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                operation: "build",
                build_type: buildType,
                values: values.split(",").map((v) => v.trim()),
            }),
        });
    };

    const runSearch = async () => {
        setStatus("");

        const res = await fetch("http://127.0.0.1:8000/tree", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                operation: "search",
                target: Number(target),
            }),
        });

        const data = await res.json();
        setSteps(data.steps);
        setCurrent(0);

        const last = data.steps[data.steps.length - 1];
        if (last.op === "found") setStatus("Found");
        if (last.op === "not_found") setStatus("Not Found");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Tree Search</h1>

            {/* Build */}
            <div style={{ marginBottom: "1rem" }}>
                <input
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    placeholder="Tree values"
                />

                <select
                    value={buildType}
                    onChange={(e) => setBuildType(e.target.value as any)}
                >
                    <option value="levelorder">Level Order</option>
                    <option value="bst">BST Insertion</option>
                </select>

                <button onClick={buildTree}>Build Tree</button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: "1rem" }}>
                <input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target"
                    style={{ width: "80px" }}
                />
                <button onClick={runSearch}>Search</button>
            </div>

            {/* Status */}
            {status && (
                <p
                    style={{
                        color: status === "Found" ? "#22c55e" : "#ef4444",
                        fontWeight: "bold",
                    }}
                >
                    {status}
                </p>
            )}

            {/* Visualization */}
            {steps.length > 0 && <TreeVisualizer step={steps[current]} />}
        </div>
    );
}
