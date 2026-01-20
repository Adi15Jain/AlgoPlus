import { Step } from "@/types";

export default function StackView({ step }: { step: Step | null }) {
    if (!step) return null;

    const { array, i, op } = step;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
                gap: "8px",
                marginTop: "2rem",
            }}
        >
            {array.map((value, idx) => {
                let bg = "#6b7280";

                // Top element highlight
                if (idx === i && (op === "push" || op === "peek")) {
                    bg = "#22c55e"; // green
                }

                if (idx === i && op === "pop") {
                    bg = "#ef4444"; // red
                }

                return (
                    <div
                        key={idx}
                        style={{
                            width: "120px",
                            height: "40px",
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

            {/* Base */}
            <div
                style={{
                    width: "140px",
                    height: "10px",
                    background: "#374151",
                    borderRadius: "4px",
                }}
            />
        </div>
    );
}
