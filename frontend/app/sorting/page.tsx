import Link from "next/link";

const SortingPage = () => {
    return (
        <>
            <h1>Sorting Algorithms</h1>

            <ul style={{ marginTop: "1rem" }}>
                <li>
                    <Link href="/sorting/bubble">Bubble Sort</Link>
                </li>
                <li>
                    <Link href="/sorting/insertion">Insertion Sort</Link>
                </li>
                <li>
                    <Link href="/sorting/selection">Selection Sort</Link>
                </li>
                <li>
                    <Link href="/sorting/merge">Merge Sort</Link>
                </li>
                <li>
                    <Link href="/sorting/heap">Heap Sort</Link>
                </li>
                <li>
                    <Link href="/sorting/quick">Quick Sort</Link>
                </li>
            </ul>
        </>
    );
};

export default SortingPage;
