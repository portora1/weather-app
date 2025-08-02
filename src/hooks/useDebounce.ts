// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay:number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [value,delay]
    );
    return debouncedValue;
}

//　このフックは値(value)を受け取って指定した時間(delay)だけ遅延させた値を返す　というもの