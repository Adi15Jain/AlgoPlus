type Props = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export default function TreeEdge({ x1, y1, x2, y2 }: Props) {
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6b7280"
            strokeWidth="2"
        />
    );
}
