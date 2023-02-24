// Import local environment vars from .env
import * as dotenv from 'dotenv';
dotenv.config();

// Default imports
import { getJsFiles } from './helpers';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import path = require('node:path');

// Create client
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Import commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getJsFiles(commandsPath);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`\x1b[32mLoaded command\x1b[0m [\x1b[36m${command.data.name}\x1b[0m]`);
    } else {
        console.log(`\x1b[31mThe command at \x1b[0m[\x1b[36m${filePath}\x1b[0m]\x1b[31m is missing a required "data" or "execute" property.\x1b[0m`);
    }
}

// Import util
client.util = new Collection();
const utilPath = path.join(__dirname, 'util');
const utilFiles = getJsFiles(utilPath);

for (const file of utilFiles) {
    const filePath = path.join(utilPath, file);
    const util = require(filePath);

    client.util.set(util.name, util);
    console.log(`\x1b[32mLoaded utility\x1b[0m [\x1b[36m${util.name}\x1b[0m]`);
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

    console.log(`\x1b[32mLoaded event\x1b[0m [\x1b[36m${event.name}\x1b[0m]`);
}

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
