// Import local environment vars from .env
import * as dotenv from 'dotenv';
dotenv.config();

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
// Read each file
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Setup interactions event
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Setup ready event
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Login to bot account
client.login(process.env.DISCORD_TOKEN);
