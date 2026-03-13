# 🎵 Discord Music Bot

A feature-rich Discord music bot built with **Discord.js v14** and **discord-player**, capable of playing audio from **YouTube** with full support for Discord's DAVE (E2EE) voice protocol.

## ✨ Features

- **YouTube Playback** — YouTube linkleri üzerinden yüksek kaliteli ses çalma.
- **DAVE Protocol Ready** — Discord'un yeni Uçtan Uca Şifreleme (E2EE) ses kanallarını tam destekler.
- **Slash Commands** — Modern `/play`, `/skip`, `/queue` ve `/stop` komutları.
- **Idle Timeout** — Şarkı bittiğinde veya kanal boşaldığında 3 dakika boyunca odada bekler.
- **Dynamic Handlers** — Otomatik yüklenen komut ve olay işleyicileri.
- **Hot Reload** — Geliştirme modunda `nodemon` ile otomatik yeniden başlatma.

## 🚀 Başlangıç

### Gereksinimler

- **Node.js** v16.9+ (LTS önerilir)
- **FFmpeg** yüklü ve PATH'e eklenmiş olmalı
- [Discord Developer Portal](https://discord.com/developers/applications) üzerinden alınmış bir Bot Token
- **Application ID** (Client ID) ve **Server ID** (Guild ID)

### Kurulum

```bash
git clone <your-repo-url>
cd discord-bot
npm install
```

### Yapılandırma

Bot iki farklı yöntemi destekler:

**Seçenek A — Yerel `config.json` (Geliştirme için):**
```json
{
    "token": "YOUR_BOT_TOKEN",
    "clientId": "YOUR_CLIENT_ID",
    "guildId": "YOUR_GUILD_ID"
}
```

**Seçenek B — Ortam Değişkenleri (Prodüksiyon/Dokploy için):**
```
TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
```

### Çalıştırma

```bash
npm run dev
```

Bu komut:
1. Slash komutlarını sunucunuza kaydeder (`deploy-commands.js`).
2. Botu `nodemon` ile başlatır.

## 🤖 Komutlar

| Komut | Açıklama |
|---------|-------------|
| `/play <link>` | Sadece YouTube linki ile şarkı çal |
| `/skip` | Çalınan şarkıyı atla |
| `/queue` | Sıradaki şarkıları gör |
| `/stop` | Müziği durdur ve kanaldan ayrıl |

## ☁️ Deployment (Dokploy)

Bu bot **Dokploy** üzerinde Dockerfile ile dağıtılmak üzere yapılandırılmıştır.

1. Dokploy'da GitHub deponuza bağlı yeni bir uygulama oluşturun.
2. **Build Type** kısmını **Dockerfile** olarak seçin.
3. **Environment** sekmesine `TOKEN`, `CLIENT_ID` ve `GUILD_ID` değişkenlerini ekleyin.
4. **Deploy** butonuna tıklayın.

## 📁 Proje Yapısı

```
discord-bot/
├── commands/           # Slash komut dosyaları
│   ├── play.js         # /play — YouTube link oynatma
│   ├── skip.js         # /skip — Şarkı atla
│   ├── queue.js        # /queue — Kuyruğu göster
│   └── stop.js         # /stop — Durdur ve ayrıl
├── events/             # Olay dinleyicileri
├── index.js            # Ana giriş dosyası
├── deploy-commands.js  # Komut kayıt aracı
├── Dockerfile          # Multi-stage Docker yapılandırması
├── .dockerignore       # Docker dışı dosyalar
├── package.json        # Bağımlılıklar
└── .gitignore
```

## 🛠️ Teknolojiler

- [Discord.js](https://discord.js.org/) v14
- [discord-player](https://discord-player.js.org/) v7
- [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec) (yt-dlp)
- [FFmpeg](https://ffmpeg.org/)


## 📝 License

ISC
