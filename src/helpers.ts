import fs = require('node:fs');
import { green, yellow, red } from 'ansi-colors';

/**
 * Read a specified directory and grab compiled javascript files
 * @param path Exact path of directory to read
 */
export function getJsFiles(path: string): string[] {
    return fs.readdirSync(path).filter((file) => file.endsWith('.js'));
}

export default {};


/**
 * Override console methods
 */
if (!process.env.DEV) {
    (function(){
        const log = console.log;
        const warn = console.warn;
        const error = console.error;

        console.log = (message, location = null) => {
            log(location 
                ? green(`[${location}] ${message}`)
                : green(message)
            );
        }

        console.warn = (message, location = null) => {
            warn(location
                ? yellow(`[${location}] ${message}`)
                : yellow(message)
            );
        }

        console.error = (message, location = null) => {
            error(location
                ? red(`[${location}] ${message}`)
                : red(message)
            );
        }
    })();
}
