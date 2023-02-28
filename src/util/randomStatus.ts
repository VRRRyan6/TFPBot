import { ActivityOptions, ActivityType, Client, Events } from 'discord.js';
import { yellow } from 'ansi-colors';

const statusMessages: ActivityOptions[] = [
    {
        name: 'over the peasants',
        type: ActivityType.Watching
    }
]

module.exports = {
    name: 'randomStatus',
    event: Events.ClientReady,
    execute(client: Client) {
        const status = statusMessages[Math.floor(statusMessages.length * Math.random())]
        if (!status) return console.log(yellow(`[randomStatus] Missing statusMessages, not running utility.`))

        return client.user?.setActivity(status)
    }
}
