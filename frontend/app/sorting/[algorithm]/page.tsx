import SortingVisualizer from "@/components/SortingVisualizer";

const TITLE_MAP: Record<string, string> = {
    bubble: "Bubble Sort",
    insertion: "Insertion Sort",
    selection: "Selection Sort",
    merge: "Merge Sort",
    heap: "Heap Sort",
    quick: "Quick Sort",
};

export default async function SortingAlgorithmPage({
    params,
}: {
    params: Promise<{ algorithm: string }>;
}) {
    const { algorithm } = await params; // ✅ THIS is the key change

    if (!TITLE_MAP[algorithm]) {
        return <h1>Algorithm not supported</h1>;
    }

    return (
        <SortingVisualizer algorithm={algorithm} title={TITLE_MAP[algorithm]} />
    );
}
