import { readdirSync } from 'node:fs';

/**
 * Read a specified directory and grab typescript or javascript files
 * Allows the reading of typescript files for ts-node support
 * @param path Exact path of directory to read
 */
export function getJsFiles(path: string): string[] {
    const allowedExtensions = [".js", ".ts"];

    return readdirSync(path)
        .filter((file) => {
            return allowedExtensions.some(extension => file.endsWith(extension));
        });
}

export default {};