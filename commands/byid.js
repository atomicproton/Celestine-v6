const Discord = require("discord.js");
const utils = require("../utils");

module.exports = {
    name: 'byid',
    description: `Find a user in this server by their id`,
    guildOnly: true,
    usage: "[id]",

    execute(message, args) {
        const id = args[0];

        if (!utils.isNumber(id)) {
            message.channel.send("That's probably not a valid id");
            return;
        }

        message.guild.members.fetch(id)
            .then(user => {
                message.channel.send(guildMemberEmbed(user));
            }).catch(err => {
            if (err instanceof Discord.DiscordAPIError && err.code === Discord.Constants.APIErrors.UNKNOWN_USER) {
                console.log(err);
                message.channel.send("I couldn't find a matching user");
            } else {
                throw err;
            }
        });
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
        .setTitle(`${user.username}#${user.discriminator}`)
        .setThumbnail(avatarUrl)
        .addFields(
            {name: 'Nickname', value: `${guildMember.nickname || "none"}`},
            {name: 'ID', value: `${user.id}`},
            {name: 'User Created At', value: `${user.createdAt}`},
            {name: 'Joined Server At', value: `${guildMember.joinedAt}`},
        );
}
