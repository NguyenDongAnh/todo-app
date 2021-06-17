
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    alert: {
        position: 'absolute',
        bottom: "50px",
        left: '50px',
        '& > * + *': {
            marginTop: theme.spacing(1),
        },
    },
}));

export default function CustomizedSnackbars() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const alert = useSelector(state => {
        // console.log(state.alert)
        return state.alert
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({ type: "set_snackbar_default" })
    };
    return (
        <div className={classes.alert}>
            <Snackbar open={alert.snackbarOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }} >
                <Alert onClose={handleClose} severity={alert.snackbarType}>{alert.snackbarMessage}</Alert>
            </Snackbar>
        </div>
    );
}