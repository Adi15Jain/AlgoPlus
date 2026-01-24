import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
    title: "AlgoPlus",
    description: "Visualize algorithms step-by-step",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "system-ui" }}>
                <header
                    style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}
                >
                    <Link href="/">
                        <h2>AlgoPlus</h2>
                    </Link>
                </header>

                <main style={{ padding: "1.5rem" }}>{children}</main>
            </body>
        </html>
    );
}
