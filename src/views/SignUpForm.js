import React, { useRef } from 'react';
import '../assets/css/auth.css'
import { useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';
import { instance } from '../http.common';
import CustomizedSnackbars from './CustomizedSnacbar';
import { useDispatch } from 'react-redux';
import * as Types from "../store/constants/actionType";

export default function SignUp() {
    const history = useHistory()
    const dispatch = useDispatch()
    const { register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()
    const password = useRef({});
    password.current = watch("password", "");
    const onRegister = async (data) => {
        try {
            await instance({
                method: 'post',
                url: '/auth/register',
                data: data
            })
            history.push('/')
        } catch (error) {
            dispatch({ type: Types.REGISTER_ERROR, payload: error.response.data })
            console.log(error.response?.data.msg)
        }
    }
    console.log(errors)
    return (
        <div className="container bg-grd">
            <div className="register">
                <div className="box">
                    <div className="title">
                        Registration
                    </div>
                    <form onSubmit={handleSubmit(onRegister)}>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">First Name</span>
                                <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    required
                                    autoComplete="off"
                                    {...register('firstname', { required: 'First name is required!' })}
                                />
                                {errors?.firstname && <p className="error"><i className='bx bxs-error-alt'></i>{errors.firstname.message}</p>}
                            </div>
                            <div className="input-box">
                                <span className="details">Last Name</span>
                                <input
                                    type="text"
                                    placeholder="Enter your last name"
                                    required
                                    autoComplete="off"
                                    {...register('lastname', { required: 'Last name is required!' })}
                                />
                                {errors?.lastname && <p className="error"><i className='bx bxs-error-alt'></i>{errors.lastname.message}</p>}
                            </div>
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="off"
                                    {...register('email', { required: 'Email is required!' })}
                                />
                                {errors?.email && <p className="error"><i className='bx bxs-error-alt'></i>{errors.email.message}</p>}
                            </div>
                            <div className="input-box">
                                <span className="details">Phone Number</span>
                                <input
                                    type="text"
                                    placeholder="Enter your phone number"
                                    autoComplete="off"
                                    required
                                    {...register('phonenumber', { required: 'Phonenumber is required!' })}
                                />
                                {errors?.phonenumber && <p className="error"><i className='bx bxs-error-alt'></i>{errors.phonenumber.message}</p>}
                            </div>
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    {...register('password',
                                        {
                                            required: 'Password is required!',
                                            minLength: {
                                                value: 6,
                                                message: "Password must have at least 6 characters"
                                            }
                                        })}
                                />
                                {errors?.password && <p className="error"><i className='bx bxs-error-alt'></i>{errors.password.message}</p>}
                            </div>
                            <div className="input-box">
                                <span className="details">Confirm Password</span>
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    required
                                    {...register("repassword", {
                                        validate: value =>
                                            value === password.current || "The confirm password don't match"
                                    })}
                                />
                                {errors?.repassword && <p className="error"><i className='bx bxs-error-alt'></i>{errors.repassword.message}</p>}
                            </div>
                        </div>
                        <div className="option">
                            <span><Link to='/'>Already have an account?</Link></span>
                        </div>
                        <div className="button">
                            <input type="submit" value="Register" />
                        </div>
                    </form>
                </div>
            </div>
            <CustomizedSnackbars />
        </div>
    );
}