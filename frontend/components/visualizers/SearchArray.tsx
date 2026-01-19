import { Step } from "@/types";

type Props = {
    step: Step | null;
};

export default function SearchArray({ step }: Props) {
    if (!step) return null;

    const { array, i, op } = step;

    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-end",
                marginTop: "2rem",
            }}
        >
            {array.map((value, idx) => {
                let bg = "#6b7280"; // default

                if (idx === i && op === "visit") bg = "#f59e0b"; // orange
                if (idx === i && op === "found") bg = "#22c55e"; // green
                if (op === "not_found") bg = "#ef4444"; // red

                return (
                    <div
                        key={idx}
                        style={{
                            width: "40px",
                            height: `${value * 20}px`,
                            background: bg,
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
