import { useEffect, useRef } from "react";
import { AnimatorProps } from "@/types";

export function useAnimator({
    isPlaying,
    speed,
    stepsLength,
    onNext,
}: AnimatorProps) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            onNext();
        }, speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, speed, onNext, stepsLength]);
}
