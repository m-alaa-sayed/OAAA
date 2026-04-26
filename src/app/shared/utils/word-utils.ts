// src/app/shared/utils/word-utils.ts
export function limitWords(input: string, maxWords: number = 250): { trimmedText: string, wordCount: number } {
    if (!input || input.trim() === '') {
        return { trimmedText: '', wordCount: 0 };
    }

    const wordsArray = input.trim().split(/\s+/);
    const wordCount = wordsArray.length;

    if (wordCount <= maxWords) {
        return { trimmedText: input, wordCount };
    }

    const trimmedText = wordsArray.slice(0, maxWords).join(' ');
    return { trimmedText, wordCount: maxWords };
}
