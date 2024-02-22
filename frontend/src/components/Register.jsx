import React, { useState } from 'react'
import axios from 'axios'
import ErrorMessage from './ErrorMessage'
import { redirect, useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [fullname, setFullname] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState()
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()


        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const data = {
            email: email,
            username: username,
            password: password,
            full_name: fullname,
        }
        console.log(data)
        axios.post('/api/create_user', data)
            .then(response => {
                if (response.status === 200) {
                    return navigate('/login');
                }
                console.log(response)
            })
            .catch(error => {
                error.response.status === 400 ? setError('Invalid data') : setError('Something went wrong')
            })
    }

    return (
        <div>
            <h2 className='text-2xl font-bold text-center'>Register</h2>
            {error && <ErrorMessage message={error} />}
            <form className='w-1/2 mx-auto mt-8' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor='email' className='block text-sm font-bold mb-2'>Email</label>
                    <input onChange={e => setEmail(e.target.value)} value={email} required type='email' id='email' name='email' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <div className='mb-4'>
                    <label htmlFor='username' className='block text-sm font-bold mb-2'>Username</label>
                    <input onChange={e => setUsername(e.target.value)} value={username} required type='text' id='username' name='username' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <div className='mb-4'>
                    <label htmlFor='fullname' className='block text-sm font-bold mb-2'>Full Name</label>
                    <input onChange={e => setFullname(e.target.value)} value={fullname} type='text' id='fullname' name='fullname' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <div className='mb-4'>
                    <label htmlFor='password' className='block text-sm font-bold mb-2'>Password</label>
                    <input onChange={e => setPassword(e.target.value)} value={password} required type='password' id='password' name='password' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <div className='mb-4'>
                    <label htmlFor='confirm-password' className='block text-sm font-bold mb-2'>Confirm Password</label>
                    <input onChange={e => setConfirmPassword(e.target.value)} required value={confirmPassword} type='password' id='confirm-password' name='confirm-password' className='w-full p-2 border border-gray-300 rounded' autoComplete="off" />
                </div>
                <button type='submit' className='w-full p-2 bg-blue-500 text-white rounded'>Register</button>
            </form>
            <p className='text-center mt-4'>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></p>
        </div>
    )
}

export default Register