export type Step = {
    op: "compare" | "swap" | "overwrite" | "visit" | "found" | "not_found";
    i: number;
    j: number;
    array: number[];
};
