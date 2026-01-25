"use client";

import Link from "next/dist/client/link";

export default function Home() {
    return (
        <>
            <h1>Data Structures & Algorithms Visualizer</h1>

            <ul style={{ marginTop: "1rem" }}>
                <li>
                    <Link href="/sorting">Sorting Algorithms</Link>
                </li>
                <li>
                    <Link href="/searching">Searching Algorithms</Link>
                </li>
                <li>
                    <Link href="/stacks">Stacks</Link>
                </li>
                <li>
                    <Link href="/queue">Queues</Link>
                </li>
                <li>
                    <Link href="/learn/binarySearchRequiresSorting">
                        Guided Lesson: Why Binary Search Needs Sorting
                    </Link>
                </li>
            </ul>
        </>
    );
}
