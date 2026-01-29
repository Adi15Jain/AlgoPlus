import { Props } from "@/types";

export default function TreeNode({ key, value, x, y, highlight }: Props) {
    return (
        <div
            key={key}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: highlight ? "#22c55e" : "#1f2933",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                transform: "translate(-50%, -50%)",
                border: "2px solid #374151",
            }}
        >
            {value}
        </div>
    );
}
