import LoginForm from "../views/LoginForm";
import SignUpForm from "../views/SignUpForm";
import TodoList from "../views/TodoList";
import { Switch, Route, Redirect } from 'react-router-dom'
import "../assets/css/style.css"
import { useSelector } from 'react-redux';
export default function TodoApp() {
    const isAuthenticated = useSelector(state => state.isAuthenticated.value);
    return (
        <Switch>
            <Route exact path="/login" render={(props) => !isAuthenticated ? <LoginForm {...props} /> : <Redirect to="/" />} />
            <Route exact path="/" render={(props) => isAuthenticated ? <TodoList {...props} /> : <Redirect to="/login" />} />
            <Route exact path="/register" component={SignUpForm} />
        </Switch>
    )
}