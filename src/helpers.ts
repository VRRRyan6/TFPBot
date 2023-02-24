import fs = require('node:fs');

export function getJsFiles(path: string) {
    return fs.readdirSync(path).filter((file) => file.endsWith('.js'));
}

export default {}
