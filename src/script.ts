import { splitPreservingWords } from "./utils/charmapEditor";
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

const text = readFileToCharArraysBinned("./text/test_long.txt", 65);
exportArrayToTSFile(text, "text", "./assets/test_long.ts");
