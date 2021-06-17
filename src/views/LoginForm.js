import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn } from '../store/actions/userAction';
import CustomizedSnackbars from './CustomizedSnacbar';
export default function LoginForm() {
    const dispatch = useDispatch()
    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const onLogin = async (data) => {
        dispatch(logIn(data))
    };

    return (
        <div className="container bg-grd">
            <div className="register" style={{ maxWidth: '500px' }}>
                <div className="box">
                    <div className="title">
                        Log In
                    </div>
                    <form onSubmit={handleSubmit(onLogin)} style={{ width: '100%' }}>
                        <div className="user-details">
                            <div className="input-box" style={{ width: '100%' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    autoComplete="off"
                                    {...register('email', { required: 'Email is required!' })}
                                />
                                {errors?.email && <p className="error"><i className='bx bxs-error-alt'></i>{errors.email.message}</p>}
                            </div>
                            <div className="input-box" style={{ width: '100%' }}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    {...register('password',
                                        {
                                            required: 'Password is required!',
                                            minLength: {
                                                value: 6,
                                                message: "Password must have at least 6 characters"
                                            },
                                            maxLength: {
                                                value: 12,
                                                message: "Password should be maximun 12 characters"
                                            }
                                        })}
                                />
                                {errors?.password && <p className="error"><i className='bx bxs-error-alt'></i>{errors.password.message}</p>}
                            </div>
                        </div>
                        <div className="option">
                            <span><Link to='/'>Forgot password ?</Link></span>
                            <span><Link to='/register'>Sign up</Link></span>
                        </div>
                        <div className="button">
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
            <CustomizedSnackbars/>
        </div>
    );
}