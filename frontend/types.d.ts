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
        | "front"
        | string;
    i: number;
    j: number;
    array: number[];
    tree: string[];
};

export type Props = {
    key?: number;
    value: string;
    x: number;
    y: number;
    highlight?: boolean;
};

export type AnimatorProps = {
    isPlaying: boolean;
    speed: number;
    stepsLength: number;
    onNext: () => void;
};

export type Phase = "input" | "explain" | "sorting" | "searching" | "done";

interface Payload {
    operation: "push" | "pop" | "peek";
    value?: number;
}
