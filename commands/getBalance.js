const config = require('../config.json');
const userAccessor = require("../data/accessors/userAccessor");
const Utils = require("../utils");

module.exports = {
    name: config.currencyName,
    description: `Check your ${config.currencyName} balance`,
    usage: ["[user = self]"],

    async execute(message, args) {
        let user;
        if(args[0] && message.guild) {
            user = await Utils.parseUser(args[0], message.guild);

            if(!user) {
                message.channel.send(`Couldn't find a user for ${args[0]}`);
                return;
            }
        }

        if(user) {
            const id = user.id;
            const balance = await userAccessor.getBalance(id);
            await message.channel.send(`${user.displayName} has ${balance} ${config.currencyName}`);
        } else {
            const id = message.author.id;
            const balance = await userAccessor.getBalance(id);
            await message.channel.send(`You have ${balance} ${config.currencyName}`);
        }
    }
};
