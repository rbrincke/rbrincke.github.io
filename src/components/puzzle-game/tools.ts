/**
 * Format elapsed time in seconds to a string. Includes hours only if the time is long enough.
 */
export function formatTime(elapsedMilliseconds: number | undefined): string {
    if (elapsedMilliseconds === undefined) {
        return "0:00.000";
    }

    const formatted = new Date(elapsedMilliseconds * 1000).toISOString().substring(11, 23);

    return formatted.replace(/^[0:]+(?=\d[\d:]{3})/, '');
}

/**
 * Fisher-Yates shuffle algorithm.
 */
export function shuffle(array: number[]): number[] {
    let result: number[] = array.slice(0);

    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));

        // Swap with the current element.
        [result[currentIndex], result[randomIndex]] = [result[randomIndex]!, result[currentIndex]!];
    }

    return result;
}
