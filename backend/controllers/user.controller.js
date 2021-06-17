const Todo = require('../models/todo.model');
const User = require('../models/user.model');
var _ = require('lodash');

const getInFor = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.user.id }).select('-todo').exec()
        return res.status(200).json(user.toJSON())
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}
const getTodoList = async (req, res, next) => {
    // console.log(req.user.id)
    try {
        let user = await User.findOne({ _id: req.user.id }).populate('todo').exec()
        return res.status(200).json(user.todo)
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}

const addTodo = async (req, res, next) => {
    try {
        let task = new Todo();
        task.description = req.body.task;
        let _task = await task.save();
        console.log(_task._id)
        await User.findByIdAndUpdate(req.user.id, {
            $push:
            {
                todo:
                {
                    $each: [_task],
                    $position: 0
                }
            }
        });

        return res.status(200).json({task:_task.toJSON(), msg:"Successfully add task!"});
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: error.message })
    }
}

const deleteTodo = async (req, res, next) => {
    console.log(req.body)
    try {
        await User.findOneAndUpdate({ _id: req.user.id }, {
            $pull: {
                todo: req.body.taskId

            }
        })
        await Todo.findByIdAndRemove(req.body.taskId);
        return res.status(200).json({ msg: "Successfully delete task!" })
    } catch (error) {
        console.log(error)
    }
}

const editTask = async (req, res, next) => {
    try {
        if (req.body.description) {
            await Todo.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    description: req.body.description
                }
            })
            return res.status(200).json({ msg: "Successfully edit task!" })
        } else if (req.body.done !== undefined) {
            await Todo.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    done: req.body.done
                }
            })
            return res.status(200).json({ msg: "Successfully edit task!" })
        }
        throw Error("Please enter your task desciption!")
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}

module.exports = {
    getInFor,
    addTodo,
    getTodoList,
    deleteTodo,
    editTask
}

