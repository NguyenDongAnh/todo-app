const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true, index: { expires: process.env.REFRESH_TOKEN_LIFE } })

const tokenModel = mongoose.model('token', tokenSchema);
module.exports = tokenModel;