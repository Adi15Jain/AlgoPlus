import Link from "next/link";

export default function SearchingPage() {
    return (
        <>
            <h1>Searching Algorithms</h1>

            <ul style={{ marginTop: "1rem" }}>
                <li>
                    <Link href="/searching/linear">Linear Search</Link>
                </li>
                <li>
                    <Link href="/searching/binary">Binary Search</Link>
                </li>
            </ul>
        </>
    );
}
