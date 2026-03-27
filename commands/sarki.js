const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');

const DATA_FILE = './sarkilar.json';

// Veri dosyasını kontrol et ve yükle
let oneriler = {};
if (fs.existsSync(DATA_FILE)) {
    try {
        oneriler = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (err) {
        oneriler = {};
    }
}

// HAFTALIK SIFIRLAMA: Her Pazartesi 00:00'da çalışır
cron.schedule('0 0 * * 1', () => {
    oneriler = {}; // Tüm veriyi temizle
    fs.writeFileSync(DATA_FILE, JSON.stringify(oneriler, null, 2));
    console.log('--- Haftalık şarkı listesi başarıyla sıfırlandı ---');
}, {
    timezone: "Europe/Istanbul" // Türkiye saatine göre ayarlı
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sarki')
        .setDescription('Şarkı öneri ve listeleme sistemi')
        .addSubcommand(sub =>
            sub.setName('oneri')
                .setDescription('Bir YouTube linki önerin')
                .addStringOption(opt =>
                    opt.setName('link')
                        .setDescription('YouTube video linki')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('listele')
                .setDescription('Bu hafta önerilen tüm şarkıları gör')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId;

        // --- ÖNERİ KOMUTU ---
        if (subcommand === 'oneri') {
            const link = interaction.options.getString('link');

            // Basit YouTube link kontrolü
            if (!link.includes('youtube.com') && !link.includes('youtu.be')) {
                return interaction.reply({ content: ' Lütfen geçerli bir YouTube linki girin.', ephemeral: true });
            }

            const gun = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
            const user = interaction.user.username;

            if (!oneriler[guildId]) oneriler[guildId] = [];

            oneriler[guildId].push({
                user: user,
                link: link,
                gun: gun,
                tarih: new Date().toLocaleDateString('tr-TR')
            });

            fs.writeFileSync(DATA_FILE, JSON.stringify(oneriler, null, 2));

            return interaction.reply(` **${user}**, önerin kaydedildi! (${gun})`);
        }

        // --- LİSTELE KOMUTU ---
        if (subcommand === 'listele') {
            const guildOnerileri = oneriler[guildId] || [];

            if (guildOnerileri.length === 0) {
                return interaction.reply(' Bu hafta henüz hiç şarkı önerilmemiş. İlk öneriyi sen yap!');
            }

            const embed = new EmbedBuilder()
                .setTitle('Haftalık Şarkı Listesi')
                .setDescription('Bu liste her Pazartesi gece yarısı sıfırlanır.')
                .setColor('#FF0000')
                .setTimestamp()
                .setFooter({ text: `${interaction.guild.name} Önerileri` });

            const listeMetni = guildOnerileri.map((o, index) =>
                `**${index + 1}.** [Linke Git](${o.link}) \n└ 👤 *${o.user}* | 📅 *${o.gun}*`
            ).join('\n\n');

            embed.setDescription(listeMetni);

            return interaction.reply({ embeds: [embed] });
        }
    },
};