import { Events, type Client } from 'discord.js'

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client) return;
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    },
};
