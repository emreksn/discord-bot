const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emre')
        .setDescription('Replies with Emre!'),
    async execute(interaction) {
        await interaction.reply('Emre!');
    },
};
