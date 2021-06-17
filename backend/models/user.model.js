const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: "First name is required !"
    },
    lastname: {
        type: String,
        required: "Last name is required !"
    },
    phonenumber: {
        type: String,
        required: "Phonenumber is required !"
    },
    email: {
        type: String,
        required: "Email is required !"
    },
    password: {
        type: String,
        required: 'Password is required !'
    },
    role: {
        type: String,
        enum: ["user", 'admin'],
        default: "user"
    },
    todo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'todo' }]
})

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
        delete ret.todo;
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;