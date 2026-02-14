import { expect, test } from "vitest";
import { formatTime, shuffle } from "@/components/puzzle-game/tools";

test("time formatting (minutes)", () => {
    const result = formatTime(1000)
    expect(result).toBe("16:40.000");
});

test("time formatting (hours)", () => {
    const result = formatTime(4600)
    expect(result).toBe("1:16:40.000");
});

test("time formatting (zero)", () => {
    const result = formatTime(0)
    expect(result).toBe("0:00.000");
});

test("time formatting (seconds)", () => {
    const result = formatTime(10)
    expect(result).toBe("0:10.000");
});

test("time formatting (undefined)", () => {
    const result = formatTime(undefined)
    expect(result).toBe("0:00.000");
});

test("shuffle", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = shuffle(array);
    
    expect(shuffled).toHaveLength(array.length);
    expect(shuffled).toEqual(expect.arrayContaining(array));
});
