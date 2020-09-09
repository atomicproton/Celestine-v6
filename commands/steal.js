const discord = require("discord.js");

module.exports = {
    name: 'steal',
    description: 'Steals the given custom emoji and adds it to this server',
    usage: "[custom emoji]",
    guildOnly: true,
    permissions: ["MANAGE_EMOJIS"],

    execute(message, args) {
        if (!(args[0].startsWith("<") && args[0].endsWith(">"))) {
            sendBadEmojiMessage(message);
            return;
        }

        const emojiSplit = args[0].split(":");
        if (!(emojiSplit.length === 3)) {
            sendBadEmojiMessage(message);
            return;
        }

        const emojiIdWithCarrot = emojiSplit[emojiSplit.length - 1];
        const emojiId = emojiIdWithCarrot.substring(0, emojiIdWithCarrot.length - 1);
        const emojiName = emojiSplit[emojiSplit.length - 2];
        let emojiImageUrl;

        if (emojiSplit[0] === "<a") {
            // Animated
            emojiImageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.gif`;
        } else {
            // Still
            emojiImageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
        }

        message.guild.emojis.create(emojiImageUrl, emojiName, {"reason": `created by ${message.author.username} (${message.author.id})`})
            .then(emoji => {
                message.channel.send(`Added the emoji: ${emoji.toString()}`);
            }).catch(err => {
            console.log(err);
            message.channel.send("Failed to create emoji");
        });
    }
};

function sendBadEmojiMessage(message) {
    message.channel.send("You expect me to believe that's a custom emoji?!?!");
}
