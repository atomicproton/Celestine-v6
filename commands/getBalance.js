const config = require('../config.json');
const userAccessor = require("../data/accessors/userAccessor")

module.exports = {
    name: config.currencyName,
    description: `Check your ${config.currencyName} balance`,
    usage: ["[user = self]"],

    async execute(message, args) {
        let id = message.author.id;
        // TODO: Find and validate user id based on input
        // if(args[0]) {
        //     id = args[0];
        // } else {
        //     id = message.author.id;
        // }

        const balance = await userAccessor.getBalance(id);
        await message.channel.send(`You have ${balance} ${config.currencyName}`);
    }
};
