import { applyMiddleware, createStore, combineReducers, compose } from "redux";

import thunk from 'redux-thunk'
import { actionOfUserReducer, editTaskReducer, authReducer, alertActionReducer } from "./reducers/userReducer";

const initialState = {
    isAuthenticated: { value: true, info: {} },
    todoList: [],
    editTasks: [],
    // loading: false,
    alert: { snackbarOpen: false, snackbarType: 'success', snackbarMessage: '' }
}
const reducer = combineReducers({
    isAuthenticated: authReducer,
    todoList: actionOfUserReducer,
    editTasks: editTaskReducer,
    alert: alertActionReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))


export default store

