import SearchingVisualizer from "@/components/SearchingVisualizer";

const TITLE_MAP: Record<string, string> = {
    linear: "Linear Search",
    binary: "Binary Search",
};

export default async function SearchingAlgorithmPage({
    params,
}: {
    params: Promise<{ algorithm: string }>;
}) {
    const { algorithm } = await params;

    if (!TITLE_MAP[algorithm]) {
        return <h1>Algorithm not supported</h1>;
    }

    return (
        <SearchingVisualizer
            algorithm={algorithm}
            title={TITLE_MAP[algorithm]}
        />
    );
}
