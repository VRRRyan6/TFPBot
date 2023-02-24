// Import local environment vars from .env
import * as dotenv from 'dotenv'
dotenv.config()

// Default imports
import fs = require('node:fs');
import path = require('node:path');
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

// Create client
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Import commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

// Send ready event
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
