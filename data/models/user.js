const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

let userSchema = new mongoose.Schema({
    _id: {
        // type: mongoose.ObjectId
        type: String
    },
    balance: {
        // type: mongoose.Types.Long,
        type: mongoose.Types.Long,
        min: [0, 'Balance cannot be less than 0'],
        required: [true, 'Balance is missing'],
        default: 44,
        // validate : {
        //     validator : Number.isInteger,
        //     message   : '{VALUE} is not an integer value'
        // }
    },
    lastClaim: {
        month: Number,
        day: Number,
        year: Number,
    },
    lastUsername: String
});

module.exports = mongoose.model("User", userSchema);