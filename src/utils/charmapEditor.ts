export function splitPreservingWords(input: string, maxLength: number): string[] {
    const rows: string[] = [];
    let line = "    ";

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

    for (let x = 0; x < rows.length; x++) {
        if (rows[x].length > 1) {
            if (rows[x][0] == " " && rows[x][1] != " ") {
                rows[x] = rows[x].trim();
            }
        }
    }

    return rows;
}
