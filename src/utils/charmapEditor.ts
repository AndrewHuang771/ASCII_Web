import { Charmap } from "../classes/Charmap";
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function readFileToCharArrays(filePath: string): string[][] {
    try {
        const absolutePath = resolve(filePath);
        const fileContents = readFileSync(absolutePath, 'utf-8');

        const lines = fileContents.split(/\r?\n/); // Split into lines
        const arrayOfCharArrays = lines.map(line => [...line]); // Split each line into characters

        return arrayOfCharArrays;
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

export function readFileToCharArraysBinned(filePath: string, maxRowWidth: number): string[] {
    try {
        const absolutePath = resolve(filePath);
        const fileContents = readFileSync(absolutePath, 'utf-8');

        return splitPreservingWords(fileContents, maxRowWidth);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

export function splitPreservingWords(input: string, maxLength: number): string[] {
    const rows: string[] = [];
    let line = "";

    // Normalize CRLF (\r\n) and LF (\n) into a common token `\n` for easier handling
    const normalizedInput = input.replace(/\r\n/g, "\n");

    // Tokenize: words, whitespace, and newlines
    const tokens = normalizedInput.match(/[^\s\n]+|\s+|\n/g) || [];

    for (const token of tokens) {
        if (token === "\n") {
            // Force line break on newline
            rows.push(line);
            line = "    ";
        } else if ((line + token).length > maxLength) {
            if (line.length > 0) {
                rows.push(line);
                line = "";
            }

            if (token.trim() === "") {
                // Just whitespace — move it to new line if possible
                line = token;
            } else if (token.length > maxLength) {
                // Word is longer than line — break it into chunks
                const parts = token.match(new RegExp(`.{1,${maxLength}}`, 'g'))!;
                rows.push(...parts.slice(0, -1));
                line = parts[parts.length - 1];
            } else {
                // Start new line with token
                line = token;
            }
        } else {
            // Safe to append token
            line += token;
        }
    }

    if (line.length > 0) {
        rows.push(line);
    }

    return rows;
}

export function exportArrayToTSFile(array: string[], variableName: string, outputPath: string) {
    const exportContent = `export const ${variableName} = ${JSON.stringify(array, null, 2)};\n`;
    const fullPath = resolve(outputPath);

    try {
        writeFileSync(fullPath, exportContent, 'utf-8');
        console.log(`Array written to ${fullPath} as export ${variableName}`);
    } catch (err) {
        console.error('Failed to write file:', err);
    }
}
