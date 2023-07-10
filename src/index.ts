// Import local environment vars from .env
import * as dotenv from 'dotenv';
dotenv.config();

// Default imports
import { getJsFiles } from './helpers';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import color from 'ansi-colors';
import path = require('node:path');
import fs = require('node:fs');

// Create client
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Import commands
client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = getJsFiles(commandsPath);
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(color.green(`Loaded command ${color.bgCyan(command.data.name)}`));
        } else {
            console.log(color.red(`The command at ${color.bgCyan(filePath)} is missing a required "data" or "execute" property.`));
        }
    }
}

// Import util
client.util = new Collection();
const utilFoldersPath = path.join(__dirname, 'util');
const utilFolders = fs.readdirSync(utilFoldersPath)

for (const folder of utilFolders) {
    const utilPath = path.join(utilFoldersPath, folder);
    const utilFiles = getJsFiles(utilPath);
    for (const file of utilFiles) {
        const filePath = path.join(utilPath, file);
        const util = require(filePath);

        client.util.set(util.name, util);
        console.log(color.green(`Loaded utility ${color.bgCyan(util.name)}`));
    }
}


// Import events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = getJsFiles(eventsPath);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    // Go ahead and calculate used utilities beforehand
    const utilsToRun = client.util.filter((util) => util.event === event.name)

    if (event.once) {
        client.once(event.name, (...args) => {
            event.execute(...args)
            utilsToRun.each((util) => { util.execute(...args); });
        });
    } else {
        client.on(event.name, (...args) => {
            event.execute(...args)
            utilsToRun.each((util) => { util.execute(...args); });
        });
    }

    console.log(color.green(`Loaded event ${color.bgCyan(event.name)}`));
}

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
