const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: "Please enter your task desciption!"
    },
    done: {
        type: Boolean,
        default: false
    }
})

todoSchema.set('toJSON', {
    versionKey: false,
});
const todoModel = mongoose.model('todo', todoSchema);
module.exports = todoModel;