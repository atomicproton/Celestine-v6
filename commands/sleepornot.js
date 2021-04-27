const config = require('../config.json');
const userAccessor = require("../data/accessors/userAccessor");
const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const utils = require("../utils");

module.exports = {
    name: "sleepornot",
    description: `Should you sleep or not?`,
    guildOnly: true,

    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            message.channel.send(`You must be in a voice channel to run this, ${utils.getIdiotSynonym()}`);
            return;
        }
        if (!voiceChannel.permissionsFor(message.client.user).has(["CONNECT", "VIEW_CHANNEL", "SPEAK"])) {
            message.channel.send(`I don't have permissions to join or speak in that channel, ${utils.getIdiotSynonym()}`);
            return;
        }

        try {
            const voiceConnection = await voiceChannel.join();

            const toPlay = [];
            toPlay.push(getRandomFile("assets/sleep-or-not/intro"));
            if (Math.floor(Math.random() * 2) === 0) {
                toPlay.push(getRandomFile("assets/sleep-or-not/sleep"));
            } else {
                toPlay.push(getRandomFile("assets/sleep-or-not/not"));
            }
            toPlay.push(getRandomFile("assets/sleep-or-not/outro"));

            await playAudio(voiceConnection, toPlay);
        } catch (e) {
            message.channel.send("Something went wrong");
            console.log(e);
        }
    }
};

async function playAudio(voiceConnection, toPlay) {
    const fileName = toPlay.shift();
    const dispatcher = voiceConnection.play(fileName);
    // const dispatcher = voiceConnection.play(path.join(__dirname, "assets", "sleep-or-not", "not2.wav"));

    dispatcher.on('start', () => {
        console.log(`Playing ${fileName}`);
    });

    dispatcher.on('finish', () => {
        console.log(`Finished ${fileName}`);

        if (toPlay.length > 0) {
            playAudio(voiceConnection, toPlay);
        } else {
            voiceConnection.disconnect();
        }
    });

    dispatcher.on('error', console.error);
}

function getRandomFile(dir) {
    const files = fs.readdirSync(dir);
    return path.join(dir, utils.getRandom(files));
}
