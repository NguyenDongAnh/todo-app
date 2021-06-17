const express = require('express');
const user_controller = require('../controllers/user.controller');
let router = express.Router();

router.post('/me', user_controller.getInFor);
router.post('/todo', user_controller.addTodo);
router.put('/todo', user_controller.editTask)
router.delete('/todo', user_controller.deleteTodo)
router.get('/todolist', user_controller.getTodoList);

module.exports = router;