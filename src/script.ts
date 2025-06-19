import { readFileToCharArrays, readFileToCharArraysBinned, exportArrayToTSFile } from "./utils/charmapEditor";

const text = readFileToCharArraysBinned("./text/test_long.txt", 65);
exportArrayToTSFile(text, "text", "./assets/test_long.ts");
