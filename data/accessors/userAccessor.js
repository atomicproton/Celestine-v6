const db = require("../dbConnection");
const userSchema = require("../models/user");

/**
 * @param {string} id
 */
async function getUser(id) {
    if (!(typeof id === "string")) {
        throw "userAccessor: id must be a string";
    }

    return userSchema.findById(id);
}

/**
 * @param {string} id
 */
async function initUser(id) {
    if (!(typeof id === "string")) {
        throw "userAccessor: id must be a string";
    }

    const newDoc = new userSchema({_id: id});
    await newDoc.save();

    return getUser(id);
}

/**
 * @param {string} id
 */
async function getOrInitUser(id) {
    const getRequest = await getUser(id);
    if (getRequest) {
        return getRequest;
    }
    return initUser(id);
}

/**
 * @param {string} id
 */
async function getBalance(id) {
    const user = await getOrInitUser(id);

    return user.balance;
}

/**
 * @param {string} id
 */
async function incrementBalance(id, amount) {
    await getOrInitUser(id); // Make sure user has been init separately so we can increment balance
    await userSchema.findByIdAndUpdate(id, {"$inc": {balance: amount}}, {upsert: true, setDefaultsOnInsert: true});
}

module.exports = {getUser, initUser, getOrInitUser, getBalance, incrementBalance};
