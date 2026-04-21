const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "song",
  version: "2.3.0",
  permission: 0,
  credits: "IMRAN",
  description: "Search and download songs from YouTube (MP3 direct).",
  prefix: false,
  category: "media",
  usages: "song [music name]",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  if (!query) {
    return api.sendMessage(
      "❌ Please provide a song name.\n📌 Example: song Let Me Love You",
      event.threadID,
      event.messageID
    );
  }

  try {
    const searchingMessage = await api.sendMessage(
      `🔍 Searching for "${query}"...\n⏳ Please wait...`,
      event.threadID
    );

    // ✅ Search with betadash-search-download
    const searchResponse = await axios.get(
      `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`
    );
    const songData = searchResponse.data[0];

    if (!songData || !songData.url) {
      return api.sendMessage(
        "⚠️ No results found. Try another song.",
        event.threadID,
        event.messageID
      );
    }

    const ytUrl = songData.url;
    const title = songData.title;
    const channelName = songData.channelName || "Unknown";

    await api.editMessage(
      `🎶 Found: ${title}\n⬇️ Downloading...`,
      searchingMessage.messageID
    );

    // ✅ Download API ব্যবহার 
    const downloadResponse = await axios.get(
      `https://nayan-video-downloader.vercel.app/ytdown?url=${encodeURIComponent(ytUrl)}`
    );

    const audioUrl = downloadResponse.data.data.audio;
    if (!audioUrl) {
      return api.sendMessage(
        "⚠️ Failed to fetch download link. Try again.",
        event.threadID,
        event.messageID
      );
    }

    const filePath = path.join(__dirname, `cache/song_${Date.now()}.mp3`);

    // Download audio
    const audioStream = await axios({
      method: "get",
      url: audioUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    audioStream.data.pipe(writer);

    writer.on("finish", async () => {
      await api.sendMessage(
        {
          body: `✅ Download Complete!\n🎧 Title: ${title}\n🎤 Channel: ${channelName}\n📥 Enjoy your song!`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(
        "❌ Error downloading song. Please try again.",
        event.threadID,
        event.messageID
      );
    });
  } catch (err) {
    console.error("❌ Error:", err);
    api.sendMessage(
      "⚠️ Unexpected error occurred. Try again later.",
      event.threadID,
      event.messageID
    );
  }
};
