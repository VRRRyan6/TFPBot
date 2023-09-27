import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Read a specified directory and grab typescript or javascript files
 * Allows the reading of typescript files for ts-node support
 * @param path Exact path of directory to read
 * @param arrayOfFiles optional, used for recursive option
 */
export function getFiles(path: string, arrayOfFiles?: string[]): string[] {
    const allowedExtensions = [".js", ".ts"];

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const filesPath = join(__dirname, path);
    const files = readdirSync(filesPath);

    let fileArray: string[] = arrayOfFiles || [];
    files.forEach((file) => {
        const filePath: string = join(filesPath, file);

        if (statSync(filePath).isDirectory()) {
            fileArray = getFiles(join(path, file), fileArray);
        } else {
            if (!allowedExtensions.some(extension => file.endsWith(extension))) return;

            fileArray.push(filePath);
        }
    })

    return fileArray;
}

/**
 * Uses regex to remove all file paths to get name of a file if not supplied in a module.
 * @param path Path to parse file name from
 */
export function getFileName(path: string): string {
    return path
        .substring(0, path.lastIndexOf('.'))
        .replace(/^.*(\\|\/|\:)/, '');
}

export default {};