import { Events } from 'discord.js';

module.exports = {
    name: 'test',
    event: Events.ClientReady,
    execute() {
        console.log('Test utility has been run!!')
    } 
}
