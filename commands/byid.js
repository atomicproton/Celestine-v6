const Discord = require("discord.js");
const utils = require("../utils");

module.exports = {
    name: 'byid',
    description: `Find a user or role in this server by their id`,
    guildOnly: true,
    usage: "[id]",

    async execute(message, args) {
        const id = args[0];

        if (!utils.isNumber(id)) {
            message.channel.send("That's probably not a valid id");
            return;
        }

        let foundMatching = false;

        await message.guild.members.fetch(id)
            .then(user => {
                if (user instanceof Discord.GuildMember) {
                    foundMatching = true;
                    message.channel.send(guildMemberEmbed(user));
                }
            }).catch(err => {
                if (!(err instanceof Discord.DiscordAPIError && err.code === Discord.Constants.APIErrors.UNKNOWN_USER)) {
                    // Error other than user not found
                    throw err;
                }
            });

        if (foundMatching) {
            return;
        }

        await message.guild.roles.fetch(id)
            .then(role => {
                if (role instanceof Discord.Role) {
                    foundMatching = true;
                    message.channel.send(roleEmbed(role));
                }
            }).catch(err => {
                if (!(err instanceof Discord.DiscordAPIError && err.code === Discord.Constants.APIErrors.UNKNOWN_ROLE)) {
                    // Error other than role not found
                    throw err;
                }
            });

        if (foundMatching) {
            return;
        }

        message.channel.send(`I couldn't find anything to match the id, ${utils.getIdiotSynonym()}`);
    }
};

function guildMemberEmbed(guildMember) {
    if (!(guildMember instanceof Discord.GuildMember)) {
        throw "guildMemberEmbed: input is not a guildMember";
    }

    const user = guildMember.user;
    const avatarUrl = user.avatarURL() || user.defaultAvatarURL;

    return new Discord.MessageEmbed()
        .setColor(guildMember.displayHexColor)
        .setTitle(`User: ${user.username}#${user.discriminator}`)
        .setThumbnail(avatarUrl)
        .addFields(
            {name: 'Nickname', value: `${guildMember.nickname || "none"}`},
            {name: 'ID', value: `${user.id}`},
            {name: 'User Created At', value: `${user.createdAt}`},
            {name: 'Joined Server At', value: `${guildMember.joinedAt}`},
        );
}

function roleEmbed(role) {
    if (!(role instanceof Discord.Role)) {
        throw "guildMemberEmbed: input is not a role";
    }

    const serverImageUrl = role.guild.iconURL();

    return new Discord.MessageEmbed()
        .setColor(role.hexColor || "FFFFFF")
        .setTitle(`Role: ${role.name}`)
        .setThumbnail(serverImageUrl)
        .addFields(
            {name: 'ID', value: `${role.id}`},
            {name: 'Member Count (WIP)', value: `${role.members.size}`}, // TODO: Only works with cached members now
            {name: 'Role Created At', value: `${role.createdAt}`},
            {name: 'Display Separately?', value: getBooleanText(role.hoist), inline: true},
            {name: 'Managed?', value: getBooleanText(role.managed), inline: true},
            {name: 'Mentionable?', value: getBooleanText(role.mentionable), inline: true},
        );
}

// TODO: move to utils
function getBooleanText(input) {
    if (input) {
        return "✅ Yes";
    } else {
        return "❌ No";
    }
}
