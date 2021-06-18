import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLocalAccessToken } from "../http.common";
import { addEditTask, addTask, cancelEditTask, changeInputEditTask, deleteTask, doneTask, editTask, fetchTodoList, getInfo, logOut } from "../store/actions/userAction";
import CustomizedSnackbar from "./CustomizedSnacbar";
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: "100%",
        padding: "0 10px",
    },
});


export default function TodoList() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [inputTask, setInputTask] = useState('')
    const editTasks = useSelector(state => {
        return state.editTasks;
    })
    const todoList = useSelector(state => {
        return state.todoList;
    })
    const info = useSelector(state => state.isAuthenticated.info)
    const [timer, setTimer] = useState(0)


    const handleChangeInputTask = (e) => {
        setInputTask(e.target.value);
    }

    const handleChangeInputEditTask = (taskId, description) => {
        dispatch(changeInputEditTask(taskId, description))
    }

    const handleAddTask = () => {
        if (inputTask.trim()) {
            let data = {
                task: inputTask.trim()
            }
            dispatch(addTask(data));
            setInputTask('');
        }
    }

    const handleKeyPress = (e) => {
        if (e.which === 13)
            handleAddTask()
    }

    const handleKeyPressEdit = (taskId, description) => (e) => {
        if (e.which === 13)
            handleEditTask(taskId, description)
    }

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    }

    const handleAddEditTask = async (taskId) => {
        await dispatch(addEditTask(taskId))
    }

    const handleEditTask = (taskId, description) => {
        if (description.trim()) {
            let data = {
                _id: taskId,
                description: description.trim()
            }
            dispatch(editTask(data))
        }
    }

    const handleCancelEditTask = (taskId) => {
        dispatch(cancelEditTask(taskId))
    }

    const handleCompleteTask = (taskId, taskDone) => {
        dispatch(doneTask(taskId, taskDone))
    }

    const handleLogOut = () => {
        dispatch(logOut())
    }

    const handleAction = useCallback(() => {
        document.title = 'Todo List'
        if (!getLocalAccessToken()) {
            dispatch(logOut())
        } else {
            dispatch(getInfo())
            dispatch(fetchTodoList())
        }
    }, [dispatch]);

    useEffect(() => {
        handleAction()
        return () => { clearInterval() }
    }, [handleAction])
    
    useEffect(() => {
        if (timer !== 10)
            setInterval(() => setTimer(timer => ++timer), 1000)
        return () => { clearInterval() }
    }, [])



    return (
        <div className="container bg-grd">
            <div className="todolist">
                <div className="box">
                    <header className="todo-title">
                        {info.firstname + "'s"} todolist
                        <span className="option" onClick={() => handleLogOut()}>log out</span>
                    </header>
                    <div className="input-box">
                        <input placeholder="Enter your task description ..." name="input-task" value={inputTask} onChange={handleChangeInputTask} onKeyPress={handleKeyPress} />
                        <i className='bx bx-plus' onClick={() => handleAddTask()}></i>
                    </div>
                    <div className="todo-content">
                        {todoList.length === 0 && timer !== 10 ? (<div className={classes.root}><Skeleton variant="rect" style={{ borderRadius: "5px" }} width="100%" height={54} /></div>) : ''}
                        {todoList.map((task, index) => {
                            return (
                                <div key={task._id}>
                                    {!editTasks.includes(task._id) ? (
                                        <div className="todo-item">
                                            <input type="checkbox" id={index} defaultChecked={task.done} onChange={(e) => {
                                                handleCompleteTask(task._id, e.target.checked)
                                            }} />
                                            <label htmlFor={index} >
                                                <span className="checkmark"></span>
                                            </label>
                                            <div className="todo-description" >{task.description}</div>
                                            <div className="todo-action">
                                                <i className='bx bx-trash' aria-label={"delete " + task.description} onClick={() => {
                                                    handleDeleteTask(task._id)
                                                }}></i>
                                                {!task.done ? (<i className='bx bxs-edit' aria-label={"edit " + task.description} onClick={() => {
                                                    handleAddEditTask(task._id)
                                                }}></i>) : (<i className='bx bxs-edit' style={{ background: "#ccc" }}></i>)}

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="todo-item">
                                            <input type="checkbox" id={index} defaultChecked={task.done} onClick={(e) => {
                                                handleCompleteTask(task._id, e.target.checked)
                                                handleCancelEditTask(task._id)
                                            }}
                                            />
                                            <label htmlFor={index} >
                                                <span className="checkmark"></span>
                                            </label>
                                            <input className="todo-description"
                                                value={task.description}
                                                placeholder="Edit your task description ..."
                                                onKeyPress={(e) => {
                                                    handleKeyPressEdit(task._id, task.description)
                                                }}
                                                onChange={(e) => { handleChangeInputEditTask(task._id, e.target.value) }}
                                            />
                                            <div className="todo-action">
                                                <i className='bx bx-x' aria-label={"cancel edit " + task.description} onClick={() => { handleCancelEditTask(task._id) }}></i>
                                                <i className='bx bx-check' style={{ backgroundColor: 'green' }} aria-label={"confirm edit " + task.description}
                                                    onClick={() => handleEditTask(task._id, task.description)}>
                                                </i>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <CustomizedSnackbar />
        </div>
    )
}

