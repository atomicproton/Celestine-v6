const config = require("./config.json");
const commands = require("./modules/commands");
const someone = require("./modules/someone");
const dbConnection = require("./data/dbConnection");
const Discord = require("discord.js");

async function init() {
    console.log("Starting...");

    // Setup discord
    const client = new Discord.Client();
    await client.login(config.token);
    commands.registerCommands(client);

    console.log("Connecting to database...");
    await dbConnection.connect(client);
    console.log("Connected!");

    client.once("ready", () => {
        console.log("Bot started");
    });

    client.on('message', message => {
        commands.runCommand(client, message);
        someone.checkSomeone(client, message);
    });
}

init().catch((e) => {
    console.log(e);
});
