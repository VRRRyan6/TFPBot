// Import local environment vars from .env
import * as dotenv from 'dotenv'
dotenv.config()

// Default imports
import { fs } from 'node:fs';
import { path } from 'node:path';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

// Create client
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Import commands
client.commands = new Collection();

// Send ready event
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
