module.exports = {
    name: 'test',
    description: "you can ignore me",
    admin: true,

    execute(message, args) {
        message.channel.send(args.toString());
    }
};
