export async function Sorting(algorithm: string, array: number[]) {
    const res = await fetch("http://127.0.0.1:8000/sorting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            algorithm,
            array,
        }),
    });

    if (!res.ok) {
        throw new Error("Backend request failed");
    }

    return res.json();
}
