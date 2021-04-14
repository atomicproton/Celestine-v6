const config = require('../config.json');
const userAccessor = require("../data/accessors/userAccessor");

module.exports = {
    name: "dailees",
    description: `Get free ${config.currencyName}!`,

    async execute(message, args) {
        const id = message.author.id;
        const eemount = 200;

        // await userAccessor.incrementBalance(id, 200);
        const date = new Date();
        const user = await userAccessor.getOrInitUser(id);
        if (user.lastClaim
            && user.lastClaim.month >= date.getMonth()
            && user.lastClaim.day >= date.getDate()
            && user.lastClaim.year >= date.getFullYear()) {
            // already claimed today
            await message.channel.send(`You already did that today >:(`);
            return;
        }

        user.lastClaim.month = date.getMonth();
        user.lastClaim.day = date.getDate();
        user.lastClaim.year = date.getFullYear();
        user.lastUsername = message.author.username;
        await user.save();

        // Separate for now since I'm having trouble adding it above
        await userAccessor.incrementBalance(message.author.id, eemount);

        const balance = await userAccessor.getBalance(id);
        await message.channel.send(`You now have ${balance} ${config.currencyName} (+${eemount})!`);
    }
};
