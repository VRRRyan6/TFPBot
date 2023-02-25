import * as dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';
import color from 'ansi-colors';
import fs = require('node:fs');
import path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    const arg = process.argv[2]

    if (!arg || !(arg === 'true' || 'false')) { 
        console.log(color.red('You must provide "true" or "false" for the deploy script!'))
        process.exit()
    }

    try {
        console.log(color.magenta(`Started refreshing ${commands.length} application (/) commands.`));

        let data: any;
        if (arg === 'true') {
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands },
            );

            console.log(color.bgYellow(`Deploy script set to global deploy, provide false argument for local deployment!`))
        } else {
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
                { body: commands },
            );
            
            console.log(color.bgYellow(`Deploy script set to local deploy, provide true argument for global deployment!`))
        }

        console.log(color.bgGreen(`Successfully reloaded ${data.length} application (/) commands.`));
    } catch (error) {
        console.error(error);
    }
})();
