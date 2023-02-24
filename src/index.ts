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
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Import util
client.util = new Collection();
const utilPath = path.join(__dirname, 'util');
const utilFiles = getJsFiles(utilPath);

for (const file of utilFiles) {
    const filePath = path.join(utilPath, file);
    const util = require(filePath);

    client.util.set(util.name, util)
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
            utilsToRun.each((util) => { util.execute(...args); });
            event.execute(...args)
        });
    } else {
        client.on(event.name, (...args) => {
            utilsToRun.each((util) => { util.execute(...args); });
            event.execute(...args)
        });
    }
}

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
