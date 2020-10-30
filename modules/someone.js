const config = require('../config.json');
const discord = require("discord.js");
const fs = require('fs');
const path = require("path");
const utils = require('../utils');

function checkSomeone(client, message) {
    const roleMentions = message.mentions.roles;
    const filteredMentions = roleMentions.find(item => item.name.toLowerCase() === "someone");

    if(filteredMentions) {
        const randomUser = message.channel.members.filter(guildUser => guildUser.user.bot === false).random();
        message.channel.send(`${randomUser}`);
    }
}

module.exports = {checkSomeone};
