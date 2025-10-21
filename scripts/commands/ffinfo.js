const axios = require("axios");

module.exports.config = {
  name: "ffinfo",
  version: "2.0.0",
  permission: 0,
  credits: "IMRAN",
  description: "Get every single Free Fire account info by UID",
  prefix: true,
  category: "game",
  usages: "ffinfo <uid>",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage("⚠️ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙐𝙄𝘿!\n𝙀𝙭𝙖𝙢𝙥𝙡𝙚: 𝙛𝙛𝙞𝙣𝙛𝙤 6605263063", threadID, messageID);
  }

  const uid = args[0];
  const url = `https://ffinfo-api.vercel.app/get?uid=${uid}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (!data || !data.AccountInfo) {
      return api.sendMessage("❌ 𝙉𝙤 𝙁𝙧𝙚𝙚 𝙁𝙞𝙧𝙚 𝙖𝙘𝙘𝙤𝙪𝙣𝙩 𝙛𝙤𝙪𝙣𝙙 𝙬𝙞𝙩𝙝 𝙩𝙝𝙞𝙨 𝙐𝙄𝘿!", threadID, messageID);
    }

    const acc = data.AccountInfo;
    const profile = data.AccountProfileInfo || {};
    const guild = data.GuildInfo || {};
    const captain = data.captainBasicInfo || {};
    const credit = data.creditScoreInfo || {};
    const pet = data.petInfo || {};
    const social = data.socialinfo || {};

    const createdAt = new Date(acc.AccountCreateTime * 1000).toLocaleString("bn-BD");
    const lastLogin = new Date(acc.AccountLastLogin * 1000).toLocaleString("bn-BD");
    const captainCreate = captain.createAt ? new Date(captain.createAt * 1000).toLocaleString("bn-BD") : "N/A";

    const cleanBio = social.signature ? social.signature.replace(/\[.*?\]/g, "") : "No bio";

    const message = `
🎮 𝗙𝗥𝗘𝗘 𝗙𝗜𝗥𝗘 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 🎮

👤 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:
┌─ 🎯 𝗡𝗮𝗺𝗲: ${acc.AccountName}
├─ 🆔 𝗨𝗜𝗗: ${uid}
├─ 🌍 𝗥𝗲𝗴𝗶𝗼𝗻: ${acc.AccountRegion}
├─ 📅 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${createdAt}
├─ ⏰ 𝗟𝗮𝘀𝘁 𝗟𝗼𝗴𝗶𝗻: ${lastLogin}
├─ ⭐ 𝗟𝗲𝘃𝗲𝗹: ${acc.AccountLevel}
├─ 💥 𝗘𝗫𝗣: ${acc.AccountEXP}
├─ ❤️ 𝗟𝗶𝗸𝗲𝘀: ${acc.AccountLikes}
├─ 💳 𝗧𝘆𝗽𝗲: ${acc.AccountType == 1 ? "Normal" : "Guest"}
├─ 🏅 𝗕𝗣 𝗕𝗮𝗱𝗴𝗲: ${acc.AccountBPBadges}
├─ 🛡️ 𝗕𝗣 𝗜𝗗: ${acc.AccountBPID}
├─ 🖼️ 𝗔𝘃𝗮𝘁𝗮𝗿: ${acc.AccountAvatarId}
└─ 🎏 𝗕𝗮𝗻𝗻𝗲𝗿: ${acc.AccountBannerId}

⚡ 𝗚𝗔𝗠𝗘 𝗦𝗧𝗔𝗧𝗦:
┌─ 🔰 𝗦𝗲𝗮𝘀𝗼𝗻: ${acc.AccountSeasonId}
├─ 🔫 𝗪𝗲𝗮𝗽𝗼𝗻𝘀: ${acc.EquippedWeapon.join(", ")}
├─ 🧩 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${acc.ReleaseVersion}
├─ 🏆 𝗕𝗥 𝗥𝗮𝗻𝗸: ${acc.BrMaxRank} (${acc.BrRankPoint} pts)
├─ ⚔️ 𝗖𝗦 𝗥𝗮𝗻𝗸: ${acc.CsMaxRank} (${acc.CsRankPoint} pts)
└─ 🎖️ 𝗧𝗶𝘁𝗹𝗲 𝗜𝗗: ${acc.Title}

👗 𝗢𝗨𝗧𝗙𝗜𝗧 & 𝗦𝗞𝗜𝗟𝗟𝗦:
┌─ 👕 𝗢𝘂𝘁𝗳𝗶𝘁: ${profile.EquippedOutfit?.join(", ") || "N/A"}
└─ ⚙️ 𝗦𝗸𝗶𝗹𝗹𝘀: ${profile.EquippedSkills?.join(", ") || "N/A"}

🏘️ 𝗚𝗨𝗜𝗟𝗗 𝗜𝗡𝗙𝗢:
┌─ 🏡 𝗡𝗮𝗺𝗲: ${guild.GuildName || "N/A"}
├─ 🆔 𝗜𝗗: ${guild.GuildID || "N/A"}
├─ 📶 𝗟𝗲𝘃𝗲𝗹: ${guild.GuildLevel || "?"}
├─ 👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${guild.GuildMember || "?"}/${guild.GuildCapacity || "?"}
└─ 👑 𝗢𝘄𝗻𝗲𝗿: ${guild.GuildOwner || "?"}

👑 𝗖𝗔𝗣𝗧𝗔𝗜𝗡 𝗜𝗡𝗙𝗢:
┌─ 👤 𝗡𝗮𝗺𝗲: ${captain.nickname || "N/A"}
├─ 🆔 𝗜𝗗: ${captain.accountId || "N/A"}
├─ ⭐ 𝗟𝗲𝘃𝗲𝗹: ${captain.level || "N/A"}
├─ ❤️ 𝗟𝗶𝗸𝗲𝘀: ${captain.liked || "N/A"}
├─ 🏆 𝗥𝗮𝗻𝗸: ${captain.rank || "N/A"}
├─ 🎯 𝗣𝗼𝗶𝗻𝘁𝘀: ${captain.rankingPoints || "N/A"}
├─ 🔫 𝗪𝗲𝗮𝗽𝗼𝗻 𝗦𝗸𝗶𝗻: ${captain.weaponSkinShows?.join(", ") || "N/A"}
├─ 📅 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${captainCreate}
├─ 🏅 𝗕𝗮𝗱𝗴𝗲𝘀: ${captain.badgeCnt || "N/A"}
└─ 📍 𝗣𝗶𝗻 𝗜𝗗: ${captain.pinId || "N/A"}

🐾 𝗖𝗥𝗘𝗗𝗜𝗧 & 𝗣𝗘𝗧:
┌─ 💰 𝗖𝗿𝗲𝗱𝗶𝘁 𝗦𝗰𝗼𝗿𝗲: ${credit.creditScore || "?"}
├─ 🐾 𝗣𝗲𝘁 𝗜𝗗: ${pet.id || "?"}
├─ 🔰 𝗟𝗲𝘃𝗲𝗹: ${pet.level || "?"}
├─ ✨ 𝗦𝗸𝗶𝗹𝗹: ${pet.selectedSkillId || "?"}
├─ 🎨 𝗦𝗸𝗶𝗻: ${pet.skinId || "?"}
└─ 💫 𝗘𝗫𝗣: ${pet.exp || "?"}

💬 𝗦𝗢𝗖𝗜𝗔𝗟 𝗜𝗡𝗙𝗢:
┌─ 🧍‍♂️ 𝗚𝗲𝗻𝗱𝗲𝗿: ${social.gender?.replace("Gender_", "") || "N/A"}
├─ 🌐 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲: ${social.language?.replace("Language_", "") || "N/A"}
├─ 📊 𝗥𝗮𝗻𝗸 𝗦𝗵𝗼𝘄: ${social.rankShow?.replace("RankShow_", "") || "N/A"}
└─ 📝 𝗕𝗶𝗼: ${cleanBio}

✨ 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 ✨
`;

    return api.sendMessage(message, threadID, messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ 𝙀𝙧𝙧𝙤𝙧 𝙛𝙚𝙩𝙘𝙝𝙞𝙣𝙜 𝙙𝙖𝙩𝙖, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧!", event.threadID, event.messageID);
  }
};
