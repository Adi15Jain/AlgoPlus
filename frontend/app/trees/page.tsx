import Link from "next/link";

export default function TreeHome() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Trees</h1>
            <p>Build a tree and visualize traversals or searching.</p>

            <ul style={{ marginTop: "1rem" }}>
                <li>
                    <Link href="/trees/traversal">
                        Tree Traversals (Inorder / Preorder / Postorder / BFS)
                    </Link>
                </li>
                <li>
                    <Link href="/trees/search">Tree Searching</Link>
                </li>
            </ul>
        </div>
    );
}
