const config = require("./config.json");
const commands = require("./modules/commands");
const someone = require("./modules/someone");
const Discord = require("discord.js");

console.log("Starting...");

// Setup discord
const client = new Discord.Client();
client.login(config.token);
commands.registerCommands(client);

client.once("ready", () => {
    console.log("Bot started");
});

client.on('message', message => {
    commands.runCommand(client, message);
    someone.checkSomeone(client, message);
});
