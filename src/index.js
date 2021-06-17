import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from "./layout/TodoApp"
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<TodoApp />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);

