
const { zokou } = require("../framework/zokou");

let mutedGroups = [];

zokou(
  {
    nomCom: "mute",
    categorie: "Group",
    reaction: "🔇",
  },
  async (origineMessage) => {
    try {
      const chatId = origineMessage.chatId;
      if (mutedGroups.includes(chatId)) {
        return await origineMessage.reply("*Group is already muted*");
      }
      mutedGroups.push(chatId);
      await origineMessage.reply("*Group muted successfully*");
    } catch (e) {
      console.error(e);
      await origineMessage.error(`${e}\n\ncommand: mute`, e);
    }
  }
);

zokou(
  {
    nomCom: "unmute",
    categorie: "Group",
    reaction: "🔊",
  },
  async (origineMessage) => {
    try {
      const chatId = origineMessage.chatId;
      const index = mutedGroups.indexOf(chatId);
      if (index === -1) {
        return await origineMessage.reply("*Group is not muted*");
      }
      mutedGroups.splice(index, 1);
      await origineMessage.reply("*Group unmuted successfully*");
    } catch (e) {
      console.error(e);
      await origineMessage.error(`${e}\n\ncommand: unmute`, e);
    }
  }
);

// To check if a group is muted before processing messages
zokou(
  {
    // Your main message handling logic here
  },
  async (origineMessage) => {
    try {
      const chatId = origineMessage.chatId;
      if (mutedGroups.includes(chatId) && origineMessage.sender !== "yourBotNumber") {
        // Do nothing or send a message saying the group is muted
        return;
      }
      // Process the message
    } catch (e) {
      console.error(e);
    }
  }
);
```
