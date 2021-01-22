const config = require('../config.json');
const mongoose = require('mongoose');

async function connect(client) {
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
    client.dbConnection = mongoose.connection;

    client.dbConnection.on('error', console.error.bind(console, 'connection error:'));
}

module.exports = {connect};