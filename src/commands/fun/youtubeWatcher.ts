import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtubewatcher')
        .setDescription('Configuration for the youtubeWatcher!'),
    async execute(interaction: ChatInputCommandInteraction) {
        console.log(interaction)
    }
}