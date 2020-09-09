const config = require("./config.json");
const discord = require("discord.js");
const fs = require('fs');
const path = require("path");

console.log("Starting...");
const client = new discord.Client();
client.login(config.token);

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("Started");
});

client.on('message', message => {
    // TODO: per server prefixes
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!commandName) {
        return;
    }
    if(!client.commands.has(commandName)) { // Check command exists
        message.channel.send(`that command doesn't exist, ${getIdiotSynonym()}`);
        return;
    }

    const command = client.commands.get(commandName);
    if (command.guildOnly && message.channel.type !== 'text') { // Check for DMs
        message.channel.send("Maybe we shouldn't do this here...try executing the command in a server?");
        return;
    }
    if(command.permissions && !message.member.hasPermission(command.permissions)) { // Check permissions
        message.channel.send("I can't let you do that");
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('well ya broke something');
    }
});

function getIdiotSynonym() {
    const idiots = [];
    idiots.push("idiot");
    idiots.push("ya dumdum");
    idiots.push("dummy");

    return getRandom(idiots);
}

function getRandom(list) {
    const random = Math.floor(Math.random() * list.length);
    return list[random];
}
