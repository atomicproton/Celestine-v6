const Discord = require("discord.js");
const utils = require("../utils");

module.exports = {
    name: 'steal',
    description: 'Steals the given custom emoji and adds it to this server',
    usage: ["[custom emoji]", "[emoji id] [emoji name] [animated? = false]"],
    guildOnly: true,
    permissions: ["MANAGE_EMOJIS"],

    execute(message, args) {
        if (args.length === 0) {
            message.channel.send("What do you want me to steal...air??");
            return;
        }

        let emojiId;
        let emojiName;
        let animated;

        if (args.length === 1) {
            const emojiInfo = parseCustomEmoji(message, args);
            emojiId = emojiInfo.emojiId;
            emojiName = emojiInfo.emojiName;
            animated = emojiInfo.animated;
        } else if (args.length === 2 || args.length === 3) {
            emojiId = args[0];
            emojiName = args[1];

            if (!utils.isNumber(emojiId)) {
                message.channel.send("That's probably not a valid id");
                return;
            }

            if (emojiName.length > 20) {
                message.channel.send("Try to keep the length of the name under 20 characters");
                return;
            }

            // TODO: make this a function because apparently this is one of the better ways to do this in JS ._.
            if (!args[2]) {
                animated = false;
            } else if (args[2].toLowerCase() === "true") {
                animated = true;
            } else if (args[2].toLowerCase() === "false") {
                animated = false;
            } else {
                message.channel.send("Could not figure out if that emoji was animated or not. Try speaking more clearly?");
                return;
            }
        } else {
            message.channel.send("That's a lot of parameters, I'm expecting a maximum of 3");
            return;
        }

        let emojiImageUrl;

        if (animated) {
            emojiImageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.gif`;
        } else {
            emojiImageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
        }

        // Limit emoji to certain roles example:
        // const role = message.guild.roles.cache.find(role => role.id === "ROLE_ID");
        // const emojiOptions = {roles: [role], reason: `created by ${message.author.username} (${message.author.id})`};
        const emojiOptions = {reason: `created by ${message.author.username}#${message.author.discriminator} (${message.author.id})`};

        message.guild.emojis.create(emojiImageUrl, emojiName, emojiOptions)
            .then(emoji => {
                message.channel.send(`Added the emoji: ${emoji.toString()}`);
            }).catch(err => {
            console.log(err);
            if (err instanceof Discord.DiscordAPIError && err.code === 50035) {
                message.channel.send("Something went wrong with the api request; this usually is the result of an invalid emoji id.");
            } else {
                message.channel.send("Failed to create emoji");
            }
        });
    }
};

function parseCustomEmoji(message, args) {
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
    const animated = emojiSplit[0] === "<a";

    return {
        emojiId: emojiId,
        emojiName: emojiName,
        animated: animated,
    };
}

function sendBadEmojiMessage(message) {
    message.channel.send("You expect me to believe that's a custom emoji?!?!");
}
