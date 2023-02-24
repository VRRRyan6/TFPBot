import { Events, type Client } from 'discord.js'

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client) return;
        console.log(`\x1b[35mReady! Logged in as \x1b[44m${client.user?.tag}\x1b[0m`);
    },
};
