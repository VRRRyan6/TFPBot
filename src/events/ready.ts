import { Events, type Client } from 'discord.js'
import color from 'ansi-colors';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client) return;
        console.log(color.magenta(`Ready! Logged in as ${color.bgBlue(client.user!.tag)}`));
    },
};
