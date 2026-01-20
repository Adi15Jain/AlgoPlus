export type Step = {
    op:
        | "compare"
        | "swap"
        | "overwrite"
        | "visit"
        | "found"
        | "not_found"
        | "push"
        | "pop"
        | "peek"
        | "error";
    i: number;
    j: number;
    array: number[];
};
