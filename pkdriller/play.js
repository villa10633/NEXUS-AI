const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const axios = require("axios");

zokou({
  nomCom: "play",
  categorie: "Download",
  reaction: "🎧"
}, async (jid, sock, { ms, repondre, arg, nomCom }) => {
  if (!arg[0]) {
    return repondre("🎧 *Please enter a song name!*\n\nExample: `.play Shape of You`");
  }

  const query = arg.join(" ");
  await repondre(`🔍 *Searching for:* _${query}_`);

  try {
    const searchResult = await yts(query);
    const videos = searchResult.videos;

    if (videos.length === 0) {
      return repondre("❌ *No results found!*\nTry a different song name.");
    }

    const song = videos[0];
    const videoUrl = song.url;

    const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
    const { data } = await axios.get(apiUrl);

    if (data.status === 200 && data.success) {
      const audioUrl = data.result.download_url;

      const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "👀💙💜",
          newsletterName: "NEXUS-TECH",
          serverMessageId: 100
        }
      };

      // Send thumbnail preview
      await sock.sendMessage(jid, {
        image: { url: song.thumbnail },
        caption: `🎶 *${song.title}*\n\n📺 *Channel:* ${song.author.name}\n⏱ *Duration:* ${song.timestamp}\n🔗 *URL:* ${videoUrl}\n\n📥 _Downloading audio..._`,
        contextInfo
      }, { quoted: ms });

      // Send audio file
      await sock.sendMessage(jid, {
        audio: { url: audioUrl },
        mimetype: "audio/mp4",
        contextInfo
      }, { quoted: ms });

      // Send working buttons
      const buttonMessage = {
        text: `✅ *Download Complete!*\n\n🎧 *${song.title}*\n\n💡 Choose an option below:`,
        footer: "NEXUS-AI Music Bot 🎵",
        buttons: [
          { buttonId: `.play ${query}`, buttonText: { displayText: "🔁 Download Again" }, type: 1 },
          { buttonId: `.channel`, buttonText: { displayText: "📢 Join Channel" }, type: 1 }
        ],
        headerType: 1,
        contextInfo
      };

      await sock.sendMessage(jid, buttonMessage, { quoted: ms });

    } else {
      repondre("⚠️ *Download failed!*\nPlease try again later.");
    }
  } catch (error) {
    console.error("Play command error:", error);
    repondre("❌ *Something went wrong!*\nTry again shortly.");
  }
});
