const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/TodoApp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, function (err) {
        if (!err) console.log("Connect Database!");
        else console.log(err)
    })

require('./user.model')
require('./todo.model')