import { Step } from "@/types";

type Props = {
    step: Step | null;
};

export default function ArrayBars({ step }: Props) {
    if (!step) return null;

    const { array, i, j, op } = step;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                marginTop: "2rem",
            }}
        >
            {array.map((value, idx) => {
                let background = "#6b7280";

                if (idx === i || idx === j) {
                    background = op === "swap" ? "#ef4444" : "#f59e0b";
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
                            transition: "all 0.3s ease",
                        }}
                    >
                        {value}
                    </div>
                );
            })}
        </div>
    );
}
