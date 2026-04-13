const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const db = require('../db.js');

const ALLOWED_USER_ID = '1163124552084226069';

function buildComponents(pageIndex, totalPages) {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('oyunonerilistele_prev')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(pageIndex === 0),
            new ButtonBuilder()
                .setCustomId('oyunonerilistele_next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(pageIndex === totalPages - 1),
            new ButtonBuilder()
                .setCustomId('oyunonerilistele_delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
        )
    ];
}

function buildEmbed(interaction, entries, pageIndex) {
    const entry = entries[pageIndex];
    const createdAt = entry.created_at ? `<t:${Math.floor(new Date(entry.created_at).getTime() / 1000)}:f>` : 'Bilinmiyor';

    return new EmbedBuilder()
        .setTitle('Oyun Oneri Listesi')
        .setColor('#2F3136')
        .addFields(
            { name: 'Kategori', value: entry.category || 'Bilinmiyor' },
            { name: 'Oneri', value: entry.suggestion || 'Bos' },
            { name: 'Kullanici', value: entry.username || 'Bilinmiyor' },
            { name: 'Tarih', value: createdAt }
        )
        .setFooter({ text: `Kayit ${pageIndex + 1}/${entries.length} | ${interaction.guild.name}` })
        .setTimestamp();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oyunonerilistele')
        .setDescription('Kaydedilen oyun onerilerini tek tek gosterir.'),

    async execute(interaction) {
        if (interaction.user.id !== ALLOWED_USER_ID) {
            return interaction.reply({
                content: 'Bu komutu kullanamazsin.',
                ephemeral: true
            });
        }

        if (!interaction.inGuild()) {
            return interaction.reply({
                content: 'Bu komut sadece sunucularda kullanilabilir.',
                ephemeral: true
            });
        }

        let entries;

        try {
            entries = await db.getGameSuggestionsByGuild(interaction.guildId);
        } catch (error) {
            console.error('[oyunonerilistele] Oyun onerileri okunamadi:', error);
            return interaction.reply({
                content: 'Oyun onerileri su anda okunamiyor.',
                ephemeral: true
            });
        }

        if (entries.length === 0) {
            return interaction.reply({
                content: 'Bu sunucuda henuz kayitli oyun onerisi yok.',
                ephemeral: true
            });
        }

        let pageIndex = 0;

        await interaction.reply({
            embeds: [buildEmbed(interaction, entries, pageIndex)],
            components: buildComponents(pageIndex, entries.length)
        });

        const message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({
            time: 10 * 60 * 1000
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                await buttonInteraction.reply({
                    content: 'Bu menuyu sadece komutu kullanan kisi kontrol edebilir.',
                    ephemeral: true
                });
                return;
            }

            if (buttonInteraction.customId === 'oyunonerilistele_delete') {
                collector.stop('deleted');
                await buttonInteraction.message.delete().catch(() => null);
                return;
            }

            if (buttonInteraction.customId === 'oyunonerilistele_prev' && pageIndex > 0) {
                pageIndex -= 1;
            }

            if (buttonInteraction.customId === 'oyunonerilistele_next' && pageIndex < entries.length - 1) {
                pageIndex += 1;
            }

            await buttonInteraction.update({
                embeds: [buildEmbed(interaction, entries, pageIndex)],
                components: buildComponents(pageIndex, entries.length)
            });
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'deleted') {
                return;
            }

            await message.edit({
                components: []
            }).catch(() => null);
        });
    }
};
