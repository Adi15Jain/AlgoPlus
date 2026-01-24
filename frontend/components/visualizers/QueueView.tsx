import { Step } from "@/types";

export default function QueueView({ step }: { step: Step | null }) {
    if (!step) return null;

    const { array, op } = step;

    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "2rem",
            }}
        >
            {array.map((value, idx) => {
                let bg = "#6b7280";

                // front highlight
                if (idx === 0 && (op === "front" || op === "dequeue")) {
                    bg = "#f59e0b"; // orange
                }

                // enqueue highlight (rear)
                if (idx === array.length - 1 && op === "enqueue") {
                    bg = "#22c55e"; // green
                }

                return (
                    <div
                        key={idx}
                        style={{
                            width: "60px",
                            height: "60px",
                            background: bg,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {value}
                    </div>
                );
            })}

            {/* Rear marker */}
            {array.length > 0 && (
                <span style={{ marginLeft: "10px", color: "#9ca3af" }}>
                    rear →
                </span>
            )}
        </div>
    );
}
