import * as Types from "../constants/actionType";
import { instance } from "../../http.common";


const logIn = (data) => async (dispatch) => {
    try {
        let response = await instance({
            method: 'post',
            url: '/auth/login',
            data: data
        })
        dispatch({ type: Types.LOG_IN, payload: response.data })
    } catch (error) {
        dispatch({ type: Types.LOG_IN_ERROR, payload: error.response.data })
    }
}

const logOut = () => async (dispatch) => {
    try {
        // await instance({
        //     method: 'post',
        //     url: '/auth/logout',
        // })
        dispatch({ type: Types.LOG_OUT })
    } catch (error) {

    }
}


const getInfo = () => async (dispatch) => {
    try {
        let response = await instance({
            method: 'post',
            url: '/me',
        })
        dispatch({ type: Types.GET_INFO, payload: response.data })

    } catch (error) {
        console.log(error.response?.data?.msg)
    }
}

const fetchTodoList = () => async (dispatch) => {
    try {
        let response = await instance({
            method: 'get',
            url: '/todolist'
        })
        dispatch({ type: Types.FETCH_TODO_LIST, payload: response.data })
    } catch (error) {
        console.log(error.response?.data?.msg)
    }
}

const addTask = (task) => async (dispatch) => {
    try {
        let response = await instance({
            method: 'post',
            url: '/todo',
            data: task
        })
        console.log(response.data.msg)
        dispatch({ type: Types.ADD_TASK, payload: response.data })
        dispatch({ type: Types.ADD_TASK_SUCCESS, payload: response.data })
    } catch (error) {
        dispatch({ type: Types.ADD_TASK_ERROR, payload: error.response.data })
    }
}

const deleteTask = (taskId) => async (dispatch) => {
    try {
        let response = await instance({
            method: 'delete',
            url: '/todo',
            data: { taskId: taskId }
        })
        dispatch({ type: Types.DELETE_TASK, payload: taskId })
        dispatch({ type: Types.DELETE_TASK_SUCCESS, payload: response.data })
    } catch (error) {
        dispatch({ type: Types.DELETE_TASK_ERROR, payload: error.response.data })
    }
}

const addEditTask = (taskId) => async (dispatch) => {
    dispatch({ type: Types.ADD_EDIT_TASK, payload: taskId })
}


const cancelEditTask = (taskId) => async (dispatch) => {
    dispatch({ type: Types.CANCEL_EDIT_TASK, payload: taskId })
}

const editTask = (data) => async (dispatch) => {
    try {
        let response = await instance({
            method: 'put',
            url: '/todo',
            data: data
        })
        console.log(response.data)
        dispatch({ type: Types.EDIT_TASK, payload: data })
        dispatch({ type: Types.EDIT_TASK_SUCCESS, payload: response.data })
    } catch (error) {
        dispatch({ type: Types.EDIT_TASK_ERROR, payload: error.response.data })
    }
}

const doneTask = (taskId, taskDone) => async (dispatch) => {
    try {
        await instance({
            method: 'put',
            url: '/todo',
            data: { _id: taskId, done: taskDone }
        })
        dispatch({ type: Types.DONE_TASK, payload: taskId })
    } catch (error) {
    }
}



export { logIn, logOut, getInfo, fetchTodoList, addTask, deleteTask, addEditTask, cancelEditTask, editTask, doneTask }