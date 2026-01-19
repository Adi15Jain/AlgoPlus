export async function runSorting(
    algorithm: string,
    array: number[],
    target?: number,
) {
    const res = await fetch("http://127.0.0.1:8000/sorting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            algorithm,
            array,
            target,
        }),
    });

    if (!res.ok) {
        throw new Error("Backend request failed");
    }

    return res.json();
}
