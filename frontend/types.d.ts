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
        | "error"
        | "enqueue"
        | "dequeue"
        | "front";
    i: number;
    j: number;
    array: number[];
};

export type AnimatorProps = {
    isPlaying: boolean;
    speed: number;
    stepsLength: number;
    onNext: () => void;
};
