const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return interaction.reply({
                content: 'Bu komut su anda bot tarafinda kullanilamiyor. Bot yeniden baslatilmali veya komut yuklemesi eksik olabilir.',
                ephemeral: true
            });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Bu komut çalıştırılırken bir hata oluştu!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Bu komut çalıştırılırken bir hata oluştu!', ephemeral: true });
            }
        }
    },
};
