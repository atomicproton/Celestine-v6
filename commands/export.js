const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const utils = require("../utils");

module.exports = {
    name: "export",
    description: `Exports the text contents of a channel`,
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],

    async execute(message, args) {
        if (!message.channel.permissionsFor(message.client.user).has(["READ_MESSAGE_HISTORY", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_EMOJIS"])) {
            message.channel.send(`I don't have permissions to view message history, attach files, or use external emoji, ${utils.getIdiotSynonym()}`);
            return;
        }

        // const reaction = await message.react("");
        const loadingMessage = await message.channel.send("Exporting...");
        const channelName = message.channel.name.toLowerCase().replace(/[^a-zA-Z0-9-]+/g, "");

        const filename = "export_" + channelName + "_" + new Date().getTime() + ".txt";
        const dir = 'temp';
        const fullFileName = path.join(dir, filename);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        const fileStream = fs.createWriteStream(fullFileName, { flags: 'a', recursive: true });

        // Write channel name
        const border = "-".repeat(channelName.length);
        fileStream.write(border + "\n" + channelName + "\n" + border + "\n\n");

        const messageManager = message.channel.messages;

        const messagesArray = [];
        await fetchMessages(messageManager, message.id, messagesArray, 20);

        for (let i = messagesArray.length - 1; i >= 0; i--) {
            fileStream.write(messagesArray[i] + "\n");
        }

        const attachment = new Discord.MessageAttachment(fullFileName, channelName + ".txt");
        await message.channel.send(attachment);
        fs.unlink(fullFileName, () => {});
        loadingMessage.delete();
    }
};

async function fetchMessages(messageManager, lastId, messagesArray, remaining) {
    const fetched = await messageManager.fetch({before: lastId});
    const fetchedArray = fetched.array();
    if (fetchedArray.length === 0 || remaining <= 0) {
        return;
    }
    const newLastId = fetchedArray[fetchedArray.length - 1].id;
    fetchedArray.forEach(entry => {
        if(entry.type === "DEFAULT" && entry.content.length > 0 && !entry.author.bot) {
            messagesArray.push(entry.content + "");
        }
    });
    await timeout(400);

    await fetchMessages(messageManager, newLastId, messagesArray, remaining - 1);
}

async function timeout(ms) { //timeout that returns a promise
    return new Promise(resolve => setTimeout(resolve, ms));
}
