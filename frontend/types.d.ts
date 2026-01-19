export type Step = {
    op: "compare" | "swap" | "overwrite";
    i: number;
    j: number;
    array: number[];
};
