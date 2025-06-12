import { readFileToCharArrays, exportArrayToTSFile } from "./utils/charmapEditor";

const text = readFileToCharArrays("./text/test_long.txt");
exportArrayToTSFile(text, "text", "./assets/test_long.ts");
