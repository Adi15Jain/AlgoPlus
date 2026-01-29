import TreeNode from "./tree/TreeNode";
import TreeEdge from "./tree/TreeEdge";
import React from "react";

type Step = {
    op: string;
    i: number;
    j: number;
    tree: string[];
};

type Props = {
    step: Step | null;
};

export default function TreeVisualizer({ step }: Props) {
    if (!step) return null;

    const { tree, i: activeIndex } = step;
    const width = 800;
    const levelGap = 90;

    const nodes = tree
        .map((value, idx) => {
            if (value === "null") return null;

            const level = Math.floor(Math.log2(idx + 1));
            const levelStart = Math.pow(2, level) - 1;
            const pos = idx - levelStart;
            const slots = Math.pow(2, level);

            const x = (width / (slots + 1)) * (pos + 1);
            const y = level * levelGap + 40;

            return { idx, value, x, y };
        })
        .filter(Boolean) as any[];

    return (
        <div style={{ position: "relative", width, height: 400 }}>
            {/* Edges */}
            <svg
                width={width}
                height={400}
                style={{ position: "absolute", top: 0, left: 0 }}
            >
                {nodes.map((n) => {
                    const leftIdx = 2 * n.idx + 1;
                    const rightIdx = 2 * n.idx + 2;

                    return (
                        <React.Fragment key={n.idx}>
                            {nodes.find((c) => c.idx === 2 * n.idx + 1) && (
                                <TreeEdge
                                    x1={n.x}
                                    y1={n.y}
                                    x2={nodes.find((c) => c.idx === leftIdx)!.x}
                                    y2={nodes.find((c) => c.idx === leftIdx)!.y}
                                />
                            )}
                            {nodes.find((c) => c.idx === 2 * n.idx + 2) && (
                                <TreeEdge
                                    x1={n.x}
                                    y1={n.y}
                                    x2={
                                        nodes.find((c) => c.idx === rightIdx)!.x
                                    }
                                    y2={
                                        nodes.find((c) => c.idx === rightIdx)!.y
                                    }
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </svg>

            {/* Nodes */}
            {nodes.map((n) => (
                <TreeNode
                    key={n.idx}
                    // step={step}
                    value={n.value}
                    x={n.x}
                    y={n.y}
                    highlight={n.idx === activeIndex}
                />
            ))}
        </div>
    );
}
