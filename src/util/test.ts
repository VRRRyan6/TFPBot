import { Events } from 'discord.js';

module.exports = {
    name: 'Test',
    event: Events.ClientReady,
    execute() {
        console.log('yeee')
    } 
}
