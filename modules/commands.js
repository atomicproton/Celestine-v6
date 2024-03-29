const config = require('../config.json');
const discord = require("discord.js");
const fs = require('fs');
const path = require("path");
const utils = require('../utils');

function registerCommands(client) {
    client.commands = new discord.Collection();
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, '..', 'commands', file));
        client.commands.set(command.name, command);
    }
}

function runCommand(client, message) {
    // TODO: per server prefixes
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = utils.parseArguments(message.content);
    const commandName = args.shift().toLowerCase();

    if (!commandName) {
        return;
    }
    if (!client.commands.has(commandName)) { // Check command exists
        message.channel.send(`that command doesn't exist, ${utils.getIdiotSynonym()}`);
        return;
    }

    const command = client.commands.get(commandName);
    if (command.guildOnly && message.channel.type !== 'text') { // Check for DMs
        message.channel.send("Maybe we shouldn't do this here...try executing the command in a server?");
        return;
    }
    if (command.permissions && !message.member.hasPermission(command.permissions)) { // Check permissions
        message.channel.send("I can't let you do that");
        return;
    }
    if (command.admin && message.author.id !== "136711083313463296") {
        message.channel.send("I can't let you do that");
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('well ya broke something');
    }
}

module.exports = {registerCommands, runCommand};
