"use client";

import { useState } from "react";
import TreeVisualizer from "../../../components/TreeVisualizer";

export default function TreeTraversalPage() {
    const [values, setValues] = useState("1,2,3,4,5,null,6");
    const [buildType, setBuildType] = useState<"levelorder" | "bst">(
        "levelorder",
    );
    const [steps, setSteps] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);

    const buildTree = async () => {
        const res = await fetch("http://127.0.0.1:8000/tree", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                operation: "build",
                build_type: buildType,
                values: values.split(",").map((v) => v.trim()),
            }),
        });
        const data = await res.json();

        setSteps(data.steps);
        setCurrent(0);
    };

    const runTraversal = async (algo: string) => {
        const res = await fetch("http://127.0.0.1:8000/tree", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                operation: "traversal",
                algorithm: algo,
            }),
        });

        if (!res.ok) {
            console.error("Traversal failed");
            return;
        }

        const data = await res.json();
        if (!data.steps) return;

        setSteps(data.steps);
        setCurrent(0);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Tree Traversals</h1>

            <input
                value={values}
                onChange={(e) => setValues(e.target.value)}
                placeholder="Values (comma separated)"
            />

            <select
                value={buildType}
                onChange={(e) => setBuildType(e.target.value as any)}
            >
                <option value="levelorder">Level Order</option>
                <option value="bst">BST Insertion</option>
            </select>

            <button onClick={buildTree}>Build Tree</button>

            <div style={{ marginTop: "1rem" }}>
                <button onClick={() => runTraversal("inorder")}>
                    In Order
                </button>
                <button onClick={() => runTraversal("preorder")}>
                    Pre Order
                </button>
                <button onClick={() => runTraversal("postorder")}>
                    Post Order
                </button>
                <button onClick={() => runTraversal("levelorder")}>
                    Level Order
                </button>
            </div>

            {steps?.length > 0 && <TreeVisualizer step={steps[current]} />}
        </div>
    );
}
