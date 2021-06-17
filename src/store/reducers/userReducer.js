import * as Types from '../constants/actionType'
import { instance, clearTokens, getLocalAccessToken } from '../../http.common';
const authReducer = (state = false, action) => {
    switch (action.type) {
        case Types.LOG_IN:
            instance.setAccessToken(action.payload.access_token)
            instance.setTokens(action.payload.tokens)
            instance.defaults.headers.common['x-access-token'] = getLocalAccessToken();
            return { ...state, value: true };
        case Types.LOG_OUT:
            clearTokens();
            return { ...state, value: false, info: {} };
        case Types.GET_INFO:
            return {
                ...state, info: {
                    email: action.payload.email,
                    firstname: action.payload.firstname,
                    lastname: action.payload.lastname,
                    phonenumber: action.payload.phonenumber
                }
            };
        default:
            return state;
    }

}

const actionOfUserReducer = (state = [], action) => {
    switch (action.type) {
        case Types.FETCH_TODO_LIST:
            return [...action.payload];
        case Types.ADD_TASK:
            return [action.payload.task, ...state];
        case Types.DELETE_TASK:
            return state.filter((task) => task._id !== action.payload);
        case Types.EDIT_TASK:
            return state.map(task => {
                if (task._id === action.payload._id) {
                    return { ...task, description: action.payload.description };
                }
                return task;
            });
        case Types.DONE_TASK:
            return state.map(task => {
                if (task._id === action.payload._id) {
                    return { ...task, done: !task.done };
                }
                return task;
            });
        default: return state;
    }
}

const editTaskReducer = (state = [], action) => {
    switch (action.type) {
        case Types.ADD_EDIT_TASK:
            return [...state, action.payload];
        case Types.CANCEL_EDIT_TASK:
            return state.filter((task) => task !== action.payload);
        case Types.EDIT_TASK:
            return state.filter((task) => task !== action.payload._id);
        default:
            return state;
    }
}

const alertActionReducer = (state = {}, action) => {
    switch (action.type) {
        case Types.ADD_TASK_SUCCESS:
            return { ...setSnackbar(true, "success", action.payload.msg) }
        case Types.DELETE_TASK_SUCCESS:
            return { ...setSnackbar(true, "success", action.payload.msg) }
        case Types.EDIT_TASK_SUCCESS:
            return { ...setSnackbar(true, "success", action.payload.msg) }
        case Types.ADD_TASK_ERROR:
            return { ...setSnackbar(true, "error", action.payload.msg) }
        case Types.DELETE_TASK_ERROR:
            return { ...setSnackbar(true, "error", action.payload.msg) }
        case Types.EDIT_TASK_ERROR:
            return { ...setSnackbar(true, "error", action.payload.msg) }
        case Types.LOG_IN_ERROR:
            return { ...setSnackbar(true, "error", action.payload.msg) }
        case Types.REGISTER_ERROR:
            return { ...setSnackbar(true, "error", action.payload.msg) }
        default:
            return { ...setSnackbar(false, state.snackbarType, '') };
    }
}

const setSnackbar = (snackbarOpen, snackbarType, snackbarMessage) => ({
    snackbarOpen: snackbarOpen,
    snackbarType: snackbarType,
    snackbarMessage: snackbarMessage
})
export { authReducer, actionOfUserReducer, editTaskReducer, alertActionReducer }