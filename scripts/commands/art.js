module.exports.config = {
  name: "art",
  version: "1.0.5",
  permission: 0,
  credits: "IMRAN (modified by ChatGPT)",
  description: "Generate romantic and aesthetic art using canvas API",
  prefix: false,
  category: "art",
  usages: "[style] (reply optional)",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');

  if (args.length === 0) {
    return api.sendMessage(
      `✨🎨 𝑨𝒓𝒕 𝑮𝒂𝒍𝒍𝒆𝒓𝒚 🎨✨\n\n` +
      `Choose your art style:\n\n` +
      `🌸 coffee\n🎨 artist\n🐐 goats\n🖌️ snap\n🛍️ sale\n🗼 pisa\n🐱 cat\n🐾 kitty\n🕯️ summoning\n🌷 tulips\n🚇 underground\n🦇 vampire\n📸 vintage\n🖼️ wall\n💖 jigsaw\n🏗️ concrete\n🎊 festive\n🛣️ streets\n🌆 odessa\n🖋️ ink\n✏️ sketch\n🛤️ pavement\n🖍️ stencil\n🎨 graffiti\n📖 etude\n📚 book\n🪞 mirror\n\n` +
      `💌 Example:\nart mirror\n(Reply to someone for their art)`,
      event.threadID,
      event.messageID
    );
  }

  const styles = [
    "coffee", "artist", "goats", "snap", "sale", "pisa", "cat",
    "summoning", "tulips", "underground", "vampire", "vintage",
    "wall", "jigsaw", "concrete", "festive", "streets", "odessa",
    "ink", "sketch", "pavement", "stencil", "graffiti", "etude",
    "kitty", "book", "jolie", "chuck", "mirror" // ✅ added here
  ];

  const style = args[0].toLowerCase();

  if (!styles.includes(style)) {
    return api.sendMessage(
      `💔 Invalid style!\n\n🎨 Styles:\n${styles.join(', ')}`,
      event.threadID,
      event.messageID
    );
  }

  let uid;

  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  }
    else if (Object.keys(event.mentions || {}).length > 0) {
    uid = Object.keys(event.mentions)[0];
    }else {
    uid = event.senderID;
  }

  const url = `${global.imranapi.canvas}/${style}?userid=${uid}`;

  try {
    const response = await axios.get(url, { responseType: 'stream' });

    return api.sendMessage(
      {
        body: `🪞 Mirror ${style} art ready! ✨`,
        attachment: response.data
      },
      event.threadID,
      event.messageID
    );
  } catch (e) {
    console.error(e);
    return api.sendMessage(
      "❌ Failed to generate art!",
      event.threadID,
      event.messageID
    );
  }
};
